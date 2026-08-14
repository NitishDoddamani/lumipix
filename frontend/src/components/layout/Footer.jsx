import { Link } from "react-router-dom";
import { Image, FileText, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#121212] mt-24">

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">

        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">

                <Image className="text-white" />

              </div>

              <div>

                <h2 className="text-white text-2xl font-bold">
                  Lumipix
                </h2>

                <p className="text-zinc-500 text-sm">
                  Image Tools
                </p>

              </div>

            </div>

            <p className="text-zinc-400 leading-7 max-w-sm">
              Professional online image editing platform.
              Fast, secure and completely browser based.
            </p>

          </div>

          {/* Image */}

          <div>

            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">

              <Image size={18} />

              Image Tools

            </h3>

            <div className="flex flex-col gap-3">

              <Link className="text-zinc-400 hover:text-white" to="/resize-image">
                Resize Image
              </Link>

              <Link className="text-zinc-400 hover:text-white" to="/compress-image">
                Compress Image
              </Link>

              <Link className="text-zinc-400 hover:text-white" to="/crop-image">
                Crop Image
              </Link>

              <Link className="text-zinc-400 hover:text-white" to="/convert-image">
                Convert Image
              </Link>

            </div>

          </div>

          {/* PDF */}

          <div>

            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">

              <FileText size={18} />

              PDF Tools

            </h3>

            <div className="flex flex-col gap-3">

              <Link className="text-zinc-400 hover:text-white">
                Merge PDF
              </Link>

              <Link className="text-zinc-400 hover:text-white">
                Split PDF
              </Link>

              <Link className="text-zinc-400 hover:text-white">
                Image to PDF
              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">

              <Sparkles size={18} />

              Company

            </h3>

            <div className="flex flex-col gap-3">

              <Link className="text-zinc-400 hover:text-white">
                About
              </Link>

              <Link className="text-zinc-400 hover:text-white">
                Pricing
              </Link>

              <Link className="text-zinc-400 hover:text-white">
                Contact
              </Link>

              <Link className="text-zinc-400 hover:text-white">
                Privacy Policy
              </Link>

            </div>

          </div>

        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500">

          © 2026 Lumipix. All rights reserved.

        </div>

      </div>

    </footer>
  );
}