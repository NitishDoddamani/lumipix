import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

import CompressionPresetCard from "./CompressionPresetCard";
import CompressionModeCard from "./CompressionModeCard";

export default function CompressionOptions({
  image,
  settings,
  setSettings,
  loading,
  onCompress,
}) {
  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const update = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreset = (preset) => {
    let quality = settings.quality;

    switch (preset) {
      case "maximum":
        quality = 95;
        break;

      case "balanced":
        quality = 80;
        break;

      case "compression":
        quality = 55;
        break;

      case "custom":
        quality = settings.quality;
        break;

      default:
        break;
    }

    setSettings((prev) => ({
      ...prev,
      preset,
      quality,
    }));
  };

  const originalKB = image
    ? Math.ceil(image.file.size / 1024)
    : 0;

  const targetError =
    settings.mode === "target"
      ? settings.targetSize <= 0
        ? "Target size must be greater than 0 KB."
        : settings.targetSize > originalKB
        ? `Target size cannot exceed ${originalKB} KB.`
        : null
      : null;

  return (
    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-8">
        Compression Settings
      </h2>

      {/* ================= METHOD ================= */}

      <div>

        <label className="text-zinc-300 font-medium">
          Compression Method
        </label>

        <div className="grid grid-cols-2 gap-4 mt-4">

          <CompressionModeCard
            title="Compress by Quality"
            description="Control image quality manually."
            value="quality"
            selected={settings.mode}
            onSelect={(v) => update("mode", v)}
          />

          <CompressionModeCard
            title="Compress by Target Size"
            description="Compress to an exact file size."
            value="target"
            selected={settings.mode}
            onSelect={(v) => update("mode", v)}
          />

        </div>

      </div>

      {/* =======================================================
          NOTHING SELECTED
      ======================================================== */}

      {!settings.mode && (

        <div className="mt-12 text-center text-zinc-500">

          Select a compression method to continue.

        </div>

      )}

      {/* =======================================================
          QUALITY MODE
      ======================================================== */}

      {settings.mode === "quality" && (

        <>

          <div className="mt-8">

            <label className="text-zinc-300 font-medium">
              Compression Preset
            </label>

            <div className="grid grid-cols-2 gap-4 mt-4">

              <CompressionPresetCard
                title="Balanced"
                description="Best balance between quality and size."
                value="balanced"
                selected={settings.preset}
                onSelect={handlePreset}
              />

              <CompressionPresetCard
                title="Maximum Quality"
                description="Highest image quality."
                value="maximum"
                selected={settings.preset}
                onSelect={handlePreset}
              />

              <CompressionPresetCard
                title="Maximum Compression"
                description="Smallest possible file."
                value="compression"
                selected={settings.preset}
                onSelect={handlePreset}
              />

              <CompressionPresetCard
                title="Custom"
                description="Choose quality manually."
                value="custom"
                selected={settings.preset}
                onSelect={handlePreset}
              />

            </div>

          </div>

          {settings.preset === "custom" && (

            <div className="mt-8">

              <div className="flex justify-between mb-3">

                <label className="text-zinc-300 font-medium">
                  Image Quality
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
                  update(
                    "quality",
                    Number(e.target.value)
                  )
                }
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-xs text-zinc-500 mt-2">

                <span>Smaller File</span>

                <span>Higher Quality</span>

              </div>

            </div>

          )}

        </>

      )}

      {/* =======================================================
          TARGET SIZE MODE
      ======================================================== */}

      {settings.mode === "target" && (

        <div className="mt-8">

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

          {targetError && (

            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">

              <AlertTriangle size={16} />

              <span>

                {targetError}

              </span>

            </div>

          )}

        </div>

      )}

      {/* =======================================================
          ADVANCED SETTINGS
      ======================================================== */}

      {settings.mode && (

        <>

          <button
            type="button"
            onClick={() =>
              setShowAdvanced(!showAdvanced)
            }
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

                  Keep Metadata

                </span>

              </label>

            </div>

          )}

          {/* ================= BUTTON ================= */}

          <button
            onClick={onCompress}
            disabled={
              loading ||
              (settings.mode === "target" &&
                !!targetError)
            }
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
              ? "Compressing..."
              : "Compress Image"}

          </button>

        </>

      )}

    </div>
  );
}