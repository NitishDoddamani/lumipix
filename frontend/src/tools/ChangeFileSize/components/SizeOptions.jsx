import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export default function SizeOptions({
  image,
  settings,
  setSettings,
  loading,
  onProcess,
}) {

  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const originalKB = image
    ? Math.ceil(image.file.size / 1024)
    : 0;

  const targetKB = Number(settings.targetSize);

  const invalid = !targetKB || targetKB <= 0;

  const direction =
    !image || invalid
      ? null
      : targetKB > originalKB
      ? "grow"
      : targetKB < originalKB
      ? "shrink"
      : "same";

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">

        Size Settings

      </h2>

      <label className="text-zinc-300 font-medium">

        Target File Size (KB)

      </label>

      <input
        type="number"
        min="1"
        value={settings.targetSize}
        onChange={(e) =>
          update(
            "targetSize",
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

      <p className="mt-3 text-sm text-zinc-500">

        Original Image Size :

        <span className="text-white ml-1">

          {originalKB} KB

        </span>

      </p>

      {invalid && (

        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">

          <AlertTriangle size={16} />

          <span>

            Target size must be greater than 0 KB.

          </span>

        </div>

      )}

      {direction === "shrink" && (

        <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">

          <ArrowDownCircle size={16} />

          <span>

            This will compress the image down to ~{targetKB} KB.

          </span>

        </div>

      )}

      {direction === "grow" && (

        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">

          <ArrowUpCircle size={16} />

          <span>

            This will enlarge the image up to ~{targetKB} KB. It adds
            pixels, not real detail.

          </span>

        </div>

      )}

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="
          mt-8
          flex
          items-center
          gap-2
          text-blue-400
          font-semibold
          hover:text-blue-300
          transition
        "
      >

        Advanced Settings

        {showAdvanced ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}

      </button>

      {showAdvanced && (

        <div className="mt-5 pt-5 border-t border-zinc-800">

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={settings.keepMetadata}
              onChange={(e) =>
                update(
                  "keepMetadata",
                  e.target.checked
                )
              }
              className="w-4 h-4 accent-blue-600"
            />

            <span className="text-zinc-300">

              Keep Metadata (shrink only)

            </span>

          </label>

        </div>

      )}

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
          : "Change File Size"}

      </button>

    </div>

  );

}