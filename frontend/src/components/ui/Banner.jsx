import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

const variants = {
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-400",
    icon: CheckCircle,
  },

  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-400",
    icon: AlertTriangle,
  },

  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    text: "text-red-400",
    icon: XCircle,
  },

  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    text: "text-blue-400",
    icon: Info,
  },
};

export default function Banner({
  type = "info",
  title,
  description,
}) {
  const variant = variants[type];

  const Icon = variant.icon;

  return (
    <div
      className={`
        ${variant.bg}
        ${variant.border}
        border
        rounded-xl
        p-4
      `}
    >
      <div className="flex gap-3">

        <Icon
          className={`${variant.text} shrink-0`}
          size={20}
        />

        <div>

          <h3
            className={`text-sm font-semibold ${variant.text}`}
          >
            {title}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 mt-1">
              {description}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}