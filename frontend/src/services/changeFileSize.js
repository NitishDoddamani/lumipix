import { compressImage } from "./imageCompression";

const MAX_INPUT_BYTES = 25 * 1024 * 1024;

// Upscaling too far can hang the tab rendering a huge canvas —
// this is a sane ceiling, not a hard technical limit.
const MAX_UPSCALE_FACTOR = 4;
const UPSCALE_ITERATIONS = 10;

// Resolution moves in coarse, unpredictable jumps (rounding to whole
// pixels can flip file size by tens of KB in one step). Quality is a
// much finer, more continuous lever, so we use it to fine-tune the
// result after resolution search gets us in the right neighborhood.
const QUALITY_REFINE_ITERATIONS = 8;
const MIN_REFINE_QUALITY = 0.5;

export async function changeFileSize(file, settings) {
  validateFile(file);

  const targetBytes = Number(settings.targetSize) * 1024;

  if (!targetBytes || targetBytes <= 0) {
    throw new Error("Enter a valid target size.");
  }

  if (targetBytes <= file.size) {
    // Shrinking: delegate to the existing, well-tested compressor.
    const result = await compressImage(file, {
      mode: "target",
      targetSize: settings.targetSize,
      keepMetadata: settings.keepMetadata,
    });

    return { ...result, direction: "shrink" };
  }

  // Growing: no quality knob alone can invent detail, so upscaling
  // dimensions is the primary lever — quality is used afterwards
  // only to fine-tune within the resolution step we land on.
  return await growToTargetSize(file, targetBytes);
}

function validateFile(file) {
  if (!file) throw new Error("No image selected.");

  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Selected file is not a valid image.");
  }

  if (file.size === 0) throw new Error("Selected image is empty.");

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `Image is too large to process in-browser (max ${
        MAX_INPUT_BYTES / (1024 * 1024)
      } MB).`
    );
  }
}

async function growToTargetSize(file, targetBytes) {
  const dimensions = await getDimensions(file);

  const outputType =
    file.type === "image/png"
      ? "image/png"
      : file.type === "image/webp"
      ? "image/webp"
      : "image/jpeg";

  const tolerance = getTolerance(targetBytes);

  let low = 1;
  let high = MAX_UPSCALE_FACTOR;

  let best = await encodeAtDimensions(
    file,
    dimensions.width,
    dimensions.height,
    outputType,
    1
  );

  const maxCandidate = await encodeAtScale(
    file,
    dimensions,
    MAX_UPSCALE_FACTOR,
    outputType
  );

  if (maxCandidate.blob.size < targetBytes) {
    // Even the largest allowed upscale can't reach the target —
    // return the biggest we're willing to make instead of looping.
    best = maxCandidate;
  } else {
    // Track the smallest resolution candidate that still overshoots
    // the target — this is what quality-refinement will dial back
    // once the resolution search finishes.
    let overshoot = null;

    for (let i = 0; i < UPSCALE_ITERATIONS; i++) {
      const mid = (low + high) / 2;

      const candidate = await encodeAtScale(file, dimensions, mid, outputType);

      if (
        Math.abs(candidate.blob.size - targetBytes) <
        Math.abs(best.blob.size - targetBytes)
      ) {
        best = candidate;
      }

      if (candidate.blob.size >= targetBytes) {
        if (!overshoot || candidate.blob.size < overshoot.blob.size) {
          overshoot = candidate;
        }
      }

      if (Math.abs(candidate.blob.size - targetBytes) <= tolerance) {
        best = candidate;
        overshoot = null; // already close enough, skip refinement
        break;
      }

      if (candidate.blob.size > targetBytes) {
        high = mid;
      } else {
        low = mid;
      }
    }

    // Quality is lossless-ignored on PNG, so refinement only helps
    // for JPEG/WebP outputs. If we're still outside tolerance and
    // have an overshoot candidate to refine, dial it back precisely.
    if (
      overshoot &&
      outputType !== "image/png" &&
      Math.abs(best.blob.size - targetBytes) > tolerance
    ) {
      const refined = await refineWithQuality(
        file,
        overshoot.width,
        overshoot.height,
        outputType,
        targetBytes,
        tolerance
      );

      if (
        Math.abs(refined.blob.size - targetBytes) <
        Math.abs(best.blob.size - targetBytes)
      ) {
        best = refined;
      }
    }
  }

  return buildGrowResult(file, best);
}

// Fine-tunes file size at a fixed (already-upscaled) resolution by
// searching quality instead of resolution. Quality changes size
// continuously, so it closes gaps resolution alone can't reach.
async function refineWithQuality(
  file,
  width,
  height,
  outputType,
  targetBytes,
  tolerance
) {
  let low = MIN_REFINE_QUALITY;
  let high = 1;

  let best = await encodeAtDimensions(file, width, height, outputType, high);

  for (let i = 0; i < QUALITY_REFINE_ITERATIONS; i++) {
    const quality = (low + high) / 2;

    const candidate = await encodeAtDimensions(
      file,
      width,
      height,
      outputType,
      quality
    );

    if (
      Math.abs(candidate.blob.size - targetBytes) <
      Math.abs(best.blob.size - targetBytes)
    ) {
      best = candidate;
    }

    if (Math.abs(candidate.blob.size - targetBytes) <= tolerance) {
      best = candidate;
      break;
    }

    // Lowering quality reduces size, so if we're still above target,
    // search the lower half; if below, search the upper half.
    if (candidate.blob.size > targetBytes) {
      high = quality;
    } else {
      low = quality;
    }
  }

  return best;
}

function encodeAtScale(file, originalDimensions, scale, outputType, quality = 1) {
  const width = Math.round(originalDimensions.width * scale);
  const height = Math.round(originalDimensions.height * scale);

  return encodeAtDimensions(file, width, height, outputType, quality);
}

function encodeAtDimensions(file, width, height, outputType, quality = 1) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error("Failed to render image."));
            return;
          }

          resolve({ blob, width, height });
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image."));
    };

    img.src = url;
  });
}

function getTolerance(targetBytes) {
  if (targetBytes < 100 * 1024) return 1024;
  if (targetBytes < 1024 * 1024) return 4096;
  if (targetBytes < 5 * 1024 * 1024) return 20 * 1024;
  return 40 * 1024;
}

function buildGrowResult(originalFile, best) {
  const ext =
    best.blob.type.split("/")[1] === "jpeg"
      ? "jpg"
      : best.blob.type.split("/")[1];

  const base = originalFile.name.replace(/\.[^/.]+$/, "");
  const name = `${base}-resized.${ext}`;

  const outFile = new File([best.blob], name, {
    type: best.blob.type,
    lastModified: Date.now(),
  });

  return {
    file: outFile,

    url: URL.createObjectURL(outFile),

    name,

    size: outFile.size,

    originalSize: originalFile.size,

    width: best.width,

    height: best.height,

    quality: 100,

    format: outFile.type.replace("image/", "").toUpperCase(),

    direction: "grow",

    fallbackToOriginal: false,
  };
}

async function getDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image dimensions."));
    };

    img.src = url;
  });
}