export default function Input({
  label,
  suffix,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">

      {label && (
        <label className="block text-sm text-zinc-400 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          {...props}
          className={`
            w-full
            h-11
            px-4
            ${suffix ? "pr-12" : ""}
            rounded-xl
            bg-zinc-800
            border
            border-zinc-700
            text-white
            placeholder:text-zinc-500
            outline-none
            focus:border-blue-500
            ${className}
          `}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}