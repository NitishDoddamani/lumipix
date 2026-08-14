import { Download } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function formatSize(bytes) {
  if (!bytes) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ResultCard({
  original,
  result,
}) {

  if (!original || !result) return null;

  const handleDownload = () => {

    const link = document.createElement("a");

    link.href = result.url;

    link.download = result.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">

        Result

      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">

            Before

          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Dimensions
              </span>

              <span className="text-white font-medium">
                {result.originalWidth} × {result.originalHeight} px
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

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[320px] flex items-center justify-center p-4">

            <img
              src={original.preview}
              alt="Original"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

        <Card>

          <h3 className="text-lg font-semibold text-white mb-5">

            After ({result.scale}×)

          </h3>

          <div className="space-y-3 text-sm mb-5">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Dimensions
              </span>

              <span className="text-white font-medium">
                {result.width} × {result.height} px
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

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[320px] flex items-center justify-center p-4">

            <img
              src={result.url}
              alt="Upscaled result"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

      </div>

      <Card>

        <div className="flex flex-col items-center text-center">

          <h3 className="text-xl font-semibold text-white">

            Your Image is Ready

          </h3>

          <p className="text-zinc-400 mt-2">

            Download your upscaled image.

          </p>

          <Button
            variant="success"
            size="lg"
            onClick={handleDownload}
            className="mt-8"
          >

            <Download size={18} />

            Download Image

          </Button>

        </div>

      </Card>

    </div>

  );

}