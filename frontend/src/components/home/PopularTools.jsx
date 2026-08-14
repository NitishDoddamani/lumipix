import {
  ScanSearch,
  Crop,
  FileImage,
  Eraser,
  FileText,
  Sparkles,
  Minimize2,
  Image,
  Wand2,
} from "lucide-react";

import ToolCard from "./ToolCard";

export default function PopularTools() {
  return (
    <section id="popular-tools" className="py-20">

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        <div className="text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Popular Image Tools
          </h2>

          <p className="mt-3 text-zinc-400 text-base">
            Everything you need to edit images online.
          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-12">

          <ToolCard
            icon={Minimize2}
            title="Resize Image"
            description="Resize images using pixels, percentages, centimeters and inches."
            link="/resize-image"
            color="blue"
          />

          <ToolCard
            icon={ScanSearch}
            title="Compress Image"
            description="Reduce image size while preserving visual quality."
            color="blue"
            link="/compress-image"
          />

          <ToolCard
            icon={Crop}
            title="Crop Image"
            description="Crop images precisely with fixed or custom ratios."
            color="blue"
            link="/crop-image" 
          />

          <ToolCard
            icon={FileImage}
            title="Convert Image"
            description="Convert PNG, JPG, WEBP and other popular formats."
            color="blue"
            link="/convert-image"
          />

          <ToolCard
            icon={Eraser}
            title="Remove Background"
            description="Automatically remove backgrounds using AI."
            color="purple"
            link="/remove-background"
          />

          <ToolCard
            icon={Sparkles}
            title="AI Upscale"
            description="Increase image resolution without losing quality."
            color="purple"
            link="/ai-upscale" 
          />

          <ToolCard
            icon={FileText}
            title="Image to PDF"
            description="Convert one or multiple images into PDF."
            color="yellow"
            link="/image-to-pdf"
          />

        </div>

      </div>

    </section>
  );
}