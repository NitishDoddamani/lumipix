import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import DpiOptions from "./components/DpiOptions";
import ImageInfo from "./components/ImageInfo";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { changeDpi } from "../../services/dpiChange";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function ChangeDpi() {

  usePageTitle(
  "Change Image DPI Online Free — Lumipix",
  "Update the print resolution (DPI) metadata of your image for free, right in your browser."
);

  const [image, setImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    targetDpi: 300,
  });

  async function handleProcess() {

    if (!image?.file) {
      alert("Please upload an image.");
      return;
    }

    if (!settings.targetDpi || settings.targetDpi <= 0) {
      alert("Enter a valid DPI value.");
      return;
    }

    try {

      setLoading(true);

      const result = await changeDpi(image.file, settings.targetDpi);

      setResultImage(result);

      setSettingsChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to process image.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Change DPI"
          description="Update the print resolution (DPI) of JPEG and PNG images — pixel dimensions and quality stay exactly the same."
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

          <DpiOptions
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
            onProcess={handleProcess}
          />

        </div>

        {settingsChanged && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Settings Changed"
              description="Click Change DPI again to generate a new result."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="DPI Updated"
              description="Only print-resolution metadata was changed — pixels, quality and appearance are untouched."
            />

            <ResultCard
              original={image}
              result={resultImage}
            />

            <SuggestedTools currentTool="change-dpi" />

          </div>

        )}

      </Container>

    </div>

  );

}