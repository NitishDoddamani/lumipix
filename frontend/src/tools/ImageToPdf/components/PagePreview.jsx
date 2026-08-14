import Card from "../../../components/ui/Card";

const PAGE_SIZES_MM = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
};

function computePreviewBox(image, settings) {

  const { pageSize, orientation, margin } = settings;

  if (pageSize === "fit") {

    return {
      pageW: image.width,
      pageH: image.height,
      marginPct: 0,
    };

  }

  const base = PAGE_SIZES_MM[pageSize] || PAGE_SIZES_MM.a4;

  let isLandscape;

  if (orientation === "landscape") isLandscape = true;
  else if (orientation === "portrait") isLandscape = false;
  else isLandscape = image.width >= image.height; // auto

  const pageW = isLandscape ? base.h : base.w;
  const pageH = isLandscape ? base.w : base.h;

  const marginPct = (margin / Math.min(pageW, pageH)) * 100;

  return { pageW, pageH, marginPct };

}

function PageThumb({ image, index, settings }) {

  const { pageW, pageH, marginPct } = computePreviewBox(image, settings);

  return (

    <div className="flex flex-col items-center gap-2">

      <div className="flex items-center justify-center bg-[#111] border border-zinc-800 rounded-lg p-3 w-full">

        <div
          className="bg-white shadow relative"
          style={{
            aspectRatio: `${pageW} / ${pageH}`,
            width: pageW >= pageH ? "100%" : "auto",
            height: pageW >= pageH ? "auto" : "140px",
            maxHeight: "140px",
            maxWidth: "100%",
          }}
        >

          <div
            className="absolute flex items-center justify-center"
            style={{ inset: `${marginPct}%` }}
          >

            <img
              src={image.preview}
              alt={`Page ${index + 1} preview`}
              className="w-full h-full object-contain"
            />

          </div>

        </div>

      </div>

      <span className="text-xs text-zinc-500">

        Page {index + 1}

      </span>

    </div>

  );

}

export default function PagePreview({ images, settings }) {

  if (!images || images.length === 0) return null;

  return (

    <Card>

      <h3 className="text-sm font-semibold text-white mb-1">

        Preview — {images.length} {images.length === 1 ? "page" : "pages"}

      </h3>

      <p className="text-xs text-zinc-500 mb-4">

        Updates as you change settings below — check this before generating

      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">

        {images.map((image, index) => (

          <PageThumb
            key={image.id}
            image={image}
            index={index}
            settings={settings}
          />

        ))}

      </div>

      <p className="text-xs text-zinc-500 mt-4 text-center">

        {settings.pageSize === "fit"
          ? "Each page sized to match its own image"
          : `${settings.pageSize.toUpperCase()} · ${settings.margin}mm margin`}

      </p>

    </Card>

  );

}