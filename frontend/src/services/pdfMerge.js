    import { PDFDocument } from "pdf-lib";
    import * as pdfjsLib from "pdfjs-dist";

    // `new URL(..., import.meta.url)` is the pattern pdf.js's own docs recommend
    // for bundlers — it's more reliable across Vite versions than a raw `?url`
    // import, which can get mis-resolved depending on how node_modules assets
    // are handled.
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
    ).toString();

    const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file
    const MAX_FILES = 30;

    // Thumbnail rendering settings — kept small/compressed since these are
    // only used for the on-screen order preview, not the merged output.
    const THUMB_MAX_DIM = 220;
    const THUMB_QUALITY = 0.65;
    const MAX_RENDERED_PAGES_PER_FILE = 40; // cap so huge PDFs stay snappy

    export async function readPdfMeta(file) {

    validateFile(file);

    const buffer = await file.arrayBuffer();

    let doc;

    try {

        doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    } catch (err) {

        throw new Error("Couldn't read this file — it may be encrypted or corrupted.");

    }

    return {
        pageCount: doc.getPageCount(),
    };

    }

    /**
     * Renders each page of a PDF file to a small JPEG thumbnail so it can be
     * shown in the merge-order preview. Rendering is capped at
     * MAX_RENDERED_PAGES_PER_FILE pages per file — any pages beyond that are
     * reported via `hiddenCount` so the UI can show a "+N more" tile instead
     * of rendering hundreds of canvases.
     */
    export async function renderPdfPageThumbnails(file) {
  validateFile(file);

  const buffer = await file.arrayBuffer();

  let pdf;
  let loadingTask;

  try {
    loadingTask = pdfjsLib.getDocument({ data: buffer });
    pdf = await loadingTask.promise;
  } catch (err) {
    console.error("[pdfMerge] Failed to load PDF for preview:", file.name, err);
    throw new Error("Couldn't render a preview for this file.");
  }

  const totalPages = pdf.numPages;
  const renderCount = Math.min(totalPages, MAX_RENDERED_PAGES_PER_FILE);

  const pages = [];

  try {
    for (let pageNum = 1; pageNum <= renderCount; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const baseViewport = page.getViewport({ scale: 1 });
      const scale =
        THUMB_MAX_DIM / Math.max(baseViewport.width, baseViewport.height);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const ctx = canvas.getContext("2d");

      await page.render({ canvasContext: ctx, viewport }).promise;

      pages.push({
        dataUrl: canvas.toDataURL("image/jpeg", THUMB_QUALITY),
        width: viewport.width,
        height: viewport.height,
      });

      page.cleanup?.();
    }
  } finally {
    // Correct cleanup for pdfjs-dist v6
    try {
      pdf.cleanup?.();
    } catch {}

    try {
      await loadingTask.destroy?.();
    } catch {}
  }

  return {
    pages,
    totalPages,
    hiddenCount: Math.max(0, totalPages - renderCount),
  };
}

    export async function mergePdfs(items, outputName, onProgress) {

    if (!items || items.length === 0) {
        throw new Error("Add at least one PDF.");
    }

    if (items.length > MAX_FILES) {
        throw new Error(`Too many files — max ${MAX_FILES} PDFs per merge.`);
    }

    const mergedDoc = await PDFDocument.create();

    let totalPages = 0;

    for (let i = 0; i < items.length; i++) {

        const { file } = items[i];

        let srcDoc;

        try {

        const buffer = await file.arrayBuffer();
        srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

        } catch (err) {

        throw new Error(
            `"${file.name}" couldn't be read — it may be encrypted or corrupted.`
        );

        }

        const indices = srcDoc.getPageIndices();

        const copiedPages = await mergedDoc.copyPages(srcDoc, indices);

        copiedPages.forEach((page) => mergedDoc.addPage(page));

        totalPages += indices.length;

        onProgress?.(Math.round(((i + 1) / items.length) * 100));

    }

    const bytes = await mergedDoc.save();

    const blob = new Blob([bytes], { type: "application/pdf" });

    const rawName = (outputName || "").trim();

    const name = rawName
        ? (rawName.toLowerCase().endsWith(".pdf") ? rawName : `${rawName}.pdf`)
        : items.length === 1
        ? items[0].file.name
        : `merged-${items.length}files.pdf`;

    const outFile = new File([blob], name, { type: "application/pdf" });

    return {
        file: outFile,
        url: URL.createObjectURL(outFile),
        name,
        size: outFile.size,
        fileCount: items.length,
        pageCount: totalPages,
    };

    }

    function validateFile(file) {

    if (!file) throw new Error("No file selected.");

    const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
        throw new Error(`"${file.name}" is not a PDF file.`);
    }

    if (file.size === 0) throw new Error(`"${file.name}" is empty.`);

    if (file.size > MAX_FILE_BYTES) {
        throw new Error(
        `"${file.name}" is too large (max ${MAX_FILE_BYTES / (1024 * 1024)} MB).`
        );
    }

    }