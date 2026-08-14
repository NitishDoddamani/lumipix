import { Download } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function formatSize(bytes) {
  if (!bytes) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ResultCard({ result }) {

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

        <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[280px] flex items-center justify-center p-4">

          <img
            src={result.url}
            alt="Cropped result"
            className="max-h-full max-w-full object-contain rounded-xl"
          />

        </div>

        <div className="flex flex-col items-center text-center">

          <h3 className="text-xl font-semibold text-white">

            Your Image is Ready

          </h3>

          <p className="text-zinc-400 mt-2">

            {result.width} × {result.height} px · {formatSize(result.size)}

          </p>

          <Button
            variant="success"
            size="lg"
            onClick={handleDownload}
            className="mt-6"
          >

            <Download size={18} />

            Download Image

          </Button>

        </div>

      </div>

    </Card>

  );

}