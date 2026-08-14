import { Link } from "react-router-dom";
import Button from "./Button";

export default function ToolCard({
  emoji,
  title,
  description,
  link = "#",
}) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 hover:shadow-xl transition-all duration-300">

      <div className="text-5xl">
        {emoji}
      </div>

      <h3 className="text-2xl font-bold mt-6">
        {title}
      </h3>

      <p className="text-slate-500 mt-4 leading-7">
        {description}
      </p>

      <div className="mt-8">
        <Link to={link}>
          <Button>
            Use Tool →
          </Button>
        </Link>
      </div>

    </div>
  );
}