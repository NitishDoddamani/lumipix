import { Download } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function formatSize(bytes) {
  if (!bytes) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DownloadCard({
  result,
}) {

  if (!result) return null;

  const handleDownload = () => {

    const link = document.createElement("a");

    link.href = result.url;

    link.download = result.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  return (

    <Card>

      <div className="flex flex-col items-center text-center">

        <h3 className="text-xl font-semibold text-white">

          Your Image is Ready

        </h3>

        <p className="text-zinc-400 mt-2">

          Download the resized file.

        </p>

        <div className="mt-6 grid grid-cols-2 gap-6 w-full text-center max-w-sm">

          <div>

            <p className="text-zinc-500 text-sm">
              Final Size
            </p>

            <p className="text-green-400 font-semibold mt-1">
              {formatSize(result.size)}
            </p>

          </div>

          <div>

            <p className="text-zinc-500 text-sm">
              Resolution
            </p>

            <p className="text-blue-400 font-semibold mt-1">
              {result.width} × {result.height}
            </p>

          </div>

        </div>

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

  );

}