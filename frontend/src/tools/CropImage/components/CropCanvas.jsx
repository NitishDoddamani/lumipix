import { useEffect, useRef, useState } from "react";

const MIN_SIZE = 24;
const CURSORS = {
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function computeNewRect(handle, start, dx, dy, bounds, ratio) {

  let { left, top, width, height } = start;

  const anchorRight = start.left + start.width;
  const anchorBottom = start.top + start.height;

  switch (handle) {

    case "move": {

      left = clamp(start.left + dx, 0, bounds.width - start.width);
      top = clamp(start.top + dy, 0, bounds.height - start.height);
      width = start.width;
      height = start.height;
      break;

    }

    case "se": {

      width = clamp(start.width + dx, MIN_SIZE, bounds.width - start.left);
      height = clamp(start.height + dy, MIN_SIZE, bounds.height - start.top);

      if (ratio) {

        height = width / ratio;

        if (top + height > bounds.height) {
          height = bounds.height - top;
          width = height * ratio;
        }

      }

      break;

    }

    case "nw": {

      width = clamp(start.width - dx, MIN_SIZE, anchorRight);
      height = clamp(start.height - dy, MIN_SIZE, anchorBottom);

      if (ratio) {

        height = width / ratio;

        if (anchorBottom - height < 0) {
          height = anchorBottom;
          width = height * ratio;
        }

      }

      left = anchorRight - width;
      top = anchorBottom - height;

      break;

    }

    case "ne": {

      width = clamp(start.width + dx, MIN_SIZE, bounds.width - start.left);
      height = clamp(start.height - dy, MIN_SIZE, anchorBottom);

      if (ratio) {

        height = width / ratio;

        if (anchorBottom - height < 0) {
          height = anchorBottom;
          width = height * ratio;
        }

      }

      left = start.left;
      top = anchorBottom - height;

      break;

    }

    case "sw": {

      width = clamp(start.width - dx, MIN_SIZE, anchorRight);
      height = clamp(start.height + dy, MIN_SIZE, bounds.height - start.top);

      if (ratio) {

        height = width / ratio;

        if (top + height > bounds.height) {
          height = bounds.height - top;
          width = height * ratio;
        }

      }

      left = anchorRight - width;
      top = start.top;

      break;

    }

    case "n": {

      height = clamp(start.height - dy, MIN_SIZE, anchorBottom);
      top = anchorBottom - height;
      width = start.width;
      left = start.left;

      if (ratio) {

        width = height * ratio;
        const centerX = start.left + start.width / 2;
        left = clamp(centerX - width / 2, 0, bounds.width - width);

      }

      break;

    }

    case "s": {

      height = clamp(start.height + dy, MIN_SIZE, bounds.height - start.top);
      top = start.top;
      width = start.width;
      left = start.left;

      if (ratio) {

        width = height * ratio;
        const centerX = start.left + start.width / 2;
        left = clamp(centerX - width / 2, 0, bounds.width - width);

      }

      break;

    }

    case "e": {

      width = clamp(start.width + dx, MIN_SIZE, bounds.width - start.left);
      left = start.left;
      top = start.top;
      height = start.height;

      if (ratio) {

        height = width / ratio;
        const centerY = start.top + start.height / 2;
        top = clamp(centerY - height / 2, 0, bounds.height - height);

      }

      break;

    }

    case "w": {

      width = clamp(start.width - dx, MIN_SIZE, anchorRight);
      left = anchorRight - width;
      top = start.top;
      height = start.height;

      if (ratio) {

        height = width / ratio;
        const centerY = start.top + start.height / 2;
        top = clamp(centerY - height / 2, 0, bounds.height - height);

      }

      break;

    }

    default:
      break;

  }

  return { left, top, width, height };

}

function Handle({ type, onPointerDown }) {

  const posStyles = {
    nw: { top: -6, left: -6 },
    n: { top: -6, left: "50%", transform: "translateX(-50%)" },
    ne: { top: -6, right: -6 },
    e: { top: "50%", right: -6, transform: "translateY(-50%)" },
    se: { bottom: -6, right: -6 },
    s: { bottom: -6, left: "50%", transform: "translateX(-50%)" },
    sw: { bottom: -6, left: -6 },
    w: { top: "50%", left: -6, transform: "translateY(-50%)" },
  };

  return (

    <div
      onPointerDown={onPointerDown}
      className="absolute w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-sm z-10"
      style={{ ...posStyles[type], cursor: CURSORS[type], touchAction: "none" }}
    />

  );

}

export default function CropCanvas({ workingImage, crop, onCropChange, aspectRatio }) {

  const containerRef = useRef(null);
  const dragRef = useRef(null);

  // Always holds the latest display rect, kept in sync with state on every
  // update. Event listeners registered once at drag-start read from this
  // ref instead of from React state, so they never see a stale value.
  const displayRectRef = useRef(null);

  const [displayRect, setDisplayRect] = useState(null);

  function updateDisplayRect(next) {
    displayRectRef.current = next;
    setDisplayRect(next);
  }

  useEffect(() => {

    function sync() {

      if (!containerRef.current || !workingImage) return;

      const rect = containerRef.current.getBoundingClientRect();

      const scaleX = rect.width / workingImage.width;
      const scaleY = rect.height / workingImage.height;

      updateDisplayRect({
        left: crop.x * scaleX,
        top: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      });

    }

    sync();

    window.addEventListener("resize", sync);

    return () => window.removeEventListener("resize", sync);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, workingImage]);

  function getBounds() {

    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };

  }

  function toNaturalRect(rect) {

    const bounds = getBounds();

    const scaleX = workingImage.width / bounds.width;
    const scaleY = workingImage.height / bounds.height;

    return {
      x: Math.round(rect.left * scaleX),
      y: Math.round(rect.top * scaleY),
      width: Math.round(rect.width * scaleX),
      height: Math.round(rect.height * scaleY),
    };

  }

  function startDrag(handle, e) {

    e.preventDefault();
    e.stopPropagation();

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startRect: { ...displayRectRef.current },
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

  }

  function onMove(e) {

    if (!dragRef.current) return;

    const { handle, startX, startY, startRect } = dragRef.current;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const bounds = getBounds();

    const next = computeNewRect(handle, startRect, dx, dy, bounds, aspectRatio);

    updateDisplayRect(next);

  }

  function onUp() {

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);

    if (dragRef.current && displayRectRef.current) {

      onCropChange(toNaturalRect(displayRectRef.current));

    }

    dragRef.current = null;

  }

  if (!workingImage) return null;

  return (

    <div
      ref={containerRef}
      className="relative select-none touch-none rounded-2xl overflow-hidden border border-zinc-800"
    >

      <img
        src={workingImage.dataUrl}
        alt="Crop preview"
        className="w-full block pointer-events-none"
        draggable={false}
      />

      {displayRect && (

        <>

          <div
            className="absolute bg-black/60 pointer-events-none"
            style={{ left: 0, top: 0, width: "100%", height: displayRect.top }}
          />

          <div
            className="absolute bg-black/60 pointer-events-none"
            style={{
              left: 0,
              top: displayRect.top + displayRect.height,
              width: "100%",
              bottom: 0,
            }}
          />

          <div
            className="absolute bg-black/60 pointer-events-none"
            style={{
              left: 0,
              top: displayRect.top,
              width: displayRect.left,
              height: displayRect.height,
            }}
          />

          <div
            className="absolute bg-black/60 pointer-events-none"
            style={{
              left: displayRect.left + displayRect.width,
              top: displayRect.top,
              right: 0,
              height: displayRect.height,
            }}
          />

          <div
            className="absolute border-2 border-blue-500 cursor-move"
            style={{
              left: displayRect.left,
              top: displayRect.top,
              width: displayRect.width,
              height: displayRect.height,
              touchAction: "none",
            }}
            onPointerDown={(e) => startDrag("move", e)}
          >

            {Object.keys(CURSORS).map((h) => (

              <Handle
                key={h}
                type={h}
                onPointerDown={(e) => startDrag(h, e)}
              />

            ))}

          </div>

        </>

      )}

    </div>

  );

}