export default function Checkbox({
  label,
  ...props
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
      <input
        type="checkbox"
        className="accent-blue-600 w-4 h-4"
        {...props}
      />

      {label}
    </label>
  );
}