import { X } from "lucide-react";

import Card from "../../../components/ui/Card";

export default function PageGrid({
  thumbnails,
  totalPages,
  selectedPages,
  onToggle,
}) {

  return (

    <Card>

      <div className="flex items-center justify-between mb-4">

        <h3 className="text-sm font-semibold text-white">

          Click pages to remove

        </h3>

        <span className="text-xs text-zinc-500">

          Shift-click for a range

        </span>

      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">

        {Array.from({ length: totalPages }).map((_, i) => {

          const pageNum = i + 1;
          const thumb = thumbnails[i];
          const isSelected = selectedPages.has(pageNum);

          return (

            <button
              key={pageNum}
              type="button"
              onClick={(e) => onToggle(pageNum, e.shiftKey)}
              className={`
                relative
                rounded-xl
                border-2
                overflow-hidden
                transition
                text-left

                ${
                  isSelected
                    ? "border-red-500"
                    : "border-zinc-800 hover:border-zinc-600"
                }
              `}
            >

              <div className="bg-white aspect-[3/4] flex items-center justify-center">

                {thumb ? (

                  <img
                    src={thumb}
                    alt={`Page ${pageNum}`}
                    className="w-full h-full object-contain"
                  />

                ) : (

                  <div className="w-full h-full bg-zinc-200 animate-pulse" />

                )}

              </div>

              {isSelected && (

                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">

                  <X
                    size={36}
                    className="text-red-500"
                    strokeWidth={3}
                  />

                </div>

              )}

              <div
                className={`
                  text-center py-1.5 text-xs

                  ${
                    isSelected
                      ? "bg-red-500/20 text-red-300"
                      : "bg-[#1f1f24] text-zinc-400"
                  }
                `}
              >

                Page {pageNum}

              </div>

            </button>

          );

        })}

      </div>

    </Card>

  );

}