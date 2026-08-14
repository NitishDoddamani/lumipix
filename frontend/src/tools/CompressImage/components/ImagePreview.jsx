import Card from "../../../components/ui/Card";

function formatSize(bytes) {
  if (!bytes) return "--";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImagePreview({
  original,
  compressed,
}) {
  if (!original || !compressed) return null;

  const originalSize = original.file.size;
  const compressedSize = compressed.file.size;

  const saved = originalSize - compressedSize;

  const reduced = saved >= 0;

  const percent =
    originalSize > 0
      ? (
          (Math.abs(saved) / originalSize) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">
        Compression Preview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ORIGINAL */}

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">
            Original Image
          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">
              <span className="text-zinc-400">
                Resolution
              </span>

              <span className="text-white font-medium">
                {original.width} × {original.height} px
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">
                File Size
              </span>

              <span className="text-white font-medium">
                {formatSize(originalSize)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">
                Image Format
              </span>

              <span className="text-white font-medium">
                {original.file.type
                  .replace("image/", "")
                  .toUpperCase()}
              </span>
            </div>

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={original.preview}
              alt="Original"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

        {/* COMPRESSED */}

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">
            Compressed Image
          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Resolution
              </span>

              <span className="text-white font-medium">
                {compressed.width} × {compressed.height} px
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                File Size
              </span>

              <span
                className={`font-semibold ${
                  reduced
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatSize(compressedSize)}
              </span>

            </div>

            {compressed.fallbackToOriginal ? (

  <div className="flex justify-between">

    <span className="text-zinc-400">
      Result
    </span>

    <span className="text-blue-400 font-semibold text-right">
      Already optimized — original kept
    </span>

  </div>

) : reduced ? (

  <>
    <div className="flex justify-between">

      <span className="text-zinc-400">
        Saved
      </span>

      <span className="text-green-400 font-semibold">
        {formatSize(saved)}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-zinc-400">
        Compression
      </span>

      <span className="text-blue-400 font-semibold">
        {percent}%
      </span>

    </div>
  </>

) : (

  <>
    <div className="flex justify-between">

      <span className="text-zinc-400">
        Increased By
      </span>

      <span className="text-red-400 font-semibold">
        {formatSize(Math.abs(saved))}
      </span>

    </div>

    <div className="flex justify-between">

      <span className="text-zinc-400">
        Increase
      </span>

      <span className="text-red-400 font-semibold">
        {percent}%
      </span>

    </div>
  </>

)}

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Quality Used
              </span>

              <span className="text-white font-medium">
                {compressed.quality}%
              </span>

            </div>

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={compressed.url}
              alt="Compressed"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

      </div>

    </div>
  );
}