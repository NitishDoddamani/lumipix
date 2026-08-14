import Card from "../../../components/ui/Card";

export default function ImageInfo({ image }) {

  if (!image) return null;

  return (

    <Card>

      <h3 className="text-base font-semibold text-white mb-4">

        Image Information

      </h3>

      <div className="divide-y divide-zinc-800">

        <div className="flex justify-between py-2.5 text-sm">

          <span className="text-zinc-500">
            Filename
          </span>

          <span className="text-white font-medium break-all text-right max-w-[60%]">
            {image.file.name}
          </span>

        </div>

        <div className="flex justify-between py-2.5 text-sm">

          <span className="text-zinc-500">
            Width
          </span>

          <span className="text-white font-medium">
            {image.width} px
          </span>

        </div>

        <div className="flex justify-between py-2.5 text-sm">

          <span className="text-zinc-500">
            Height
          </span>

          <span className="text-white font-medium">
            {image.height} px
          </span>

        </div>

        <div className="flex justify-between py-2.5 text-sm">

          <span className="text-zinc-500">
            File Size
          </span>

          <span className="text-white font-medium">
            {(image.file.size / 1024).toFixed(2)} KB
          </span>

        </div>

        <div className="flex justify-between py-2.5 text-sm">

          <span className="text-zinc-500">
            Format
          </span>

          <span className="text-white font-medium">

            {image.file.type
              .replace("image/", "")
              .toUpperCase()}

          </span>

        </div>

      </div>

    </Card>

  );

}