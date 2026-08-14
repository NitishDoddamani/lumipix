// Runs entirely off the main thread. The expensive part — WebGL shader
// compilation on first run, plus the actual patch-by-patch inference — was
// blocking the UI thread when it ran on main. Moving it here means the page
// stays responsive (no blank screen, no frozen scroll) even on a weak
// CPU/GPU. The trade-off: total compute time on a slow device is unchanged
// — that's the hardware, not something code can fix — but the tab won't
// look/feel frozen while it happens.

import Upscaler from "upscaler";
import x2Model from "@upscalerjs/esrgan-slim/2x";
import x4Model from "@upscalerjs/esrgan-slim/4x";

let activeUpscaler = null;
let activeScale = null;

async function getUpscaler(scale) {

  if (activeUpscaler && activeScale === scale) return activeUpscaler;

  if (activeUpscaler) {
    await activeUpscaler.dispose();
    activeUpscaler = null;
  }

  activeUpscaler = new Upscaler({
    model: scale === 4 ? x4Model : x2Model,
  });

  activeScale = scale;

  return activeUpscaler;

}

self.onmessage = async (e) => {

  const { id, bitmap, scale, patchSize, padding } = e.data;

  try {

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const upscaler = await getUpscaler(scale);

    const result = await upscaler.upscale(imageData, {
      output: "tensor",
      ...(patchSize ? { patchSize, padding } : {}),
      progress: (rate) => {
        self.postMessage({ id, type: "progress", pct: Math.round(rate * 100) });
      },
    });

    const [height, width] = result.shape;

    // tensor -> Uint8ClampedArray pixels, no DOM/canvas needed for this part
    const pixels = await result.data();
    result.dispose();

    const rgba = new Uint8ClampedArray(width * height * 4);

    for (let p = 0; p < width * height; p++) {
      rgba[p * 4] = pixels[p * 3];
      rgba[p * 4 + 1] = pixels[p * 3 + 1];
      rgba[p * 4 + 2] = pixels[p * 3 + 2];
      rgba[p * 4 + 3] = 255;
    }

    const outCanvas = new OffscreenCanvas(width, height);
    const outCtx = outCanvas.getContext("2d");
    outCtx.putImageData(new ImageData(rgba, width, height), 0, 0);

    const blob = await outCanvas.convertToBlob({ type: "image/png" });

    self.postMessage({ id, type: "done", blob, width, height });

  } catch (err) {

    self.postMessage({ id, type: "error", message: err?.message || "Upscale failed." });

  }

};