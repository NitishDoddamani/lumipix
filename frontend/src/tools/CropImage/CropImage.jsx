import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import CropCanvas from "./components/CropCanvas";
import CropOptions from "./components/CropOptions";
import ImageInfo from "./components/ImageInfo";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

import {
  validateFile,
  fileToDataUrl,
  rotateImage,
  flipImage,
  cropImage,
} from "../../services/cropImage";

export default function CropImage() {

  usePageTitle(
  "Crop Image Online Free — Lumipix",
  "Crop, rotate and flip images precisely with fixed or custom ratios — free and runs entirely in your browser."
);

  const [file, setFile] = useState(null);

  const [originalDataUrl, setOriginalDataUrl] = useState(null);

  const [workingImage, setWorkingImage] = useState(null);

  const [crop, setCrop] = useState(null);

  const [aspectRatio, setAspectRatio] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [changed, setChanged] = useState(false);

  async function handleFileSelected(selectedFile) {

    setResultImage(null);
    setChanged(false);

    if (!selectedFile) {

      setFile(null);
      setOriginalDataUrl(null);
      setWorkingImage(null);
      setCrop(null);
      setAspectRatio(null);

      return;

    }

    try {

      validateFile(selectedFile);

      const dataUrl = await fileToDataUrl(selectedFile);

      const img = new Image();

      img.onload = () => {

        setFile(selectedFile);
        setOriginalDataUrl(dataUrl);

        const w = { dataUrl, width: img.width, height: img.height };

        setWorkingImage(w);
        setCrop({ x: 0, y: 0, width: img.width, height: img.height });
        setAspectRatio(null);

      };

      img.src = dataUrl;

    } catch (err) {

      alert(err.message || "Couldn't load this image.");

    }

  }

  function markChanged() {

    if (resultImage) {

      setResultImage(null);
      setChanged(true);

    }

  }

  async function handleRotate(direction) {

    const result = await rotateImage(workingImage.dataUrl, direction);

    setWorkingImage(result);
    setCrop({ x: 0, y: 0, width: result.width, height: result.height });

    markChanged();

  }

  async function handleFlip(axis) {

    const result = await flipImage(workingImage.dataUrl, axis);

    setWorkingImage(result);
    setCrop({ x: 0, y: 0, width: result.width, height: result.height });

    markChanged();

  }

  function handleAspectChange(ratio) {

    setAspectRatio(ratio);

    if (ratio && crop && workingImage) {

      const centerX = crop.x + crop.width / 2;
      const centerY = crop.y + crop.height / 2;

      // IMPORTANT: derive the new box from the full image bounds, not
      // from the *current* crop's width/height. Basing it on the current
      // crop compounds shrinkage every time the ratio changes (each switch
      // could only ever get smaller, never grow back), which is why
      // repeated ratio switching ended up with a tiny box. Starting from
      // the full image each time gives the largest possible box for the
      // newly selected ratio, centered on wherever the crop currently is.
      let width = workingImage.width;
      let height = width / ratio;

      if (height > workingImage.height) {

        height = workingImage.height;
        width = height * ratio;

      }

      let x = centerX - width / 2;
      let y = centerY - height / 2;

      x = Math.max(0, Math.min(x, workingImage.width - width));
      y = Math.max(0, Math.min(y, workingImage.height - height));

      setCrop({
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      });

    }

    markChanged();

  }

  function handleCropChange(next) {

    setCrop(next);
    markChanged();

  }

  function handleCropFieldChange(key, value) {

    if (!workingImage) return;

    const next = { ...crop, [key]: value };

    next.x = Math.max(0, Math.min(next.x, workingImage.width - 4));
    next.y = Math.max(0, Math.min(next.y, workingImage.height - 4));
    next.width = Math.max(4, Math.min(next.width, workingImage.width - next.x));
    next.height = Math.max(4, Math.min(next.height, workingImage.height - next.y));

    setCrop(next);
    markChanged();

  }

  function handleReset() {

    if (!originalDataUrl) return;

    const img = new Image();

    img.onload = () => {

      const w = { dataUrl: originalDataUrl, width: img.width, height: img.height };

      setWorkingImage(w);
      setCrop({ x: 0, y: 0, width: img.width, height: img.height });
      setAspectRatio(null);

      markChanged();

    };

    img.src = originalDataUrl;

  }

  async function handleApply() {

    if (!workingImage || !crop || !file) return;

    try {

      setLoading(true);

      const result = await cropImage(workingImage.dataUrl, crop, file);

      setResultImage(result);

      setChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to crop image.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Crop Image"
          description="Crop, rotate and flip your image precisely — runs entirely in your browser."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          <div className="space-y-6">

            <UploadBox
              file={file}
              onFileSelected={handleFileSelected}
            />

            {workingImage && crop && (

              <CropCanvas
                workingImage={workingImage}
                crop={crop}
                onCropChange={handleCropChange}
                aspectRatio={aspectRatio}
              />

            )}

            <ImageInfo
              workingImage={workingImage}
              file={file}
            />

          </div>

          {workingImage && crop && (

            <CropOptions
              crop={crop}
              aspectRatio={aspectRatio}
              onAspectChange={handleAspectChange}
              onRotate={handleRotate}
              onFlip={handleFlip}
              onReset={handleReset}
              onCropFieldChange={handleCropFieldChange}
              loading={loading}
              onApply={handleApply}
            />

          )}

        </div>

        {changed && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Changes Made"
              description="Click Apply Crop again to generate an updated image."
            />

          </div>

        )}

        {resultImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Image Cropped"
              description="Processed entirely in your browser — your image was never uploaded anywhere."
            />

            <ResultCard result={resultImage} />

            <SuggestedTools currentTool="crop-image" />

          </div>

        )}

      </Container>

    </div>

  );

}