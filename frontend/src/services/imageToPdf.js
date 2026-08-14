import { jsPDF } from "jspdf";

const MAX_INPUT_BYTES = 15 * 1024 * 1024; // 15 MB per image
const MAX_IMAGES = 40;

// Images get downscaled to this before embedding — keeps PDF file
// size and generation time reasonable without a visible quality hit
// for on-screen or standard-print use.
const MAX_DIMENSION = 2500;

const SUPPORTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

// mm, portrait
const PAGE_SIZES = {
  a4: [210, 297],
  letter: [215.9, 279.4],
};

export async function generatePdf(images, options = {}, onProgress) {

  if (!images || images.length === 0) {
    throw new Error("Add at least one image.");
  }

  if (images.length > MAX_IMAGES) {
    throw new Error(`Too many images — max ${MAX_IMAGES} per PDF.`);
  }

  images.forEach((img) => validateFile(img.file));

  const {
    pageSize = "a4",
    orientation = "auto",
    margin = 10,
  } = options;

  let doc = null;

  for (let i = 0; i < images.length; i++) {

    const { file } = images[i];

    const { dataUrl, width, height } = await toJpegDataUrl(
      file,
      MAX_DIMENSION
    );

    const { format, pdfOrientation } = computePageFormat(
      pageSize,
      orientation,
      width,
      height
    );

    if (!doc) {

      doc = new jsPDF({
        orientation: pdfOrientation,
        unit: "mm",
        format,
      });

    } else {

      doc.addPage(format, pdfOrientation);

    }

    const [pageW, pageH] = format;

    const effectiveMargin = pageSize === "fit" ? 0 : margin;

    const rect = computeDrawRect(pageW, pageH, width, height, effectiveMargin);

    doc.addImage(dataUrl, "JPEG", rect.x, rect.y, rect.width, rect.height);

    onProgress?.(Math.round(((i + 1) / images.length) * 100));

  }

  const blob = doc.output("blob");

  const name =
    images.length === 1
      ? `${images[0].file.name.replace(/\.[^/.]+$/, "")}.pdf`
      : `images-to-pdf-${images.length}pages.pdf`;

  const outFile = new File([blob], name, { type: "application/pdf" });

  return {
    file: outFile,
    url: URL.createObjectURL(outFile),
    name,
    size: outFile.size,
    pageCount: images.length,
  };

}

function computePageFormat(pageSizeKey, orientationKey, imgWidthPx, imgHeightPx) {

  if (pageSizeKey === "fit") {

    // Images are treated as 96 DPI purely to translate pixel
    // dimensions into a page size in mm — there's no "real" DPI for
    // an arbitrary image, this just keeps the page proportioned
    // exactly like the source image.
    const mmPerPx = 25.4 / 96;

    const w = Math.max(imgWidthPx * mmPerPx, 10);
    const h = Math.max(imgHeightPx * mmPerPx, 10);

    return {
      format: [w, h],
      pdfOrientation: w >= h ? "l" : "p",
    };

  }

  const [baseW, baseH] = PAGE_SIZES[pageSizeKey] || PAGE_SIZES.a4;

  let isLandscape;

  if (orientationKey === "landscape") isLandscape = true;
  else if (orientationKey === "portrait") isLandscape = false;
  else isLandscape = imgWidthPx >= imgHeightPx; // auto

  return {
    format: isLandscape ? [baseH, baseW] : [baseW, baseH],
    pdfOrientation: isLandscape ? "l" : "p",
  };

}

function computeDrawRect(pageW, pageH, imgW, imgH, marginMm) {

  const availW = Math.max(pageW - marginMm * 2, 1);
  const availH = Math.max(pageH - marginMm * 2, 1);

  const imgRatio = imgW / imgH;
  const availRatio = availW / availH;

  let drawW, drawH;

  if (imgRatio > availRatio) {

    drawW = availW;
    drawH = availW / imgRatio;

  } else {

    drawH = availH;
    drawW = availH * imgRatio;

  }

  return {
    x: (pageW - drawW) / 2,
    y: (pageH - drawH) / 2,
    width: drawW,
    height: drawH,
  };

}

function toJpegDataUrl(file, maxDimension) {
  return new Promise((resolve, reject) => {

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {

      let { width, height } = img;

      if (Math.max(width, height) > maxDimension) {

        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      // Flatten onto white first — JPEG has no alpha channel, so a
      // transparent PNG would otherwise turn black in the PDF.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", 0.92),
        width,
        height,
      });

      URL.revokeObjectURL(url);

    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Unable to load "${file.name}".`));
    };

    img.src = url;

  });
}

function validateFile(file) {

  if (!file) throw new Error("No image selected.");

  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error(`"${file.name}": unsupported format. Use PNG, JPG or WEBP.`);
  }

  if (file.size === 0) throw new Error(`"${file.name}" is empty.`);

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `"${file.name}" is too large (max ${MAX_INPUT_BYTES / (1024 * 1024)} MB per image).`
    );
  }

}