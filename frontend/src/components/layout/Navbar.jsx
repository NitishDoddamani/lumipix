import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Image,
  FileText,
  Sparkles,
  Maximize2,
  FileArchive,
  Scale,
  Printer,
  Repeat,
  Eraser,
  ZoomIn,
   Crop,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const imageTools = [
  {
    label: "Resize Image",
    description: "Change width and height in pixels.",
    to: "/resize-image",
    icon: Maximize2,
  },
  {
    label: "Crop Image",
    description: "Crop, rotate and flip precisely.",
    to: "/crop-image",
    icon: Crop,
  },
  {
    label: "Compress Image",
    description: "Shrink file size, control quality.",
    to: "/compress-image",
    icon: FileArchive,
  },
  {
    label: "Change File Size",
    description: "Hit an exact KB target, up or down.",
    to: "/change-file-size",
    icon: Scale,
  },
  {
    label: "Change DPI",
    description: "Update print resolution metadata.",
    to: "/change-dpi",
    icon: Printer,
  },

  {
    label: "Convert Image",
    description: "Switch between PNG, JPG and WEBP.",
    to: "/convert-image",
    icon: Repeat,
  },

];

const pdfTools = [
  {
    label: "Image to PDF",
    description: "Combine one or more images into a PDF.",
    to: "/image-to-pdf",
    icon: FileText,
  },

  {
    label: "Merge PDF",
    description: "Combine multiple PDFs into one file.",
    to: "/merge-pdf",
    icon: FileText,
  },

  {
    label: "Remove Pages",
    description: "Delete specific pages from a PDF.",
    to: "/remove-pages",
    icon: FileText,
  },
];

const aiTools = [
  {
    label: "Remove Background",
    description: "Automatically remove backgrounds using AI.",
    to: "/remove-background",
    icon: Eraser,
  },

    {
    label: "AI Upscale",
    description: "Increase image resolution using AI.",
    to: "/ai-upscale",
    icon: ZoomIn,
  },
  
];

export default function Navbar() {

  const navigate = useNavigate();

  const [imageToolsOpen, setImageToolsOpen] = useState(false);

  const [pdfToolsOpen, setPdfToolsOpen] = useState(false);

  const [aiToolsOpen, setAiToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#161616]/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-[86px] px-8 flex items-center justify-between">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-4 flex-shrink-0">

          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Image size={26} className="text-white" />
          </div>

          <div>
            <h1 className="text-white text-[20px] font-bold leading-none">
              Lumipix
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              Image Tools
            </p>
          </div>
        </Link>

        {/* CENTER */}
        <nav className="hidden lg:flex items-center gap-12">

          <NavLink
            to="/"
            className="text-white font-semibold hover:text-blue-400 transition"
          >
            Home
          </NavLink>

          {/* IMAGE TOOLS DROPDOWN */}

          <div
            className="relative"
            onMouseEnter={() => setImageToolsOpen(true)}
            onMouseLeave={() => setImageToolsOpen(false)}
          >

            <button
              type="button"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
            >

              <Image size={18} />

              Image Tools

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  imageToolsOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {imageToolsOpen && (

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50">

                <div className="bg-[#1B1B1F] border border-zinc-800 rounded-2xl shadow-xl p-2">

                  {imageTools.map((tool) => {

                    const Icon = tool.icon;

                    return (

                      <Link
                        key={tool.to}
                        to={tool.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-zinc-800/70 transition"
                      >

                        <div className="bg-blue-600/15 rounded-lg p-2 shrink-0">

                          <Icon size={16} className="text-blue-400" />

                        </div>

                        <div>

                          <p className="text-white text-sm font-semibold">

                            {tool.label}

                          </p>

                          <p className="text-zinc-500 text-xs mt-0.5">

                            {tool.description}

                          </p>

                        </div>

                      </Link>

                    );

                  })}

                </div>

              </div>

            )}

          </div>

          {/* PDF TOOLS DROPDOWN */}

          <div
            className="relative"
            onMouseEnter={() => setPdfToolsOpen(true)}
            onMouseLeave={() => setPdfToolsOpen(false)}
          >

            <button
              type="button"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
            >

              <FileText size={18} />

              PDF Tools

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  pdfToolsOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {pdfToolsOpen && (

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50">

                <div className="bg-[#1B1B1F] border border-zinc-800 rounded-2xl shadow-xl p-2">

                  {pdfTools.map((tool) => {

                    const Icon = tool.icon;

                    return (

                      <Link
                        key={tool.to}
                        to={tool.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-zinc-800/70 transition"
                      >

                        <div className="bg-blue-600/15 rounded-lg p-2 shrink-0">

                          <Icon size={16} className="text-blue-400" />

                        </div>

                        <div>

                          <p className="text-white text-sm font-semibold">

                            {tool.label}

                          </p>

                          <p className="text-zinc-500 text-xs mt-0.5">

                            {tool.description}

                          </p>

                        </div>

                      </Link>

                    );

                  })}

                </div>

              </div>

            )}

          </div>

          {/* AI TOOLS DROPDOWN */}

          <div
            className="relative"
            onMouseEnter={() => setAiToolsOpen(true)}
            onMouseLeave={() => setAiToolsOpen(false)}
          >

            <button
              type="button"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
            >

              <Sparkles size={18} />

              AI Tools

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  aiToolsOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {aiToolsOpen && (

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50">

                <div className="bg-[#1B1B1F] border border-zinc-800 rounded-2xl shadow-xl p-2">

                  {aiTools.map((tool) => {

                    const Icon = tool.icon;

                    return (

                      <Link
                        key={tool.to}
                        to={tool.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-zinc-800/70 transition"
                      >

                        <div className="bg-violet-600/15 rounded-lg p-2 shrink-0">

                          <Icon size={16} className="text-violet-400" />

                        </div>

                        <div>

                          <p className="text-white text-sm font-semibold">

                            {tool.label}

                          </p>

                          <p className="text-zinc-500 text-xs mt-0.5">

                            {tool.description}

                          </p>

                        </div>

                      </Link>

                    );

                  })}

                </div>

              </div>

            )}

          </div>


        </nav>

        {/* RIGHT */}

        <div className="flex items-center gap-5">


          <button
            onClick={() => navigate("/resize-image")}
            className="rounded-xl bg-white text-black font-semibold px-7 py-3 hover:bg-zinc-200 transition"
          >
            Get started
          </button>

        </div>

      </div>
    </header>
  );
}