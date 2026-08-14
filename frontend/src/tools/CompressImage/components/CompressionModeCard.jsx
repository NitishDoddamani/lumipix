import { Check } from "lucide-react";

export default function CompressionModeCard({
  title,
  description,
  value,
  selected,
  onSelect,
}) {
  const active = selected === value;

  return (
    <button
      onClick={() => onSelect(value)}
      className={`
        relative
        text-left
        rounded-2xl
        border
        p-5
        transition-all
        duration-200
        ${
          active
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-800 bg-[#232327] hover:border-zinc-700"
        }
      `}
    >
      {active && (
        <div
          className="
            absolute
            top-4
            right-4
            w-7
            h-7
            rounded-full
            bg-blue-600
            flex
            items-center
            justify-center
          "
        >
          <Check size={16} className="text-white" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-400 leading-6">
        {description}
      </p>
    </button>
  );
}