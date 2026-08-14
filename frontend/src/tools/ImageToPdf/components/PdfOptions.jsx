import { Info, RectangleVertical, RectangleHorizontal } from "lucide-react";

import PagePreview from "./PagePreview";

const PAGE_SIZES = [
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
  { label: "Fit to Image", value: "fit" },
];

const ORIENTATIONS = [
  { label: "Auto", value: "auto", icon: null },
  { label: "Portrait", value: "portrait", icon: RectangleVertical },
  { label: "Landscape", value: "landscape", icon: RectangleHorizontal },
];

const MARGINS = [
  { label: "None", value: 0 },
  { label: "Normal", value: 10 },
  { label: "Large", value: 20 },
];

export default function PdfOptions({
  images,
  settings,
  setSettings,
  loading,
  progress,
  onGenerate,
}) {

  const update = (field, value) => {

    setSettings((prev) => ({ ...prev, [field]: value }));

  };

  const isFit = settings.pageSize === "fit";

  return (

    <div className="space-y-6">

      <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-white mb-8">

          PDF Settings

        </h2>

        <label className="text-zinc-300 font-medium text-sm">

          Page Size

        </label>

        <div className="mt-3 grid grid-cols-3 gap-2">

          {PAGE_SIZES.map((opt) => (

            <button
              key={opt.value}
              type="button"
              onClick={() => update("pageSize", opt.value)}
              className={`
                rounded-xl
                border
                py-3
                text-sm
                font-medium
                transition

                ${
                  settings.pageSize === opt.value
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300"
                }
              `}
            >

              {opt.label}

            </button>

          ))}

        </div>

        {isFit ? (

          <div className="mt-5 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">

            <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />

            <p className="text-xs text-amber-200/90">

              Orientation and margin are turned off in this mode —
              each page is already sized to exactly match its image,
              so there's nothing for them to control.

            </p>

          </div>

        ) : (

          <>

            <label className="block mt-7 font-medium text-sm text-zinc-300">

              Orientation

            </label>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {ORIENTATIONS.map((opt) => {

                const Icon = opt.icon;

                return (

                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("orientation", opt.value)}
                    className={`
                      rounded-xl
                      border
                      py-3
                      flex
                      flex-col
                      items-center
                      gap-1.5
                      text-sm
                      font-medium
                      transition

                      ${
                        settings.orientation === opt.value
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300"
                      }
                    `}
                  >

                    {Icon && <Icon size={18} />}

                    {opt.label}

                  </button>

                );

              })}

            </div>

            <label className="block mt-7 font-medium text-sm text-zinc-300">

              Margin

            </label>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {MARGINS.map((opt) => (

                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("margin", opt.value)}
                  className={`
                    rounded-xl
                    border
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      settings.margin === opt.value
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300"
                    }
                  `}
                >

                  {opt.label}

                </button>

              ))}

            </div>

          </>

        )}

        <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

          <Info size={14} className="shrink-0 mt-0.5" />

          <span>

            Each image becomes its own page, in the order shown on the
            left.

          </span>

        </div>

        {loading && (

          <div className="mt-6">

            <div className="flex justify-between text-xs text-zinc-400 mb-2">

              <span>Generating PDF...</span>

              <span>{progress}%</span>

            </div>

            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">

              <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />

            </div>

          </div>

        )}

        <button
          onClick={onGenerate}
          disabled={loading || images.length === 0}
          className="
            w-full
            mt-9
            py-4
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            text-lg
            font-semibold
            text-white
          "
        >

          {loading
            ? "Generating..."
            : `Generate PDF${images.length ? ` (${images.length})` : ""}`}

        </button>

      </div>

      {images.length > 0 && (

  <PagePreview
    images={images}
    settings={settings}
  />

)}

    </div>

  );

}