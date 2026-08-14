// Maps each tool to 2-3 logical next steps. Keep these to things
// someone who just finished THIS tool would plausibly want next.
const TOOL_RELATIONS = {
  "resize-image": ["change-file-size", "convert-image", "compress-image"],
  "crop-image": ["resize-image", "compress-image"],
  "compress-image": ["change-file-size", "convert-image"],
  "change-file-size": ["compress-image", "resize-image"],
  "change-dpi": ["resize-image", "change-file-size"],
  "convert-image": ["compress-image", "resize-image"],
  "remove-background": ["ai-upscale", "resize-image", "convert-image"],
  "ai-upscale": ["remove-background", "compress-image"],
  "image-to-pdf": ["merge-pdf", "remove-pages"],
  "merge-pdf": ["remove-pages", "image-to-pdf"],
  "remove-pages": ["merge-pdf", "image-to-pdf"],
};

export const TOOL_META = {
  "resize-image": { label: "Resize Image", desc: "Change width and height" },
  "crop-image": { label: "Crop Image", desc: "Crop, rotate and flip" },
  "compress-image": { label: "Compress Image", desc: "Shrink file size" },
  "change-file-size": { label: "Change File Size", desc: "Hit an exact KB target" },
  "change-dpi": { label: "Change DPI", desc: "Update print resolution" },
  "convert-image": { label: "Convert Image", desc: "Switch PNG/JPG/WEBP" },
  "remove-background": { label: "Remove Background", desc: "AI background removal" },
  "ai-upscale": { label: "AI Upscale", desc: "Increase resolution" },
  "image-to-pdf": { label: "Image to PDF", desc: "Combine images into a PDF" },
  "merge-pdf": { label: "Merge PDF", desc: "Combine PDFs into one" },
  "remove-pages": { label: "Remove Pages", desc: "Delete PDF pages" },
};

export function getRelatedTools(currentSlug) {

  const related = TOOL_RELATIONS[currentSlug] || [];

  return related.map((slug) => ({ slug, ...TOOL_META[slug] }));

}