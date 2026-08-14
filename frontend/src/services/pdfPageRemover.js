import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Same worker-resolution pattern used in pdfMerge.js — more reliable
// across Vite versions than a raw `?url` import.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Page Remover needs to show (essentially) the whole document since
// precise page-by-page selection is the core feature — capped much
// higher than the Merge tool's preview, purely as a safety limit for
// extreme edge cases (hundreds of pages).
const THUMB_MAX_DIM = 260;
const THUMB_QUALITY = 0.65;
const MAX_RENDERED_PAGES = 300;

export async function readAllPageThumbnails(file, onProgress) {

  const buffer = await file.arrayBuffer();

  let pdf;
  let loadingTask;

  try {

    loadingTask = pdfjsLib.getDocument({ data: buffer });
    pdf = await loadingTask.promise;

  } catch (err) {

    throw new Error("Couldn't read this file — it may be encrypted or corrupted.");

  }

  const pageCount = pdf.numPages;
  const renderCount = Math.min(pageCount, MAX_RENDERED_PAGES);

  const thumbnails = [];

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

      thumbnails.push(canvas.toDataURL("image/jpeg", THUMB_QUALITY));

      page.cleanup?.();

      onProgress?.(pageNum, renderCount);

    }

  } finally {

    try {
      pdf.cleanup?.();
    } catch {}

    try {
      await loadingTask.destroy?.();
    } catch {}

  }

  return {
    pageCount,
    thumbnails,
    truncated: pageCount > renderCount,
  };

}

export function parsePageSelection(text, totalPages) {

  const set = new Set();

  text.split(",").forEach((part) => {

    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.includes("-")) {

      const [aStr, bStr] = trimmed.split("-");
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);

      if (Number.isInteger(a) && Number.isInteger(b) && a >= 1 && b >= 1) {

        const start = Math.min(a, b);
        const end = Math.min(Math.max(a, b), totalPages);

        for (let p = start; p <= end; p++) set.add(p);

      }

    } else {

      const n = parseInt(trimmed, 10);

      if (Number.isInteger(n) && n >= 1 && n <= totalPages) {
        set.add(n);
      }

    }

  });

  return set;

}

export function formatPageSelection(set) {

  if (set.size === 0) return "";

  const sorted = [...set].sort((a, b) => a - b);

  const ranges = [];

  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {

    const current = sorted[i];

    if (current === prev + 1) {

      prev = current;
      continue;

    }

    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);

    if (current !== undefined) {

      start = current;
      prev = current;

    }

  }

  return ranges.join(",");

}

export async function removePages(file, selectedPages, totalPages, onProgress) {

  const removeSet = new Set(
    [...selectedPages].filter((p) => p >= 1 && p <= totalPages)
  );

  if (removeSet.size === 0) {
    throw new Error("Select at least one page to remove.");
  }

  if (removeSet.size >= totalPages) {
    throw new Error("Can't remove every page — the PDF needs at least one page left.");
  }

  const buffer = await file.arrayBuffer();

  let doc;

  try {

    doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  } catch (err) {

    throw new Error("Couldn't read this file — it may be encrypted or corrupted.");

  }

  // Remove from highest page number to lowest — removing a page
  // shifts every later index down by one, so working backwards keeps
  // the remaining page numbers stable mid-loop.
  const sortedDesc = [...removeSet].sort((a, b) => b - a);

  sortedDesc.forEach((pageNum, i) => {

    doc.removePage(pageNum - 1); // pdf-lib is 0-indexed

    onProgress?.(Math.round(((i + 1) / sortedDesc.length) * 100));

  });

  const bytes = await doc.save();

  const blob = new Blob([bytes], { type: "application/pdf" });

  const base = file.name.replace(/\.[^/.]+$/, "");
  const name = `${base}-pages-removed.pdf`;

  const outFile = new File([blob], name, { type: "application/pdf" });

  return {
    file: outFile,
    url: URL.createObjectURL(outFile),
    name,
    size: outFile.size,
    originalPageCount: totalPages,
    removedCount: removeSet.size,
    remainingPageCount: totalPages - removeSet.size,
  };

}