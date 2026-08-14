import { Check, Info, AlertTriangle } from "lucide-react";

const FORMAT_OPTIONS = [
  { value: "png", label: "PNG", sub: "Lossless, supports transparency" },
  { value: "jpeg", label: "JPG", sub: "Smaller size, no transparency" },
  { value: "webp", label: "WEBP", sub: "Best compression, keeps transparency" },
];

export default function ConvertOptions({
  image,
  settings,
  setSettings,
  loading,
  onProcess,
}) {

  const update = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const sameFormat =
    !!image && image.sourceFormat === settings.format;

  const isLossy =
    settings.format === "jpeg" || settings.format === "webp";

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">

        Convert Settings

      </h2>

      <label className="text-zinc-300 font-medium">

        Target Format

      </label>

      <div className="mt-4 grid grid-cols-1 gap-3">

        {FORMAT_OPTIONS.map((opt) => {

          const active = settings.format === opt.value;

          return (

            <button
              key={opt.value}
              type="button"
              onClick={() => update("format", opt.value)}
              className={`
                relative
                text-left
                rounded-2xl
                border
                px-4
                py-3
                transition-all
                duration-200

                ${
                  active
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24]"
                }
              `}
            >

              {active && (

                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">

                  <Check size={14} className="text-white" />

                </div>

              )}

              <p className="text-white text-sm font-semibold pr-8">

                {opt.label}

              </p>

              <p className="text-zinc-500 text-xs mt-0.5">

                {opt.sub}

              </p>

            </button>

          );

        })}

      </div>

      {isLossy && (

        <div className="mt-8">

          <div className="flex justify-between mb-3">

            <label className="text-zinc-300 font-medium">
              Quality
            </label>

            <span className="text-blue-400 font-semibold">
              {settings.quality}%
            </span>

          </div>

          <input
            type="range"
            min={1}
            max={100}
            value={settings.quality}
            onChange={(e) =>
              update("quality", Number(e.target.value))
            }
            className="w-full accent-blue-600"
          />

          <div className="flex justify-between text-xs text-zinc-500 mt-2">

            <span>Smaller File</span>

            <span>Higher Quality</span>

          </div>

        </div>

      )}

      {sameFormat && (

        <div className="mt-6 flex items-center gap-2 text-amber-400 text-sm">

          <AlertTriangle size={16} />

          <span>

            Image is already in {settings.format.toUpperCase()} format.

          </span>

        </div>

      )}

      {settings.format === "jpeg" && (

        <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

          <Info size={14} className="shrink-0 mt-0.5" />

          <span>

            JPG doesn't support transparency — any transparent areas
            will be filled with white.

          </span>

        </div>

      )}

      <button
        onClick={onProcess}
        disabled={loading || !image || sameFormat}
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

        {loading ? "Converting..." : "Convert Image"}

      </button>

    </div>

  );

}