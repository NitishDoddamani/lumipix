import { Check } from "lucide-react";

export default function CompressionPresetCard({
  title,
  description,
  value,
  selected,
  onSelect,
}) {
  const active = selected === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`
        relative
        text-left
        rounded-2xl
        border
        p-4
        transition-all
        duration-200
        h-full

        ${
          active
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-800 bg-[#232327] hover:border-zinc-700"
        }
      `}
    >
      {active && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}

      <h3 className="text-white font-semibold text-base pr-7">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-zinc-400">
        {description}
      </p>
    </button>
  );
}