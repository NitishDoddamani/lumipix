import Card from "../../../components/ui/Card";

function formatSize(bytes) {
  if (!bytes) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImagePreview({
  original,
  result,
}) {

  if (!original || !result) return null;

  const originalSize = original.file.size;
  const resultSize = result.file.size;

  const grew = resultSize > originalSize;

  const diff = Math.abs(resultSize - originalSize);

  const percent =
    originalSize > 0
      ? ((diff / originalSize) * 100).toFixed(1)
      : "0.0";

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">

        Result Preview

      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={original.preview}
              alt="Original"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">

            New Image

          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Resolution
              </span>

              <span className="text-white font-medium">
                {result.width} × {result.height} px
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                File Size
              </span>

              <span
                className={`font-semibold ${
                  grew ? "text-emerald-400" : "text-green-400"
                }`}
              >
                {formatSize(resultSize)}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                {grew ? "Increased By" : "Reduced By"}
              </span>

              <span
                className={`font-semibold ${
                  grew ? "text-emerald-400" : "text-green-400"
                }`}
              >
                {formatSize(diff)} ({percent}%)
              </span>

            </div>

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={result.url}
              alt="Result"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

      </div>

    </div>

  );

}