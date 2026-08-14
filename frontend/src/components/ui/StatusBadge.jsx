export default function StatusBadge({
  children,
  color = "green",
}) {
  const colors = {
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
  };

  return (
    <p className={`font-medium ${colors[color]}`}>
      {children}
    </p>
  );
}