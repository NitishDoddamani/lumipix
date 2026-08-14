export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold">
      {children}
    </span>
  );
}