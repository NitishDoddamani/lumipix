export default function Button({
  children,
  variant = "primary",
  onClick,
}) {

  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-white border border-gray-300 hover:bg-gray-100 text-slate-800",
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-7
        py-3.5
        rounded-xl
        font-semibold
        transition-all
        duration-300
        shadow-md
        hover:scale-105
        ${styles[variant]}
        `}
    >
      {children}
    </button>
  );
}