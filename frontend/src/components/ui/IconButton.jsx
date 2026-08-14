export default function IconButton({
  icon,
  ...props
}) {
  return (
    <button
      {...props}
      className="
        w-9
        h-9
        rounded-lg
        flex
        items-center
        justify-center
        text-zinc-400
        hover:bg-zinc-800
        hover:text-red-500
        transition
      "
    >
      {icon}
    </button>
  );
}