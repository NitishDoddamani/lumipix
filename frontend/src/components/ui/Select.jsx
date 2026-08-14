export default function Select({
  label,
  options = [],
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

      <select
        {...props}
        className={`
          w-full
          h-11
          px-4
          rounded-xl
          bg-zinc-800
          border
          border-zinc-700
          text-white
          outline-none
          focus:border-blue-500
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

    </div>
  );
}