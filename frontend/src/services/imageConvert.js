const MAX_INPUT_BYTES = 25 * 1024 * 1024;

const FORMATS = {
  png: { mime: "image/png", ext: "png", label: "PNG", lossy: false },
  jpeg: { mime: "image/jpeg", ext: "jpg", label: "JPG", lossy: true },
  webp: { mime: "image/webp", ext: "webp", label: "WEBP", lossy: true },
};

export { FORMATS };

export async function convertImage(file, settings) {
  validateFile(file);

  const target = FORMATS[settings.format];

  if (!target) {
    throw new Error("Choose a target format.");
  }

  const quality = target.lossy
    ? (settings.quality ?? 90) / 100
    : undefined;

  const dimensions = await getDimensions(file);

  const blob = await drawAndEncode(file, dimensions, target, quality);

  const base = file.name.replace(/\.[^/.]+$/, "");
  const name = `${base}.${target.ext}`;

  const outFile = new File([blob], name, {
    type: target.mime,
    lastModified: Date.now(),
  });

  return {
    file: outFile,

    url: URL.createObjectURL(outFile),

    name,

    size: outFile.size,

    originalSize: file.size,

    width: dimensions.width,

    height: dimensions.height,

    format: target.label,

    originalFormat: file.type
      .replace("image/", "")
      .toUpperCase(),
  };
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

function drawAndEncode(file, dimensions, target, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      const ctx = canvas.getContext("2d");

      // JPEG has no alpha channel — filling white first avoids
      // browsers silently rendering transparent areas as black.
      if (target.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error("Failed to convert image."));
            return;
          }

          resolve(blob);
        },
        target.mime,
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