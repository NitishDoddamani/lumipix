import { removeBackground } from "@imgly/background-removal";

const MAX_INPUT_BYTES = 25 * 1024 * 1024;

const SUPPORTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

// Runs entirely in the browser via a WASM/ONNX segmentation model —
// nothing is uploaded to a server. The first call on a device
// downloads and caches the model (tens of MB) from imgly's CDN;
// subsequent calls reuse the cached model and are much faster.
export async function removeImageBackground(file, options = {}, onProgress) {
  validateFile(file);

  const { backgroundColor = "transparent" } = options;

  const cutoutBlob = await removeBackground(file, {
    output: {
      format: "image/png",
      quality: 1,
    },
    progress: (key, current, total) => {
      if (onProgress) onProgress({ key, current, total });
    },
  });

  const finalBlob =
    backgroundColor === "transparent"
      ? cutoutBlob
      : await compositeOntoColor(cutoutBlob, backgroundColor);

  const base = file.name.replace(/\.[^/.]+$/, "");
  const name = `${base}-no-bg.png`;

  const outFile = new File([finalBlob], name, {
    type: "image/png",
    lastModified: Date.now(),
  });

  return {
    file: outFile,
    url: URL.createObjectURL(outFile),
    name,
    size: outFile.size,
    originalSize: file.size,
    format: "PNG",
  };
}

function validateFile(file) {
  if (!file) throw new Error("No image selected.");

  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("Supported formats: PNG, JPG, JPEG, WEBP.");
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

// Flattens the transparent cutout onto a solid color background,
// for people who want e.g. a plain white product-photo background
// instead of transparency.
function compositeOntoColor(cutoutBlob, color) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(cutoutBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error("Failed to render final image."));
            return;
          }

          resolve(blob);
        },
        "image/png"
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load cutout image."));
    };

    img.src = url;
  });
}