export default function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <>
      <h2 className="text-3xl font-bold text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="text-zinc-400 mt-2">
          {subtitle}
        </p>
      )}
    </>
  );
}