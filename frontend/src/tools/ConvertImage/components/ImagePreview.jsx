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

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">

        Result Preview

      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">

            Original

          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Format
              </span>

              <span className="text-white font-medium">
                {result.originalFormat}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                File Size
              </span>

              <span className="text-white font-medium">
                {formatSize(original.file.size)}
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

            Converted

          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Format
              </span>

              <span className="text-emerald-400 font-semibold">
                {result.format}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                File Size
              </span>

              <span className="text-white font-medium">
                {formatSize(result.size)}
              </span>

            </div>

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={result.url}
              alt="Converted"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

      </div>

    </div>

  );

}