const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB

const MAX_INPUT_DIMENSION = {
  2: 1600,
  4: 900,
};

const SUPPORTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const PATCH_THRESHOLD = 512;

const PATCH_SIZE = {
  2: 128,
  4: 160,
};
const PATCH_PADDING = 8;

let worker = null;

function getWorker() {

  if (!worker) {
    // Vite's worker import syntax — bundles upscale.worker.js as a
    // separate module worker automatically.
    worker = new Worker(new URL("./upscale.worker.js", import.meta.url), {
      type: "module",
    });
  }

  return worker;

}

export async function upscaleImage(file, settings = {}, onProgress) {

  validateFile(file);

  const scale = settings.scale === 4 ? 4 : 2;

  const imgEl = await loadImage(file);

  const maxDimension = MAX_INPUT_DIMENSION[scale];

  if (imgEl.width > maxDimension || imgEl.height > maxDimension) {
    throw new Error(
      `Image is too large to upscale ${scale}x in-browser (max ${maxDimension}×${maxDimension}px for ${scale}x). Try a smaller image or use 2x instead.`
    );
  }

  const usePatches = Math.max(imgEl.width, imgEl.height) > PATCH_THRESHOLD;

  const bitmap = await createImageBitmap(imgEl);

  const w = getWorker();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const outFileMeta = await new Promise((resolve, reject) => {

    function handleMessage(e) {

      if (e.data.id !== id) return;

      if (e.data.type === "progress") {

        onProgress?.(e.data.pct);

      } else if (e.data.type === "done") {

        w.removeEventListener("message", handleMessage);
        resolve(e.data);

      } else if (e.data.type === "error") {

        w.removeEventListener("message", handleMessage);
        reject(new Error(e.data.message));

      }

    }

    w.addEventListener("message", handleMessage);

    w.postMessage(
      {
        id,
        bitmap,
        scale,
        patchSize: usePatches ? PATCH_SIZE[scale] : null,
        padding: usePatches ? PATCH_PADDING : null,
      },
      [bitmap]
    );

  });

  const base = file.name.replace(/\.[^/.]+$/, "");
  const name = `${base}-upscaled-${scale}x.png`;

  const outFile = new File([outFileMeta.blob], name, {
    type: "image/png",
    lastModified: Date.now(),
  });

  return {
    file: outFile,
    url: URL.createObjectURL(outFile),
    name,
    size: outFile.size,
    originalSize: file.size,
    width: outFileMeta.width,
    height: outFileMeta.height,
    originalWidth: imgEl.width,
    originalHeight: imgEl.height,
    scale,
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

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image."));
    };

    img.src = url;
  });
}