import { Download } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function DownloadCard({
  resized,
}) {

  if (!resized) return null;

  const handleDownload = () => {

    const url = URL.createObjectURL(
      resized.blob
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "resized-image.jpg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };

  return (

    <div className="flex justify-center">

      <Button
        variant="success"
        size="lg"
        onClick={handleDownload}
      >

        <Download size={18} />
        Download Image

      </Button>

    </div>

  );

}