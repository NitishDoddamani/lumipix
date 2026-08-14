import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import ResizeOptions from "./components/ResizeOptions";
import ImageInfo from "./components/ImageInfo";
import ImagePreview from "./components/ImagePreview";
import DownloadCard from "./components/DownloadCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import SuggestedTools from "../../components/common/SuggestedTools";
import usePageTitle from "../../hooks/usePageTitle";

export default function ResizeImage() {

  usePageTitle(
    "Resize Image Online Free — Lumipix",
    "Resize images by pixels, percentage, inches or centimeters. Free, fast, and runs entirely in your browser — no upload required."
  );

  const location = useLocation();

  const [image, setImage] = useState(null);

  const [resizedImage, setResizedImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [settingsChanged, setSettingsChanged] = useState(false);

  const [settings, setSettings] = useState({
    width: "",
    height: "",
    unit: "Pixels",
    dpi: 300,
    keepAspect: true,
  });

  useEffect(() => {

    const incoming = location.state?.incomingFile;

    if (incoming) {

      const preview = URL.createObjectURL(incoming);
      const img = new Image();

      img.onload = () => {

        setImage({
          file: incoming,
          preview,
          width: img.width,
          height: img.height,
        });

      };

      img.src = preview;

      window.history.replaceState({}, document.title);

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (

    <div className="bg-[#121212] min-h-screen">

      <Container className="py-12">

        <PageHeader
          title="Resize Image"
          description="Upload an image to resize it."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="space-y-5">

            <UploadBox
              image={image}
              setImage={(img) => {

                setImage(img);
                setResizedImage(null);
                setSettingsChanged(false);

              }}
              setSettings={setSettings}
            />

            <ImageInfo image={image} />

          </div>

          <div>

            <ResizeOptions
              image={image}
              settings={settings}
              setSettings={setSettings}
              setResizedImage={setResizedImage}
              setSettingsChanged={setSettingsChanged}
              loading={loading}
              setLoading={setLoading}
            />

          </div>

        </div>

        {settingsChanged && !resizedImage && (

          <div className="mt-6">

            <Banner
              type="warning"
              title="Settings Changed"
              description="Click 'Resize Image' to generate a new preview."
            />

          </div>

        )}

        {resizedImage && (

          <div className="mt-10 space-y-6">

            <ImagePreview
              original={image}
              resized={resizedImage}
            />

            <DownloadCard
              resized={resizedImage}
            />

            <SuggestedTools currentTool="resize-image" />

          </div>

        )}

      </Container>

    </div>

  );

}