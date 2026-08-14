import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon } from "lucide-react";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function UploadBox({ file, onFileSelected }) {

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length === 0) return;

    onFileSelected(acceptedFiles[0]);

  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({

    onDrop,

    multiple: false,

    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },

  });

  if (!file) {

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

              <Upload size={32} className="text-blue-400" />

            </div>

          </div>

          <h2 className="text-xl font-bold text-white mt-5">

            Drag & Drop Your Image

          </h2>

          <p className="text-zinc-500 mt-2 text-sm">

            or click anywhere to browse

          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">PNG</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">JPG</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">WEBP</span>

          </div>

        </div>

      </Card>

    );

  }

  return (

    <Card>

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3 min-w-0">

          <div className="bg-blue-600/15 rounded-full p-2.5 shrink-0">

            <ImageIcon className="text-blue-400" size={18} />

          </div>

          <div className="min-w-0">

            <h3 className="font-semibold text-white text-sm truncate">

              {file.name}

            </h3>

          </div>

        </div>

        <Button
          variant="danger"
          size="icon"
          onClick={() => onFileSelected(null)}
        >

          <X size={16} />

        </Button>

      </div>

    </Card>

  );

}