import { Loader2, ImageOff } from "lucide-react";

import Card from "../../../components/ui/Card";

function FileGroup({ file, index }) {

  const hasPages = file.pages && file.pages.length > 0;

  return (

    <div>

      <div className="flex items-center gap-2 mb-2">

        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-semibold shrink-0">

          {index + 1}

        </span>

        <span className="text-xs text-zinc-400 truncate">

          {file.file.name}

        </span>

      </div>

      {file.pagesLoading ? (

        <div className="flex items-center gap-2 text-xs text-zinc-500 py-3 pl-7">

          <Loader2 size={13} className="animate-spin" />
          Rendering preview...

        </div>

      ) : file.pagesFailed || !hasPages ? (

        <div className="flex items-center gap-2 text-xs text-amber-400/90 py-3 pl-7">

          <ImageOff size={13} />
          Couldn't generate a page preview for this file

        </div>

      ) : (

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pl-1">

          {file.pages.map((page, pageIndex) => (

            <div
              key={pageIndex}
              className="bg-white rounded-md overflow-hidden border border-zinc-800 shadow-sm"
            >

              <img
                src={page.dataUrl}
                alt={`${file.file.name} — page ${pageIndex + 1}`}
                className="w-full h-auto block"
              />

            </div>

          ))}

          {file.hiddenPageCount > 0 && (

            <div className="flex items-center justify-center bg-[#1f1f24] border border-zinc-800 rounded-md text-[11px] text-zinc-500 aspect-[3/4] text-center px-1">

              +{file.hiddenPageCount} more

            </div>

          )}

        </div>

      )}

    </div>

  );

}

export default function PagePreview({ files }) {

  if (!files || files.length === 0) return null;

  const validFiles = files.filter((f) => !f.error);

  if (validFiles.length === 0) return null;

  const totalKnownPages = validFiles.reduce(
    (sum, f) => sum + (f.pageCount || 0),
    0
  );

  return (

    <Card>

      <h3 className="text-sm font-semibold text-white mb-1">

        Preview — {validFiles.length} {validFiles.length === 1 ? "file" : "files"}
        {totalKnownPages > 0 &&
          ` · ${totalKnownPages} ${totalKnownPages === 1 ? "page" : "pages"}`}

      </h3>

      <p className="text-xs text-zinc-500 mb-4">

        Updates instantly as you reorder files — this is the exact page
        order the merged PDF will have

      </p>

      <div className="max-h-[420px] overflow-y-auto pr-1 space-y-5">

        {validFiles.map((file, index) => (

          <FileGroup key={file.id} file={file} index={index} />

        ))}

      </div>

    </Card>

  );

}