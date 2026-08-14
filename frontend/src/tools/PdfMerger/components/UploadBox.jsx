import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
  GripVertical,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import { readPdfMeta, renderPdfPageThumbnails } from "../../../services/pdfMerge";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadBox({ files, setFiles }) {

  const dragItemIndex = useRef(null);

  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length === 0) return;

    const newItems = acceptedFiles.map((file) => ({

      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      pageCount: null,
      error: null,
      loading: true,
      pages: [],
      pagesLoading: true,
      hiddenPageCount: 0,

    }));

    setFiles([...files, ...newItems]);

    newItems.forEach((item) => {

      readPdfMeta(item.file)
        .then(({ pageCount }) => {

          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, pageCount, loading: false } : f
            )
          );

          renderPdfPageThumbnails(item.file)
            .then(({ pages, hiddenCount }) => {

              setFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id
                    ? { ...f, pages, hiddenPageCount: hiddenCount, pagesLoading: false }
                    : f
                )
              );

            })
            .catch((err) => {

              // Metadata already succeeded, so the file is still usable for
              // merging — it just won't have a visual preview. Log it (and
              // flag it in state) instead of failing silently, since a
              // silent failure here used to look identical to "no pages".
              console.error(
                "[PdfMerger] Preview rendering failed for",
                item.file.name,
                err
              );

              setFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id
                    ? { ...f, pagesLoading: false, pagesFailed: true }
                    : f
                )
              );

            });

        })
        .catch((err) => {

          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    error: err.message || "Couldn't read this file.",
                    loading: false,
                    pagesLoading: false,
                  }
                : f
            )
          );

        });

    });

  }, [files, setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({

    onDrop,

    multiple: true,

    accept: {
      "application/pdf": [".pdf"],
    },

  });

  const removeAt = (id) => {

    setFiles(files.filter((f) => f.id !== id));

  };

  const moveAt = (index, direction) => {

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= files.length) return;

    const next = [...files];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    setFiles(next);

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

    const next = [...files];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);

    setFiles(next);

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

            Drag & Drop PDFs

          </h2>

          <p className="text-zinc-500 mt-1 text-sm">

            or click to browse — you can select multiple

          </p>

          <div className="mt-4 flex justify-center">

            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              PDF
            </span>

          </div>

        </div>

      </Card>

      {files.length > 0 && (

        <Card>

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-base font-semibold text-white">

              {files.length} {files.length === 1 ? "File" : "Files"}

            </h3>

            <span className="text-xs text-zinc-500">

              Drag to reorder — this is the merge order

            </span>

          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">

            {files.map((item, index) => (

              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-2 border rounded-xl p-2.5 transition
                  cursor-grab active:cursor-grabbing

                  ${
                    item.error
                      ? "border-red-500/40 bg-red-500/5"
                      : dragOverIndex === index
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-zinc-800 bg-[#1f1f24]"
                  }
                `}
              >

                <span className="text-zinc-600 hover:text-zinc-400 shrink-0">

                  <GripVertical size={16} />

                </span>

                <span className="w-5 text-center text-xs text-zinc-500 font-medium shrink-0">

                  {index + 1}

                </span>

                <div className="bg-red-500/15 rounded-lg p-2 shrink-0">

                  <FileText size={18} className="text-red-400" />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm text-white truncate">

                    {item.file.name}

                  </p>

                  {item.error ? (

                    <p className="text-xs text-red-400 flex items-center gap-1">

                      <AlertTriangle size={11} />

                      {item.error}

                    </p>

                  ) : item.loading ? (

                    <p className="text-xs text-zinc-500 flex items-center gap-1">

                      <Loader2 size={11} className="animate-spin" />

                      Reading...

                    </p>

                  ) : (

                    <p className="text-xs text-zinc-500">

                      {item.pageCount} {item.pageCount === 1 ? "page" : "pages"} · {formatSize(item.file.size)}

                    </p>

                  )}

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
                    disabled={index === files.length - 1}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  >

                    <ChevronDown size={15} />

                  </button>

                  <button
                    type="button"
                    onClick={() => removeAt(item.id)}
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

      {files.length === 0 && (

        <Card>

          <div className="flex items-center gap-3 text-zinc-500 text-sm py-2">

            <FileText size={16} />

            <span>No PDFs added yet</span>

          </div>

        </Card>

      )}

    </div>

  );

}