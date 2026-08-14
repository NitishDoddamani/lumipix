import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import UpscaleOptions from "./components/UpscaleOptions";
import ImageInfo from "./components/ImageInfo";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { upscaleImage } from "../../services/upscaleImage";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function AIUpscale() {

  usePageTitle(
  "AI Image Upscaler Free Online — Lumipix",
  "Increase image resolution using AI without losing quality — free, and processed entirely in your browser."
);

  const [image, setImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    scale: 2,
  });

  async function handleProcess() {

    if (!image?.file) {
      alert("Please upload an image.");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);

      const result = await upscaleImage(
        image.file,
        { scale: settings.scale },
        (pct) => setProgress(pct)
      );

      setResultImage(result);

      setSettingsChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to upscale image.");

    } finally {

      setLoading(false);

      setProgress(0);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="AI Upscale"
          description="Increase image resolution using an AI super-resolution model that runs entirely in your browser."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          <div className="space-y-6">

            <UploadBox
              image={image}
              setImage={(img) => {

                setImage(img);
                setResultImage(null);
                setSettingsChanged(false);

              }}
              setSettings={setSettings}
            />

            <ImageInfo image={image} />

          </div>

          <UpscaleOptions
            image={image}
            settings={settings}
            setSettings={(updater) => {

              setSettings((prev) => {

                const updated =
                  typeof updater === "function"
                    ? updater(prev)
                    : updater;

                return updated;

              });

              if (resultImage) {

                setResultImage(null);
                setSettingsChanged(true);

              }

            }}
            loading={loading}
            progress={progress}
            onProcess={handleProcess}
          />

        </div>

        {settingsChanged && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Settings Changed"
              description="Click Upscale Image again to generate a new result."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Image Upscaled"
              description="Processed entirely in your browser — the image was never uploaded anywhere."
            />

            <ResultCard
              original={image}
              result={resultImage}
            />

            <SuggestedTools currentTool="ai-upscale" />

          </div>

        )}

      </Container>

    </div>

  );

}