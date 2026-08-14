import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import SizeOptions from "./components/SizeOptions";
import ImageInfo from "./components/ImageInfo";
import ImagePreview from "./components/ImagePreview";
import DownloadCard from "./components/DownloadCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { changeFileSize } from "../../services/changeFileSize";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function ChangeFileSize() {

  usePageTitle(
  "Change Image File Size Online — Lumipix",
  "Hit an exact KB or MB target for your image file size, up or down — free and runs entirely in your browser."
);

  const [image, setImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    targetSize: 0,
    keepMetadata: true,
  });

  async function handleProcess() {

    if (!image?.file) {
      alert("Please upload an image.");
      return;
    }

    if (!settings.targetSize || settings.targetSize <= 0) {
      alert("Enter a valid target size.");
      return;
    }

    try {

      setLoading(true);

      const result = await changeFileSize(image.file, settings);

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
          title="Change File Size"
          description="Set an exact file size in KB — works for both shrinking and enlarging."
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

          <SizeOptions
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
              description="Click Change File Size again to generate a new result."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title={
                resultImage.direction === "grow"
                  ? "File Size Increased"
                  : "File Size Reduced"
              }
              description="Compare the original and the new file before downloading."
            />

            <ImagePreview
              original={image}
              result={resultImage}
            />

            <DownloadCard
              result={resultImage}
            />

            <SuggestedTools currentTool="change-file-size" />

          </div>

        )}

      </Container>

    </div>

  );

}