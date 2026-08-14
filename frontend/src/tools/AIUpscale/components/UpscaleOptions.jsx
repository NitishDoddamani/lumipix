import { Info } from "lucide-react";

const SCALES = [
  { label: "2×", value: 2, hint: "Faster, smaller model" },
  { label: "4×", value: 4, hint: "Sharper, slower" },
];

export default function UpscaleOptions({
  image,
  settings,
  setSettings,
  loading,
  progress,
  onProcess,
}) {

  const update = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">

        Upscale

      </h2>

      <label className="text-zinc-300 font-medium">

        Scale factor

      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">

        {SCALES.map((s) => (

          <button
            key={s.value}
            type="button"
            onClick={() => update("scale", s.value)}
            className={`
              rounded-xl
              border
              px-4
              py-4
              flex
              flex-col
              items-center
              gap-1
              transition

              ${
                settings.scale === s.value
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24]"
              }
            `}
          >

            <span className="text-xl font-bold text-white">

              {s.label}

            </span>

            <span className="text-xs text-zinc-500">

              {s.hint}

            </span>

          </button>

        ))}

      </div>

      {image && (

        <div className="mt-5 text-sm text-zinc-400">

          Output size:{" "}

          <span className="text-white font-medium">

            {image.width * settings.scale} × {image.height * settings.scale} px

          </span>

        </div>

      )}

      <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

        <Info size={14} className="shrink-0 mt-0.5" />

        <span>

          The AI model runs entirely in your browser. The first run
          downloads the model (a one-time download, cached
          afterwards). Images larger than 1600×1600px aren't
          supported yet — resize them down first.

        </span>

      </div>

      {loading && (

        <div className="mt-6">

          <div className="flex justify-between text-xs text-zinc-400 mb-2">

            <span>Upscaling...</span>

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
        onClick={onProcess}
        disabled={loading || !image}
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

        {loading ? "Processing..." : "Upscale Image"}

      </button>

    </div>

  );

}