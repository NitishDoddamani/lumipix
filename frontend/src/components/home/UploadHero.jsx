import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function UploadHero() {

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length === 0) return;

    // Homepage upload defaults into Resize — the most general-purpose
    // entry point. The file rides along via router state so the user
    // doesn't have to re-upload once they land there.
    navigate("/resize-image", { state: { incomingFile: acceptedFiles[0] } });

  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({

    onDrop,

    multiple: false,

    noClick: true,

    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },

  });

  return (

    <div className="bg-[#181818] rounded-3xl border border-zinc-800 p-14 shadow-2xl">

      <div
        {...getRootProps()}
        className={`
          border-2
          border-dashed
          rounded-2xl
          py-20
          px-8
          text-center
          transition

          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/5"
              : "border-zinc-700 hover:border-blue-500"
          }
        `}
      >

        <input {...getInputProps()} />

        <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto">

          <Upload size={36} className="text-blue-500" />

        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">

          Drag & Drop

        </h2>

        <p className="mt-4 text-zinc-400">

          PNG • JPG • JPEG • WEBP

        </p>

        <button
          type="button"
          onClick={open}
          className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold transition"
        >

          Choose Image

        </button>

      </div>

    </div>

  );

}