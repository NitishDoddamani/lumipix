import { Info } from "lucide-react";

const PRESETS = [
  { label: "Transparent", value: "transparent", swatch: null },
  { label: "White", value: "#ffffff", swatch: "#ffffff" },
  { label: "Black", value: "#000000", swatch: "#000000" },
];

export default function BackgroundOptions({
  image,
  settings,
  setSettings,
  loading,
  progressLabel,
  onProcess,
}) {

  const update = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const isCustomSelected = !PRESETS.some(
    (p) => p.value === settings.backgroundColor
  );

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">

        Background

      </h2>

      <label className="text-zinc-300 font-medium">

        Replace background with

      </label>

      <div className="mt-4 grid grid-cols-3 gap-3">

        {PRESETS.map((preset) => (

          <button
            key={preset.value}
            type="button"
            onClick={() => update("backgroundColor", preset.value)}
            className={`
              rounded-xl
              border
              px-3
              py-3
              flex
              flex-col
              items-center
              gap-2
              transition

              ${
                settings.backgroundColor === preset.value
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24]"
              }
            `}
          >

            <div
              className={`
                w-8
                h-8
                rounded-md
                border
                border-zinc-600

                ${
                  preset.swatch === null
                    ? "bg-[conic-gradient(#3a3a3a_0deg_90deg,#232327_90deg_180deg,#3a3a3a_180deg_270deg,#232327_270deg_360deg)] bg-[length:10px_10px]"
                    : ""
                }
              `}
              style={
                preset.swatch
                  ? { backgroundColor: preset.swatch }
                  : undefined
              }
            />

            <span className="text-xs text-white font-medium">

              {preset.label}

            </span>

          </button>

        ))}

      </div>

      <button
        type="button"
        onClick={() => update("backgroundColor", settings.customColor)}
        className={`
          mt-3
          w-full
          rounded-xl
          border
          px-4
          py-3
          flex
          items-center
          gap-3
          transition

          ${
            isCustomSelected
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24]"
          }
        `}
      >

        <input
          type="color"
          value={settings.customColor}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {

            update("customColor", e.target.value);
            update("backgroundColor", e.target.value);

          }}
          className="w-8 h-8 rounded-md border border-zinc-600 bg-transparent cursor-pointer"
        />

        <span className="text-sm text-white font-medium">

          Custom color

        </span>

      </button>

      <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

        <Info size={14} className="shrink-0 mt-0.5" />

        <span>

          The AI model runs entirely in your browser. The first run
          downloads the model (a one-time download, cached
          afterwards), so it can take longer the first time you use it.

        </span>

      </div>

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

        {loading
          ? progressLabel || "Processing..."
          : "Remove Background"}

      </button>

    </div>

  );

}