import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon, X } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const DEFAULT_SETTINGS = {
  width: "",
  height: "",
  unit: "Pixels",
  dpi: 300,
  keepAspect: true,
};

export default function UploadBox({
  image,
  setImage,
  setSettings,
}) {

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    const preview = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {

      setImage({

        file,
        preview,
        width: img.width,
        height: img.height,

      });

      // Every new upload starts from a clean, predictable state —
      // pixel dimensions under the "Pixels" unit — instead of
      // inheriting whatever unit/width/height were left over from
      // a previous image.
      setSettings({

        ...DEFAULT_SETTINGS,

        width: img.width,
        height: img.height,

      });

    };

    img.src = preview;

  }, [setImage, setSettings]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({

    onDrop,

    multiple: false,

    accept: {

      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],

    },

  });

  const removeImage = () => {

    setImage(null);

    // Clear stale settings so a removed image doesn't leave behind
    // values (unit, width, height, dpi) that no longer mean anything.
    setSettings({ ...DEFAULT_SETTINGS });

  };

  if (!image) {

    return (

      <Card>

        <div
          {...getRootProps()}
          className={`
            border-2
            border-dashed
            rounded-2xl
            transition-all
            duration-300
            cursor-pointer
            text-center
            py-14
            px-6

            ${
              isDragActive
                ? "border-blue-500 bg-blue-500/5"
                : "border-zinc-700 hover:border-blue-500 hover:bg-zinc-800/40"
            }
          `}
        >

          <input {...getInputProps()} />

          <div className="flex justify-center">

            <div className="bg-blue-600/15 rounded-full p-4">

              <Upload
                size={32}
                className="text-blue-400"
              />

            </div>

          </div>

          <h2 className="text-xl font-bold text-white mt-5">

            Drag & Drop Your Image

          </h2>

          <p className="text-zinc-500 mt-2 text-sm">

            or click anywhere to browse

          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">

            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
              PNG
            </span>

            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
              JPG
            </span>

            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
              JPEG
            </span>

            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
              WEBP
            </span>

          </div>

        </div>

      </Card>

    );

  }

  return (

    <Card>

      <div className="flex justify-between items-center mb-5">

        <div className="flex items-center gap-3 min-w-0">

          <div className="bg-blue-600/15 rounded-full p-2.5 shrink-0">

            <ImageIcon
              className="text-blue-400"
              size={18}
            />

          </div>

          <div className="min-w-0">

            <h3 className="font-semibold text-white text-sm">

              Uploaded Image

            </h3>

            <p className="text-xs text-zinc-500 truncate">

              {image.file.name}

            </p>

          </div>

        </div>

        <Button
          variant="danger"
          size="icon"
          onClick={removeImage}
        >

          <X size={16} />

        </Button>

      </div>

      <div className="bg-[#111] rounded-2xl border border-zinc-800 p-4">

        <img
          src={image.preview}
          alt="Preview"
          className="
            w-full
            max-h-[380px]
            object-contain
            rounded-xl
          "
        />

      </div>

    </Card>

  );

}