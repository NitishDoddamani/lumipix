import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, RefreshCw } from "lucide-react";

const RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
];

export default function CropOptions({
  crop,
  bounds,
  aspectRatio,
  onAspectChange,
  onRotate,
  onFlip,
  onReset,
  onCropFieldChange,
  loading,
  onApply,
}) {

  const field = (label, key) => (

    <div>

      <label className="text-xs text-zinc-500">{label}</label>

      <input
        type="number"
        value={Math.round(crop[key])}
        onChange={(e) => onCropFieldChange(key, Number(e.target.value))}
        className="w-full mt-1 bg-[#1f1f24] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
      />

    </div>

  );

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8 h-fit">

      <h2 className="text-3xl font-bold text-white mb-8">

        Crop

      </h2>

      <label className="text-zinc-300 font-medium text-sm">

        Aspect Ratio

      </label>

      <div className="mt-3 grid grid-cols-4 gap-2">

        {RATIOS.map((r) => (

          <button
            key={r.label}
            type="button"
            onClick={() => onAspectChange(r.value)}
            className={`
              rounded-lg
              border
              py-2
              text-xs
              font-medium
              transition

              ${
                aspectRatio === r.value
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300"
              }
            `}
          >

            {r.label}

          </button>

        ))}

      </div>

      <label className="block mt-7 text-zinc-300 font-medium text-sm">

        Rotate & Flip

      </label>

      <div className="mt-3 grid grid-cols-4 gap-2">

        <button
          type="button"
          onClick={() => onRotate("ccw")}
          className="flex flex-col items-center gap-1 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300 py-3 text-xs"
        >
          <RotateCcw size={16} />
          Left
        </button>

        <button
          type="button"
          onClick={() => onRotate("cw")}
          className="flex flex-col items-center gap-1 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300 py-3 text-xs"
        >
          <RotateCw size={16} />
          Right
        </button>

        <button
          type="button"
          onClick={() => onFlip("horizontal")}
          className="flex flex-col items-center gap-1 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300 py-3 text-xs"
        >
          <FlipHorizontal size={16} />
          Flip H
        </button>

        <button
          type="button"
          onClick={() => onFlip("vertical")}
          className="flex flex-col items-center gap-1 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-[#1f1f24] text-zinc-300 py-3 text-xs"
        >
          <FlipVertical size={16} />
          Flip V
        </button>

      </div>

      <label className="block mt-7 text-zinc-300 font-medium text-sm">

        Crop Box (px)

      </label>

      <div className="mt-3 grid grid-cols-2 gap-3">

        {field("X", "x")}
        {field("Y", "y")}
        {field("Width", "width")}
        {field("Height", "height")}

      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition py-2"
      >

        <RefreshCw size={14} />

        Reset to original

      </button>

      <button
        onClick={onApply}
        disabled={loading}
        className="
          w-full
          mt-3
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

        {loading ? "Cropping..." : "Apply Crop"}

      </button>

    </div>

  );

}