import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ResizeImage from "../tools/ResizeImage/ResizeImage";
import CompressImage from "../tools/CompressImage/CompressImage";
import ChangeFileSize from "../tools/ChangeFileSize/ChangeFileSize";
import ChangeDpi from "../tools/ChangeDpi/ChangeDpi";
import ConvertImage from "../tools/ConvertImage/ConvertImage";
import RemoveBackground from "../tools/RemoveBackground/RemoveBackground";
import AIUpscale from "../tools/AIUpscale/AIUpscale"; 
import ImageToPdf from "../tools/ImageToPdf/ImageToPdf"; 
import PdfMerger from "../tools/PdfMerger/PdfMerger";  
import PdfPageRemover from "../tools/PdfPageRemover/PdfPageRemover"; 
import CropImage from "../tools/CropImage/CropImage"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/resize-image" element={<ResizeImage />} />

      <Route path="/compress-image" element={<CompressImage />} />

      <Route path="/change-file-size" element={<ChangeFileSize />} />

      <Route path="/change-dpi" element={<ChangeDpi />} />

      <Route path="/convert-image" element={<ConvertImage />} />

      <Route path="/remove-background" element={<RemoveBackground />} />

      <Route path="/ai-upscale" element={<AIUpscale />} /> 

      <Route path="/image-to-pdf" element={<ImageToPdf />} />

      <Route path="/merge-pdf" element={<PdfMerger />} />

      <Route path="/remove-pages" element={<PdfPageRemover />} /> 

      <Route path="/crop-image" element={<CropImage />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="*" element={<NotFound />} /> 

    </Routes>
  );
}