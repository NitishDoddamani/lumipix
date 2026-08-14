import { useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  GripVertical,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import { useDropzone } from "react-dropzone";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadBox({ images, setImages }) {

  const dragItemIndex = useRef(null);

  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length === 0) return;

    const loaders = acceptedFiles.map(

      (file) =>
        new Promise((resolve) => {

          const preview = URL.createObjectURL(file);
          const img = new Image();

          img.onload = () => {

            resolve({

              id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
              file,
              preview,
              width: img.width,
              height: img.height,

            });

          };

          img.src = preview;

        })

    );

    Promise.all(loaders).then((loaded) => {

      setImages([...images, ...loaded]);

    });

  }, [images, setImages]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({

    onDrop,

    multiple: true,

    accept: {

      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],

    },

  });

  const removeAt = (id) => {

    const target = images.find((img) => img.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);

    setImages(images.filter((img) => img.id !== id));

  };

  const moveAt = (index, direction) => {

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= images.length) return;

    const next = [...images];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    setImages(next);

  };

  const handleDragStart = (index) => {

    dragItemIndex.current = index;

  };

  const handleDragOver = (e, index) => {

    e.preventDefault();

    if (dragOverIndex !== index) setDragOverIndex(index);

  };

  const handleDrop = (index) => {

    const from = dragItemIndex.current;

    if (from === null || from === index) {

      setDragOverIndex(null);
      return;

    }

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);

    setImages(next);

    dragItemIndex.current = null;
    setDragOverIndex(null);

  };

  const handleDragEnd = () => {

    dragItemIndex.current = null;
    setDragOverIndex(null);

  };

  return (

    <div className="space-y-6">

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
            py-10
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

            <div className="bg-blue-600/15 rounded-full p-3">

              <Upload
                size={26}
                className="text-blue-400"
              />

            </div>

          </div>

          <h2 className="text-lg font-bold text-white mt-4">

            Drag & Drop Images

          </h2>

          <p className="text-zinc-500 mt-1 text-sm">

            or click to browse — you can select multiple

          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              PNG
            </span>

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              JPG
            </span>

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              WEBP
            </span>

          </div>

        </div>

      </Card>

      {images.length > 0 && (

        <Card>

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-base font-semibold text-white">

              {images.length} {images.length === 1 ? "Image" : "Images"}

            </h3>

            <span className="text-xs text-zinc-500">

              Drag to reorder — this is the page order

            </span>

          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">

            {images.map((img, index) => (

              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-2 bg-[#1f1f24] border rounded-xl p-2.5 transition
                  cursor-grab active:cursor-grabbing

                  ${
                    dragOverIndex === index
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-zinc-800"
                  }
                `}
              >

                <span className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 shrink-0">

                  <GripVertical size={16} />

                </span>

                <span className="w-5 text-center text-xs text-zinc-500 font-medium shrink-0">

                  {index + 1}

                </span>

                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="w-12 h-12 object-cover rounded-lg border border-zinc-700 shrink-0 pointer-events-none"
                />

                <div className="min-w-0 flex-1">

                  <p className="text-sm text-white truncate">

                    {img.file.name}

                  </p>

                  <p className="text-xs text-zinc-500">

                    {img.width}×{img.height} · {formatSize(img.file.size)}

                  </p>

                </div>

                <div className="flex items-center gap-1 shrink-0">

                  <button
                    type="button"
                    onClick={() => moveAt(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  >

                    <ChevronUp size={15} />

                  </button>

                  <button
                    type="button"
                    onClick={() => moveAt(index, 1)}
                    disabled={index === images.length - 1}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  >

                    <ChevronDown size={15} />

                  </button>

                  <button
                    type="button"
                    onClick={() => removeAt(img.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition"
                  >

                    <X size={15} />

                  </button>

                </div>

              </div>

            ))}

          </div>

        </Card>

      )}

      {images.length === 0 && (

        <Card>

          <div className="flex items-center gap-3 text-zinc-500 text-sm py-2">

            <ImageIcon size={16} />

            <span>No images added yet</span>

          </div>

        </Card>

      )}

    </div>

  );

}