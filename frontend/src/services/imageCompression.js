import imageCompression from "browser-image-compression";

/* ======================================================
   CONFIG
====================================================== */

// Formats where canvas.toBlob's "quality" argument actually
// does something. PNG is lossless — quality is silently
// ignored by every browser, so quality/target-size compression
// on a PNG source has no real effect unless we re-target it.
const LOSSY_TYPES = new Set(["image/jpeg", "image/jpg", "image/webp"]);

// Guard against huge files hanging the tab during canvas work.
const MAX_INPUT_BYTES = 25 * 1024 * 1024; // 25 MB

// Scale factors tried, in order, when quality alone can't land
// within tolerance of the target size (JPEG/WebP quantization
// steps can jump in size, especially on flat/plain-background
// images — resolution is the second lever to close that gap).
const FALLBACK_SCALES = [0.95, 0.9, 0.85, 0.75, 0.65, 0.5];

/* ======================================================
   MAIN FUNCTION
====================================================== */

export async function compressImage(file, settings) {
  validateFile(file);

  if (settings.mode === "target") {
    return await compressByTargetSize(file, settings);
  }

  return await compressByQuality(file, settings);
}

/* ======================================================
   INPUT VALIDATION
====================================================== */

function validateFile(file) {
  if (!file) {
    throw new Error("No image selected.");
  }

  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Selected file is not a valid image.");
  }

  if (file.size === 0) {
    throw new Error("Selected image is empty.");
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `Image is too large to compress in-browser (max ${
        MAX_INPUT_BYTES / (1024 * 1024)
      } MB).`
    );
  }
}

/* ======================================================
   OUTPUT TYPE / FILENAME RESOLUTION
====================================================== */

// PNG can't be shrunk via a quality knob (it's lossless), so we
// transparently re-target lossless sources to WebP, which supports
// both a real quality parameter AND alpha transparency (unlike JPEG,
// which would flatten transparency to a solid background).
function resolveOutputType(originalType) {
  if (LOSSY_TYPES.has(originalType)) {
    return originalType;
  }
  return "image/webp";
}

function resolveOutputName(originalName, outputType) {
  const ext = outputType.split("/")[1];
  const base = originalName.replace(/\.[^/.]+$/, "");
  return `${base}.${ext === "jpeg" ? "jpg" : ext}`;
}

/* ======================================================
   QUALITY MODE
====================================================== */

async function compressByQuality(file, settings) {
  let quality = 0.8;

  switch (settings.preset) {
    case "maximum":
      quality = 0.95;
      break;

    case "balanced":
      quality = 0.8;
      break;

    case "compression":
      quality = 0.55;
      break;

    case "custom":
      quality = settings.quality / 100;
      break;

    default:
      quality = 0.8;
  }

  const compressed = await compressRaw(file, quality, settings);

  return buildResult(file, compressed, quality);
}

/* ======================================================
   TARGET SIZE MODE
====================================================== */

async function compressByTargetSize(file, settings) {
  const targetBytes = settings.targetSize * 1024;
  const tolerance = getTolerance(targetBytes);

  // -----------------------------
  // Stage 1: quality-only binary search (full resolution)
  // -----------------------------

  let low = 0.01;
  let high = 1.0;

  let bestFile = null;
  let bestQuality = 0.8;
  let hitTolerance = false;

  for (let i = 0; i < 10; i++) {
    const quality = (low + high) / 2;

    const compressed = await compressRaw(file, quality, settings);
    const size = compressed.size;

    if (
      !bestFile ||
      Math.abs(size - targetBytes) < Math.abs(bestFile.size - targetBytes)
    ) {
      bestFile = compressed;
      bestQuality = quality;
    }

    if (Math.abs(size - targetBytes) <= tolerance) {
      hitTolerance = true;
      break;
    }

    if (size > targetBytes) {
      high = quality;
    } else {
      low = quality;
    }
  }

  // -----------------------------
  // Stage 2: fine quality search around the best point found.
  // Only worth running if stage 1 didn't already land inside
  // tolerance — otherwise this is ~20 wasted compressions.
  // -----------------------------

  if (!hitTolerance) {
    const start = Math.max(1, Math.round(bestQuality * 100) - 10);
    const end = Math.min(100, Math.round(bestQuality * 100) + 10);

    for (let q = start; q <= end; q++) {
      const compressed = await compressRaw(file, q / 100, settings);

      if (
        Math.abs(compressed.size - targetBytes) <
        Math.abs(bestFile.size - targetBytes)
      ) {
        bestFile = compressed;
        bestQuality = q / 100;
      }

      if (Math.abs(compressed.size - targetBytes) <= tolerance) {
        hitTolerance = true;
        break;
      }
    }
  }

  // -----------------------------
  // Stage 3: resolution fallback.
  // JPEG/WebP quality steps can jump in size (quantization
  // "cliffs"), especially on flat/plain-background images —
  // quality alone can leave a gap bigger than tolerance around
  // the target. Slight downscaling gives a second, more
  // continuous lever to close that gap. Only runs if stage 1/2
  // couldn't get close enough.
  // -----------------------------

  if (!hitTolerance) {
    const dimensions = await getDimensions(file);
    const originalMaxDim = Math.max(dimensions.width, dimensions.height);

    for (const scale of FALLBACK_SCALES) {
      const maxWidthOrHeight = Math.round(originalMaxDim * scale);

      const compressed = await compressRaw(
        file,
        bestQuality,
        settings,
        maxWidthOrHeight
      );

      if (
        Math.abs(compressed.size - targetBytes) <
        Math.abs(bestFile.size - targetBytes)
      ) {
        bestFile = compressed;
      }

      if (Math.abs(compressed.size - targetBytes) <= tolerance) {
        break;
      }
    }
  }

  return buildResult(file, bestFile, bestQuality);
}

