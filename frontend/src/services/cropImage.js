const MAX_INPUT_BYTES = 25 * 1024 * 1024; // 25 MB

const SUPPORTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export function validateFile(file) {

  if (!file) throw new Error("No image selected.");

  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("Supported formats: PNG, JPG, JPEG, WEBP.");
  }

  if (file.size === 0) throw new Error("Selected image is empty.");

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `Image is too large (max ${MAX_INPUT_BYTES / (1024 * 1024)} MB).`
    );
  }

}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));

    reader.readAsDataURL(file);

  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {

    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load image."));

    img.src = src;

  });
}

export async function rotateImage(dataUrl, direction) {

  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.height;
  canvas.height = img.width;

  const ctx = canvas.getContext("2d");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(((direction === "cw" ? 90 : -90) * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };

}

export async function flipImage(dataUrl, axis) {

  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");

  ctx.translate(
    axis === "horizontal" ? canvas.width : 0,
    axis === "vertical" ? canvas.height : 0
  );

  ctx.scale(
    axis === "horizontal" ? -1 : 1,
    axis === "vertical" ? -1 : 1
  );

  ctx.drawImage(img, 0, 0);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: img.width,
    height: img.height,
  };

}

export async function cropImage(dataUrl, cropRect, originalFile) {

  const img = await loadImage(dataUrl);

  const x = Math.max(0, Math.min(Math.round(cropRect.x), img.width - 1));
  const y = Math.max(0, Math.min(Math.round(cropRect.y), img.height - 1));

  const width = Math.max(1, Math.min(Math.round(cropRect.width), img.width - x));
  const height = Math.max(1, Math.min(Math.round(cropRect.height), img.height - y));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  const outType = originalFile.type === "image/png" ? "image/png" : "image/jpeg";
  const quality = outType === "image/jpeg" ? 0.92 : undefined;

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, outType, quality)
  );

  const base = originalFile.name.replace(/\.[^/.]+$/, "");
  const ext = outType === "image/png" ? "png" : "jpg";
  const name = `${base}-cropped.${ext}`;

  const outFile = new File([blob], name, {
    type: outType,
    lastModified: Date.now(),
  });

  return {
    file: outFile,
    url: URL.createObjectURL(outFile),
    name,
    size: outFile.size,
    originalSize: originalFile.size,
    width,
    height,
  };

}