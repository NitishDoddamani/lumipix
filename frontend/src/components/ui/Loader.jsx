export default function Loader({
  text = "Processing...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">

      <div
        className="
          h-12
          w-12
          border-4
          border-blue-200
          border-t-blue-600
          rounded-full
          animate-spin
        "
      />

      <p className="mt-5 text-gray-600">

        {text}

      </p>

    </div>
  );
}