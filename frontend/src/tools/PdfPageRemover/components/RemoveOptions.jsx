import { Info } from "lucide-react";

export default function RemoveOptions({
  pageCount,
  pagesText,
  selectedCount,
  onTextChange,
  loading,
  progress,
  onRemove,
  disabled,
}) {

  return (

    <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-8 h-fit">

      <h2 className="text-3xl font-bold text-white mb-2">

        Remove Pages

      </h2>

      <p className="text-zinc-500 text-sm mb-8">

        Click pages to remove from document. You can use "shift" key
        to set ranges.

      </p>

      <div className="flex items-center justify-between text-sm bg-[#1f1f24] border border-zinc-700 rounded-xl px-4 py-3">

        <span className="text-zinc-400">

          Total pages

        </span>

        <span className="text-white font-semibold">

          {pageCount || "--"}

        </span>

      </div>

      <label className="block mt-6 text-zinc-300 font-medium text-sm">

        Pages to remove

      </label>

      <input
        type="text"
        value={pagesText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="e.g. 1,2,6-9,11"
        disabled={disabled}
        className="
          w-full
          mt-3
          bg-[#1f1f24]
          border
          border-zinc-700
          rounded-xl
          px-4
          py-3
          text-sm
          text-white
          placeholder:text-zinc-600
          outline-none
          focus:border-blue-500
          disabled:opacity-50
        "
      />

      <div className="mt-4 flex items-start gap-2 text-zinc-500 text-xs">

        <Info size={14} className="shrink-0 mt-0.5" />

        <span>

          Single pages and ranges, comma-separated — e.g. "1,2,6-9,11".
          Clicking a page above updates this field, and typing here
          updates the selection above.

        </span>

      </div>

      {selectedCount > 0 && (

        <p className="mt-4 text-sm text-red-400 font-medium">

          {selectedCount} {selectedCount === 1 ? "page" : "pages"} selected for removal

        </p>

      )}

      {loading && (

        <div className="mt-6">

          <div className="flex justify-between text-xs text-zinc-400 mb-2">

            <span>Removing pages...</span>

            <span>{progress}%</span>

          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">

            <div
              className="h-full bg-red-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

      )}

      <button
        onClick={onRemove}
        disabled={loading || disabled || selectedCount === 0}
        className="
          w-full
          mt-9
          py-4
          rounded-xl
          bg-red-600
          hover:bg-red-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
          text-lg
          font-semibold
          text-white
        "
      >

        {loading
          ? "Removing..."
          : `Remove Pages${selectedCount ? ` (${selectedCount})` : ""}`}

      </button>

    </div>

  );

}