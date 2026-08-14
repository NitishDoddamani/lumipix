import Card from "../../../components/ui/Card";

export default function ImageInfo({ workingImage, file }) {

  if (!workingImage || !file) return null;

  return (

    <Card>

      <h3 className="text-base font-semibold text-white mb-4">

        Image Information

      </h3>

      <div className="divide-y divide-zinc-800">

        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-zinc-500">Filename</span>
          <span className="text-white font-medium break-all text-right max-w-[60%]">{file.name}</span>
        </div>

        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-zinc-500">Current Size</span>
          <span className="text-white font-medium">{workingImage.width} × {workingImage.height} px</span>
        </div>

        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-zinc-500">Original File Size</span>
          <span className="text-white font-medium">{(file.size / 1024).toFixed(2)} KB</span>
        </div>

      </div>

    </Card>

  );

}