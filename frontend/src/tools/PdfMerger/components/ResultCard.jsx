import { Download, FileText } from "lucide-react";

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

      <div className="flex flex-col items-center text-center py-4">

        <div className="bg-blue-600/15 rounded-full p-4">

          <FileText size={32} className="text-blue-400" />

        </div>

        <h3 className="text-xl font-semibold text-white mt-5">

          {result.name}

        </h3>

        <p className="text-zinc-400 mt-2">

          Merged {result.fileCount} {result.fileCount === 1 ? "file" : "files"} · {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} · {formatSize(result.size)}

        </p>

        <Button
          variant="success"
          size="lg"
          onClick={handleDownload}
          className="mt-8"
        >

          <Download size={18} />

          Download PDF

        </Button>

      </div>

    </Card>

  );

}