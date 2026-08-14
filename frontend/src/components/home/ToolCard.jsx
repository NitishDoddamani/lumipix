import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ToolCard({
  icon: Icon,
  title,
  description,
  link = "#",
  color = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    orange: "bg-orange-500/10 text-orange-400",
    purple: "bg-violet-500/10 text-violet-400",
    red: "bg-red-500/10 text-red-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    pink: "bg-pink-500/10 text-pink-400",
    yellow: "bg-amber-500/10 text-amber-400",
  };

  return (
    <Link
      to={link}
      className="
        group
        flex
        flex-col
        h-full
        rounded-2xl
        border
        border-zinc-800
        bg-[#1B1B1B]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/50
        hover:shadow-[0_10px_35px_rgba(37,99,235,0.12)]
      "
    >

      <div
        className={`
          w-11
          h-11
          rounded-xl
          flex
          items-center
          justify-center
          ${colorClasses[color]}
        `}
      >
        <Icon size={20} strokeWidth={2} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white leading-snug">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-400 leading-6">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1.5 text-sm text-blue-400 font-medium transition-all group-hover:gap-2.5">
        <span>Use Tool</span>

        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>

    </Link>
  );
}