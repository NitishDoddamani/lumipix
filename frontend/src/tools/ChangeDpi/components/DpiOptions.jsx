import { AlertTriangle, Info } from "lucide-react";

const PRESETS = [
  { label: "72 DPI", sub: "Web / Screen", value: 72 },
  { label: "150 DPI", sub: "Standard Print", value: 150 },
  { label: "300 DPI", sub: "High-Quality Print", value: 300 },
  { label: "600 DPI", sub: "Professional Print", value: 600 },
];

export default function DpiOptions({
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

  const targetDpi = Number(settings.targetDpi);

const invalid = !targetDpi || targetDpi <= 0 || targetDpi > 2400;

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">

        DPI Settings

      </h2>

      <label className="text-zinc-300 font-medium">

        Target DPI

      </label>

      <input
        type="number"
        min="1"
        value={settings.targetDpi}
        onChange={(e) =>
          update(
            "targetDpi",
            Number(e.target.value)
          )
        }
        onFocus={(e) => e.target.select()}
        className="
          w-full
          mt-4
          rounded-xl
          border
          border-zinc-700
          bg-[#232327]
          px-4
          py-3
          text-white
          outline-none
          focus:border-blue-500
        "
      />

      {image && (

        <p className="mt-3 text-sm text-zinc-500">

          Current DPI :

          <span className="text-white ml-1">

            {image.currentDpi}
            {!image.dpiDetected && " (assumed, not embedded)"}

          </span>

        </p>

      )}

      {invalid && (

        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">

          <AlertTriangle size={16} />

          <span>

            {!targetDpi || targetDpi <= 0
        ? "Target DPI must be greater than 0."
        : "Target DPI cannot exceed 2400."}

          </span>

        </div>

      )}

      <div className="mt-8 grid grid-cols-2 gap-3">

        {PRESETS.map((preset) => (

          <button
            key={preset.value}
            type="button"
            onClick={() => update("targetDpi", preset.value)}
            className={`
              rounded-xl
              border
              px-4
              py-3
              text-left
              transition

              ${
                targetDpi === preset.value
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24]"
              }
            `}
          >

            <p className="text-white text-sm font-semibold">

              {preset.label}

            </p>

            <p className="text-zinc-500 text-xs mt-0.5">

              {preset.sub}

            </p>

          </button>

        ))}

      </div>

      <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

        <Info size={14} className="shrink-0 mt-0.5" />

        <span>

          Changing DPI only updates print-resolution metadata — pixel
          dimensions, quality and appearance stay exactly the same.

        </span>

      </div>

      <button
        onClick={onProcess}
        disabled={loading || !image || invalid}
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
          ? "Processing..."
          : "Change DPI"}

      </button>

    </div>

  );

}