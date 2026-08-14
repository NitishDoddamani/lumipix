import Card from "../../../components/ui/Card";
import Banner from "../../../components/ui/Banner";

export default function ImagePreview({
  original,
  resized,
}) {

  if (!original || !resized) return null;

  const physicalUnit = {
    Pixels: "px",
    Percentage: "%",
    Centimeters: "cm",
    Inches: "in",
  }[resized.unit];

  return (

    <div className="space-y-6">

      <Banner
        type="success"
        title="Image Resized Successfully"
        description="Compare the original image with the resized image before downloading."
      />

      <h2 className="text-xl font-bold text-white">

        Resize Preview

      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>

          <h3 className="text-base font-semibold text-white mb-4">

            Original Image

          </h3>

          <div className="space-y-2 text-sm text-zinc-400 mb-5">

            <div className="flex justify-between">

              <span>Pixel Size</span>

              <span className="text-white font-medium">

                {original.width} × {original.height} px

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

          <h3 className="text-base font-semibold text-white mb-4">

            Resized Image

          </h3>

          <div className="space-y-2 text-sm text-zinc-400 mb-5">

            <div className="flex justify-between">

              <span>Pixel Size</span>

              <span className="text-white font-medium">

                {resized.pixelWidth} × {resized.pixelHeight} px

              </span>

            </div>

            {resized.unit !== "Pixels" && (

              <div className="flex justify-between">

                <span>Physical Size</span>

                <span className="text-white font-medium">

                  {resized.width} × {resized.height} {physicalUnit}

                </span>

              </div>

            )}

            {(resized.unit === "Centimeters" ||
              resized.unit === "Inches") && (

              <div className="flex justify-between">

                <span>DPI</span>

                <span className="text-white font-medium">

                  {resized.dpi}

                </span>

              </div>

            )}

          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-2xl h-[340px] flex items-center justify-center p-4">

            <img
              src={resized.preview}
              alt="Resized"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

          </div>

        </Card>

      </div>

    </div>

  );

}