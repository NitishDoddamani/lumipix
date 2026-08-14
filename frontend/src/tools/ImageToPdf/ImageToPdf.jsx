import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import PdfOptions from "./components/PdfOptions";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { generatePdf } from "../../services/imageToPdf";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function ImageToPdf() {

  usePageTitle(
  "Image to PDF Converter Free — Lumipix",
  "Combine one or more images into a single PDF for free, right in your browser."
);

  const [images, setImages] = useState([]);

  const [resultPdf, setResultPdf] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({

    pageSize: "a4",
    orientation: "auto",
    margin: 10,

  });

  function updateImages(next) {

    setImages(next);

    if (resultPdf) {

      setResultPdf(null);
      setSettingsChanged(true);

    }

  }

  function updateSettings(updater) {

    setSettings((prev) => {

      const updated = typeof updater === "function" ? updater(prev) : updater;
      return updated;

    });

    if (resultPdf) {

      setResultPdf(null);
      setSettingsChanged(true);

    }

  }

  async function handleGenerate() {

    if (images.length === 0) {
      alert("Add at least one image.");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);

      const result = await generatePdf(
        images,
        settings,
        (pct) => setProgress(pct)
      );

      setResultPdf(result);

      setSettingsChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to generate PDF.");

    } finally {

      setLoading(false);

      setProgress(0);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Image to PDF"
          description="Combine one or more images into a single PDF — runs entirely in your browser."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          <UploadBox
            images={images}
            setImages={updateImages}
          />

          <PdfOptions
            images={images}
            settings={settings}
            setSettings={updateSettings}
            loading={loading}
            progress={progress}
            onGenerate={handleGenerate}
          />

        </div>

        {settingsChanged && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Changes Made"
              description="Click Generate PDF again to create an updated file."
            />

          </div>

        )}

        {resultPdf && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="PDF Ready"
              description="Processed entirely in your browser — your images were never uploaded anywhere."
            />

            <ResultCard result={resultPdf} />

            <SuggestedTools currentTool="image-to-pdf" />

          </div>

        )}

      </Container>

    </div>

  );

}