import { Info, AlertTriangle } from "lucide-react";

import PagePreview from "./PagePreview";

export default function MergeOptions({
  files,
  outputName,
  setOutputName,
  hasErrors,
  isLoadingMeta,
  loading,
  progress,
  onMerge,
}) {

  const totalPages = files.reduce(
    (sum, f) => sum + (f.pageCount || 0),
    0
  );

  return (

    <div className="space-y-6">

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8 h-fit">

      <h2 className="text-3xl font-bold text-white mb-8">

        Merge Settings

      </h2>

      <label className="text-zinc-300 font-medium text-sm">

        Output filename (optional)

      </label>

      <div className="mt-3 flex items-center bg-[#1f1f24] border border-zinc-700 rounded-xl overflow-hidden">

        <input
          type="text"
          value={outputName}
          onChange={(e) => setOutputName(e.target.value)}
          placeholder="merged"
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none"
        />

        <span className="px-4 text-sm text-zinc-500">

          .pdf

        </span>

      </div>

      {files.length > 0 && !hasErrors && (

        <div className="mt-6 flex items-center justify-between text-sm bg-[#1f1f24] border border-zinc-700 rounded-xl px-4 py-3">

          <span className="text-zinc-400">

            Combined result

          </span>

          <span className="text-white font-medium">

            {files.length} {files.length === 1 ? "file" : "files"} · {totalPages} {totalPages === 1 ? "page" : "pages"}

          </span>

        </div>

      )}

      {hasErrors && (

        <div className="mt-6 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">

          <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />

          <p className="text-xs text-red-300">

            One or more files couldn't be read and are marked above.
            Remove them before merging.

          </p>

        </div>

      )}

      <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs">

        <Info size={14} className="shrink-0 mt-0.5" />

        <span>

          Pages are combined in the order shown on the left, keeping
          each PDF's original page order intact.

        </span>

      </div>

      {loading && (

        <div className="mt-6">

          <div className="flex justify-between text-xs text-zinc-400 mb-2">

            <span>Merging...</span>

            <span>{progress}%</span>

          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">

            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

      )}

      <button
        onClick={onMerge}
        disabled={loading || files.length === 0 || hasErrors || isLoadingMeta}
        className="
          w-full
          mt-9
          py-4
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
          text-lg
          font-semibold
          text-white
        "
      >

        {loading
          ? "Merging..."
          : `Merge PDFs${files.length ? ` (${files.length})` : ""}`}

      </button>

    </div>

    {files.length > 0 && (

      <PagePreview files={files} />

    )}

    </div>

  );

}