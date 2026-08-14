import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}) {

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
    outline: "border border-zinc-700 text-white hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    white: "bg-white text-black hover:bg-zinc-200",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm rounded-lg",
    md: "h-11 px-5 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-xl",
    icon: "h-9 w-9 rounded-lg p-0",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        transition-all
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}