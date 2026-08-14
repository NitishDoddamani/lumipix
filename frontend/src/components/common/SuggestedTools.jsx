import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getRelatedTools } from "../../constants/toolRelations";

export default function SuggestedTools({ currentTool }) {

  const related = getRelatedTools(currentTool);

  if (related.length === 0) return null;

  return (

    <div className="mt-10">

      <h3 className="text-sm font-semibold text-zinc-400 mb-4">

        What's next?

      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {related.map((tool) => (

          <Link
            key={tool.slug}
            to={`/${tool.slug}`}
            className="group flex items-center justify-between gap-3 bg-[#18181C] border border-zinc-800 hover:border-blue-500/50 rounded-xl px-4 py-3 transition"
          >

            <div>

              <p className="text-sm font-semibold text-white">

                {tool.label}

              </p>

              <p className="text-xs text-zinc-500 mt-0.5">

                {tool.desc}

              </p>

            </div>

            <ArrowRight
              size={16}
              className="text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition shrink-0"
            />

          </Link>

        ))}

      </div>

    </div>

  );

}