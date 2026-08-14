import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  Sparkles,
  UploadCloud,
} from "lucide-react";

const ACCEPTED_TYPES = {
  "image/png": [],
  "image/jpeg": [],
  "image/jpg": [],
  "image/webp": [],
};

export default function Hero() {
  const navigate = useNavigate();

  // Ref lets the "Get started" button trigger the same
  // hidden file input used by the drag-and-drop box.
  const openFileDialogRef = useRef(null);

  const goToResizeWithFile = useCallback(
    (file) => {
      // ResizeImage.jsx already reads location.state.incomingFile
      // on mount and preloads it — so this is all we need.
      navigate("/resize-image", { state: { incomingFile: file } });
    },
    [navigate]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      goToResizeWithFile(acceptedFiles[0]);
    },
    [goToResizeWithFile]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: false,
    accept: ACCEPTED_TYPES,
  });

  // Expose dropzone's file-picker opener to the "Get started" button.
  openFileDialogRef.current = open;

  const handleGetStarted = () => {
    openFileDialogRef.current?.();
  };

  const handleBrowseTools = () => {
    const el = document.getElementById("popular-tools");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="border-b border-zinc-800 bg-[#171717]">

      <div className="max-w-[1440px] mx-auto px-8 py-16 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 text-blue-400 px-4 py-1.5 text-xs font-semibold">

              <Sparkles size={13} />

              100 percent free, no signup, no watermark

            </div>

            {/* Heading */}

            <h1 className="mt-6 text-white font-extrabold leading-[1.05] tracking-tight text-4xl lg:text-6xl">

              Edit Images
              <br />
              in Seconds

            </h1>

            {/* Description */}

            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">

              Resize, compress, crop, convert and enhance your
              images instantly. Everything runs securely inside
              your browser.

            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={handleGetStarted}
                className="rounded-xl bg-white text-black font-semibold px-6 py-3 text-base hover:bg-zinc-200 transition cursor-pointer"
              >

                Get started

              </button>

              <button
                onClick={handleBrowseTools}
                className="rounded-xl border border-zinc-700 text-white font-medium px-6 py-3 text-base hover:border-zinc-500 transition flex items-center gap-2 cursor-pointer"
              >

                Browse tools

                <ArrowRight size={16} />

              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div
              {...getRootProps()}
              className={`
                group h-[300px] rounded-2xl border border-dashed
                bg-[#1B1B1B] transition-all duration-300
                flex items-center justify-center cursor-pointer
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-zinc-700 hover:border-blue-500"
                }
              `}
            >

              <input {...getInputProps()} />

              <div className="text-center">

                {/* Upload icon */}

                <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-blue-600/15 flex items-center justify-center">

                  <UploadCloud
                    size={30}
                    className="text-blue-400"
                  />

                </div>

                <h3 className="text-2xl font-bold text-white">

                  {isDragActive ? "Drop your image" : "Drag & Drop Image"}

                </h3>

                <p className="mt-2 text-zinc-500 text-sm">

                  PNG, JPG, JPEG, WEBP

                </p>

                {/* Bubbles up to the root's own click handler, which opens the file dialog */}
                <button
                  type="button"
                  className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-500 transition px-7 py-2.5 text-sm font-semibold text-white cursor-pointer"
                >

                  Choose Image

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}