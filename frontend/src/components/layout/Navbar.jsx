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
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const imageTools = [
  { label: "Resize Image", description: "Change width and height in pixels.", to: "/resize-image", icon: Maximize2 },
  { label: "Crop Image", description: "Crop, rotate and flip precisely.", to: "/crop-image", icon: Crop },
  { label: "Compress Image", description: "Shrink file size, control quality.", to: "/compress-image", icon: FileArchive },
  { label: "Change File Size", description: "Hit an exact KB target, up or down.", to: "/change-file-size", icon: Scale },
  { label: "Change DPI", description: "Update print resolution metadata.", to: "/change-dpi", icon: Printer },
  { label: "Convert Image", description: "Switch between PNG, JPG and WEBP.", to: "/convert-image", icon: Repeat },
];

const pdfTools = [
  { label: "Image to PDF", description: "Combine one or more images into a PDF.", to: "/image-to-pdf", icon: FileText },
  { label: "Merge PDF", description: "Combine multiple PDFs into one file.", to: "/merge-pdf", icon: FileText },
  { label: "Remove Pages", description: "Delete specific pages from a PDF.", to: "/remove-pages", icon: FileText },
];

const aiTools = [
  { label: "Remove Background", description: "Automatically remove backgrounds using AI.", to: "/remove-background", icon: Eraser },
  { label: "AI Upscale", description: "Increase image resolution using AI.", to: "/ai-upscale", icon: ZoomIn },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [imageToolsOpen, setImageToolsOpen] = useState(false);
  const [pdfToolsOpen, setPdfToolsOpen] = useState(false);
  const [aiToolsOpen, setAiToolsOpen] = useState(false);

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileImageOpen, setMobileImageOpen] = useState(false);
  const [mobilePdfOpen, setMobilePdfOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileImageOpen(false);
    setMobilePdfOpen(false);
    setMobileAiOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#161616]/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-[72px] lg:h-[86px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-3 lg:gap-4 flex-shrink-0" onClick={closeMobile}>
          <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
            <Image size={22} className="text-white lg:hidden" />
            <Image size={26} className="text-white hidden lg:block" />
          </div>

          <div className="min-w-0">
            <h1 className="text-white text-[17px] lg:text-[20px] font-bold leading-none truncate">
              Lumipix
            </h1>
            <p className="text-zinc-500 text-xs lg:text-sm mt-1 hidden sm:block">
              Image Tools
            </p>
          </div>
        </Link>

        {/* CENTER — desktop only */}
        <nav className="hidden lg:flex items-center gap-12">
          <NavLink to="/" className="text-white font-semibold hover:text-blue-400 transition">
            Home
          </NavLink>

          {/* IMAGE TOOLS DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setImageToolsOpen(true)}
            onMouseLeave={() => setImageToolsOpen(false)}
          >
            <button type="button" className="flex items-center gap-2 text-zinc-300 hover:text-white transition">
              <Image size={18} />
              Image Tools
              <ChevronDown size={16} className={`transition-transform ${imageToolsOpen ? "rotate-180" : ""}`} />
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
                          <p className="text-white text-sm font-semibold">{tool.label}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{tool.description}</p>
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
            <button type="button" className="flex items-center gap-2 text-zinc-300 hover:text-white transition">
              <FileText size={18} />
              PDF Tools
              <ChevronDown size={16} className={`transition-transform ${pdfToolsOpen ? "rotate-180" : ""}`} />
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
                          <p className="text-white text-sm font-semibold">{tool.label}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{tool.description}</p>
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
            <button type="button" className="flex items-center gap-2 text-zinc-300 hover:text-white transition">
              <Sparkles size={18} />
              AI Tools
              <ChevronDown size={16} className={`transition-transform ${aiToolsOpen ? "rotate-180" : ""}`} />
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
                          <p className="text-white text-sm font-semibold">{tool.label}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{tool.description}</p>
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
        <div className="flex items-center gap-3 lg:gap-5">
          <button
            onClick={() => navigate("/resize-image")}
            className="hidden sm:inline-flex rounded-xl bg-white text-black font-semibold px-4 py-2.5 lg:px-7 lg:py-3 text-sm lg:text-base hover:bg-zinc-200 transition cursor-pointer"
          >
            Get started
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-700 text-white cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#161616] max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-1">

            <NavLink
              to="/"
              onClick={closeMobile}
              className="text-white font-semibold px-3 py-3 rounded-lg hover:bg-zinc-800/60 transition"
            >
              Home
            </NavLink>

            {/* Image Tools accordion */}
            <button
              type="button"
              onClick={() => setMobileImageOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-zinc-200 hover:bg-zinc-800/60 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <Image size={18} /> Image Tools
              </span>
              <ChevronDown size={16} className={`transition-transform ${mobileImageOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileImageOpen && (
              <div className="pl-3 flex flex-col gap-1 pb-1">
                {imageTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 transition"
                    >
                      <div className="bg-blue-600/15 rounded-lg p-1.5 shrink-0">
                        <Icon size={14} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-200">{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* PDF Tools accordion */}
            <button
              type="button"
              onClick={() => setMobilePdfOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-zinc-200 hover:bg-zinc-800/60 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <FileText size={18} /> PDF Tools
              </span>
              <ChevronDown size={16} className={`transition-transform ${mobilePdfOpen ? "rotate-180" : ""}`} />
            </button>
            {mobilePdfOpen && (
              <div className="pl-3 flex flex-col gap-1 pb-1">
                {pdfTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 transition"
                    >
                      <div className="bg-blue-600/15 rounded-lg p-1.5 shrink-0">
                        <Icon size={14} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-200">{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* AI Tools accordion */}
            <button
              type="button"
              onClick={() => setMobileAiOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-zinc-200 hover:bg-zinc-800/60 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <Sparkles size={18} /> AI Tools
              </span>
              <ChevronDown size={16} className={`transition-transform ${mobileAiOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileAiOpen && (
              <div className="pl-3 flex flex-col gap-1 pb-1">
                {aiTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 transition"
                    >
                      <div className="bg-violet-600/15 rounded-lg p-1.5 shrink-0">
                        <Icon size={14} className="text-violet-400" />
                      </div>
                      <span className="text-sm text-zinc-200">{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => {
                closeMobile();
                navigate("/resize-image");
              }}
              className="mt-3 w-full rounded-xl bg-white text-black font-semibold px-6 py-3 hover:bg-zinc-200 transition cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}