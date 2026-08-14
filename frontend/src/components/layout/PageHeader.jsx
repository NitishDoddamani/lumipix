export default function PageHeader({
  title,
  description,
}) {
  return (
    <div className="mb-8">

      <h1 className="text-2xl md:text-3xl font-bold text-white">

        {title}

      </h1>

      <p className="text-zinc-400 mt-2 text-sm">

        {description}

      </p>

    </div>
  );
}