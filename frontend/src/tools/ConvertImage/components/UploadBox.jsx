import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon, X } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

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

      const sourceFormat =
        file.type === "image/jpg"
          ? "jpeg"
          : file.type.replace("image/", "");

      const defaultFormat =
        sourceFormat === "png" ? "jpeg" : "png";

      setImage({

        file,
        preview,

        width: img.width,
        height: img.height,

        sourceFormat,

      });

      setSettings({

        format: defaultFormat,
        quality: 90,

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

    if (image?.preview) {

      URL.revokeObjectURL(image.preview);

    }

    setImage(null);

    setSettings({

      format: "png",
      quality: 90,

    });

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

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              PNG
            </span>

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              JPG
            </span>

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              JPEG
            </span>

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
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

      <div className="bg-[#111] border border-zinc-800 rounded-2xl p-4">

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