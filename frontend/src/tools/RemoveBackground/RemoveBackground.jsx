import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import BackgroundOptions from "./components/BackgroundOptions";
import ImageInfo from "./components/ImageInfo";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { removeImageBackground } from "../../services/backgroundRemoval";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function RemoveBackground() {

  usePageTitle(
  "Remove Background from Image with AI — Lumipix",
  "Automatically remove image backgrounds using AI, free and entirely in your browser — no uploads to a server."
);

  const [image, setImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progressLabel, setProgressLabel] = useState("");

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    backgroundColor: "transparent",
    customColor: "#ffffff",
  });

  async function handleProcess() {

    if (!image?.file) {
      alert("Please upload an image.");
      return;
    }

    try {

      setLoading(true);
      setProgressLabel("Starting...");

      const result = await removeImageBackground(
        image.file,
        { backgroundColor: settings.backgroundColor },
        ({ key, current, total }) => {

          if (key?.includes("fetch")) {

            setProgressLabel(
              total
                ? `Downloading AI model... ${Math.round((current / total) * 100)}%`
                : "Downloading AI model..."
            );

          } else {

            setProgressLabel("Removing background...");

          }

        }
      );

      setResultImage(result);

      setSettingsChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to remove background.");

    } finally {

      setLoading(false);

      setProgressLabel("");

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Remove Background"
          description="Automatically remove the background from any image using an AI model that runs entirely in your browser."
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

          <BackgroundOptions
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
            progressLabel={progressLabel}
            onProcess={handleProcess}
          />

        </div>

        {settingsChanged && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Settings Changed"
              description="Click Remove Background again to generate a new result."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Background Removed"
              description="Processed entirely in your browser — the image was never uploaded anywhere."
            />

            <ResultCard
              original={image}
              result={resultImage}
            />

            <SuggestedTools currentTool="remove-background" />

          </div>

        )}

      </Container>

    </div>

  );

}