function getTolerance(targetBytes) {
  if (targetBytes < 100 * 1024) return 512;
  if (targetBytes < 1024 * 1024) return 2048;
  if (targetBytes < 5 * 1024 * 1024) return 10 * 1024;
  return 20 * 1024;
}

/* ======================================================
   RAW COMPRESSION (shared by both modes)
====================================================== */

async function compressRaw(file, quality, settings, maxWidthOrHeight = null) {
  const outputType = resolveOutputType(file.type);

  const options = {
    maxSizeMB: 20,
    useWebWorker: true,
    initialQuality: quality,
    preserveExif: settings.keepMetadata,
    fileType: outputType,
    ...(maxWidthOrHeight
      ? { alwaysKeepResolution: false, maxWidthOrHeight }
      : { alwaysKeepResolution: true }),
  };

  const compressed = await imageCompression(file, options);

  // browser-image-compression keeps the original filename even when
  // the mime type changes — fix the extension so downloads aren't
  // mislabeled (e.g. "photo.png" that actually contains WebP bytes).
  const correctedName = resolveOutputName(file.name, outputType);

  if (compressed.name !== correctedName) {
    return new File([compressed], correctedName, {
      type: outputType,
      lastModified: Date.now(),
    });
  }

  return compressed;
}

/* ======================================================
   BUILD RESULT OBJECT
====================================================== */

async function buildResult(originalFile, compressedFile, quality) {
  const originalSize = originalFile.size;

  // If re-encoding produced a bigger file than the source, just
  // serve the original back instead of a "compressed" file that
  // isn't actually compressed.
  const usedFile =
    compressedFile.size >= originalSize ? originalFile : compressedFile;

  const dimensions = await getDimensions(usedFile);

  const compressedSize = usedFile.size;

  const saved = originalSize - compressedSize;

  const reduction =
    originalSize > 0 ? (saved / originalSize) * 100 : 0;

  return {
    file: usedFile,

    url: URL.createObjectURL(usedFile),

    name: usedFile.name,

    size: compressedSize,

    originalSize,

    saved,

    reduction: reduction.toFixed(1),

    width: dimensions.width,

    height: dimensions.height,

    quality: Math.round(quality * 100),

    format: usedFile.type.replace("image/", "").toUpperCase(),

    fallbackToOriginal: usedFile === originalFile,
  };
}

/* ======================================================
   GET IMAGE DIMENSIONS
====================================================== */

async function getDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image dimensions."));
    };

    img.src = url;
  });
}

/* ======================================================
   FORMAT FILE SIZE
====================================================== */

export function formatFileSize(bytes) {
  if (bytes == null) return "--";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ======================================================
   PERCENT SAVED
====================================================== */

export function calculateReduction(originalBytes, compressedBytes) {
  if (!originalBytes || !compressedBytes) {
    return 0;
  }

  const reduction =
    ((originalBytes - compressedBytes) / originalBytes) * 100;

  return Math.max(0, reduction).toFixed(1);
}

/* ======================================================
   SAVED SIZE
====================================================== */

export function calculateSaved(originalBytes, compressedBytes) {
  return Math.max(0, originalBytes - compressedBytes);
}