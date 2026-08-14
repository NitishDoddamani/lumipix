import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import ConvertOptions from "./components/ConvertOptions";
import ImageInfo from "./components/ImageInfo";
import ImagePreview from "./components/ImagePreview";
import DownloadCard from "./components/DownloadCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { convertImage } from "../../services/imageConvert";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function ConvertImage() {

  usePageTitle(
  "Convert Image Format Online Free — Lumipix",
  "Convert between PNG, JPG and WEBP for free — fast, private, and processed entirely in your browser."
);

  const [image, setImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    format: "png",
    quality: 90,
  });

  async function handleProcess() {

    if (!image?.file) {
      alert("Please upload an image.");
      return;
    }

    try {

      setLoading(true);

      const result = await convertImage(image.file, settings);

      setResultImage(result);

      setSettingsChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to convert image.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Convert Image"
          description="Convert between PNG, JPG and WEBP formats."
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

          <ConvertOptions
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
              description="Click Convert Image again to generate a new result."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Conversion Complete"
              description="Compare the original and converted image before downloading."
            />

            <ImagePreview
              original={image}
              result={resultImage}
            />

            <DownloadCard
              result={resultImage}
            />

            <SuggestedTools currentTool="convert-image" />

          </div>

        )}

      </Container>

    </div>

  );

}