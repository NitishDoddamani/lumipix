// Canvas-based resize — runs entirely in the browser, no backend
// required. Keeps the EXACT same contract as the old axios version:
//
//   resizeImage(formData) -> { blob, pixelWidth, pixelHeight }
//
// where formData carries "image", "width", "height", "unit", "dpi" —
// so nothing in ResizeOptions.jsx (or anywhere else) needs to change.

export const MAX_DIMENSION = 10000;

export const resizeImage = async (formData) => {
  const file = formData.get("image");

  const rawWidth = Number(formData.get("width"));
  const rawHeight = Number(formData.get("height"));
  const unit = formData.get("unit");
  const dpi = Number(formData.get("dpi")) || 300;

  if (!file) {
    throw new Error("No image provided.");
  }

  const { width: originalWidth, height: originalHeight } =
    await getImageDimensions(file);

  const { targetWidth, targetHeight } = computeTargetDimensions({
    unit,
    width: rawWidth,
    height: rawHeight,
    dpi,
    originalWidth,
    originalHeight,
  });

  if (
    !Number.isFinite(targetWidth) ||
    !Number.isFinite(targetHeight) ||
    targetWidth <= 0 ||
    targetHeight <= 0 ||
    targetWidth > MAX_DIMENSION ||
    targetHeight > MAX_DIMENSION
  ) {
    throw new Error("Maximum supported image size is 10,000 × 10,000 pixels.");
  }

  const rawBlob = await renderResized(file, targetWidth, targetHeight);

  const blob = await stampDensity(rawBlob, dpi);

  return {
    blob,
    pixelWidth: targetWidth,
    pixelHeight: targetHeight,
  };
};

/* ======================================================
   Dimension math — copied exactly from the old
   backend/controllers/resizeController.js so results match.
====================================================== */

export function computeTargetDimensions({
  unit,
  width,
  height,
  dpi,
  originalWidth,
  originalHeight,
}) {
  if (unit === "Percentage") {
    return {
      targetWidth: Math.round((originalWidth * width) / 100),
      targetHeight: Math.round((originalHeight * height) / 100),
    };
  }

  if (unit === "Inches") {
    return {
      targetWidth: Math.round(width * dpi),
      targetHeight: Math.round(height * dpi),
    };
  }

  if (unit === "Centimeters") {
    return {
      targetWidth: Math.round((width / 2.54) * dpi),
      targetHeight: Math.round((height / 2.54) * dpi),
    };
  }

  // "Pixels" and any unrecognized unit fall through here — same
  // behavior as the backend's final `else` branch.
  return {
    targetWidth: Math.round(width),
    targetHeight: Math.round(height),
  };
}

/* ======================================================
   Canvas render
====================================================== */

function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image."));
    };

    img.src = url;
  });
}

function renderResized(file, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");

      // Stretch to the exact target box — matches the old backend's
      // sharp `fit: "fill"` (not an aspect-preserving fit).
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error("Failed to render resized image."));
            return;
          }

          resolve(blob);
        },
        "image/jpeg", // old backend always output JPEG regardless of input type
        1 // quality 100 — same as the backend's .jpeg({ quality: 100 })
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image."));
    };

    img.src = url;
  });
}

/* ======================================================
   DPI metadata stamp — mirrors sharp's
   .withMetadata({ density: dpi }) by writing/patching the
   JFIF APP0 density field on the output JPEG.
====================================================== */

async function stampDensity(blob, dpi) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const app0 = findJpegApp0(bytes);

  let out;

  if (app0 !== null) {
    out = bytes.slice();

    out[app0 + 11] = 1; // units = pixels per inch
    out[app0 + 12] = (dpi >> 8) & 0xff;
    out[app0 + 13] = dpi & 0xff;
    out[app0 + 14] = (dpi >> 8) & 0xff;
    out[app0 + 15] = dpi & 0xff;
  } else {
    const segment = buildJfifApp0(dpi);

    out = new Uint8Array(bytes.length + segment.length);
    out.set(bytes.slice(0, 2), 0); // SOI (FF D8)
    out.set(segment, 2);
    out.set(bytes.slice(2), 2 + segment.length);
  }

  return new Blob([out], { type: "image/jpeg" });
}

function findJpegApp0(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let offset = 2;

  while (offset < bytes.length - 4) {
    if (bytes[offset] !== 0xff) break;

    const marker = bytes[offset + 1];

    if (marker === 0xda) break; // start of scan data — stop searching

    if (marker === 0xe0) {
      const isJfif =
        bytes[offset + 4] === 0x4a &&
        bytes[offset + 5] === 0x46 &&
        bytes[offset + 6] === 0x49 &&
        bytes[offset + 7] === 0x46;

      if (isJfif) return offset;
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    offset += 2 + length;
  }

  return null;
}

function buildJfifApp0(dpi) {
  const segment = new Uint8Array(18);

  segment.set([0xff, 0xe0], 0); // APP0 marker
  segment.set([0x00, 0x10], 2); // segment length = 16
  segment.set([0x4a, 0x46, 0x49, 0x46, 0x00], 4); // "JFIF\0"
  segment.set([0x01, 0x02], 9); // version 1.2
  segment[11] = 1; // units = pixels per inch
  segment[12] = (dpi >> 8) & 0xff;
  segment[13] = dpi & 0xff;
  segment[14] = (dpi >> 8) & 0xff;
  segment[15] = dpi & 0xff;
  segment[16] = 0; // thumbnail width
  segment[17] = 0; // thumbnail height

  return segment;
}