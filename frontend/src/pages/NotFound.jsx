import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

import Container from "../components/common/Container";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {

  usePageTitle(
    "Page Not Found — Lumipix",
    "The page you're looking for doesn't exist. Browse Lumipix's free image and PDF tools instead."
  );

  return (

    <div className="min-h-[70vh] flex items-center justify-center bg-[#121212]">

      <Container className="text-center py-20">

        <p className="text-blue-500 font-semibold text-sm tracking-wide">

          404

        </p>

        <h1 className="text-4xl font-bold text-white mt-3">

          This page doesn't exist

        </h1>

        <p className="text-zinc-400 mt-4 max-w-md mx-auto">

          The link might be broken, or the page may have moved.
          Let's get you back to something useful.

        </p>

        <div className="flex items-center justify-center gap-4 mt-8">

          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-xl"
          >

            <Home size={18} />

            Go home

          </Link>

          <Link
            to="/resize-image"
            className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 transition text-zinc-300 font-semibold px-6 py-3 rounded-xl"
          >

            <Search size={18} />

            Browse tools

          </Link>

        </div>

      </Container>

    </div>

  );

}