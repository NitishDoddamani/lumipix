import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import CompressionOptions from "./components/CompressionOptions";
import ImageInfo from "./components/ImageInfo";
import ImagePreview from "./components/ImagePreview";
import DownloadCard from "./components/DownloadCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { compressImage } from "../../services/imageCompression";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function CompressImage() {

  usePageTitle(
  "Compress Image Online Free — Lumipix",
  "Reduce image file size while preserving visual quality. Free, fast, and processed entirely in your browser."
);

  const [image, setImage] =useState(null);

  const [compressedImage,setCompressedImage]=useState(null);

  const [loading,setLoading]=useState(false);

  const [compressionChanged,setCompressionChanged]=useState(false);

  const [settings,setSettings]=useState({

    // Nothing selected initially
    mode:"",

    // Quality Mode
    preset:"balanced",
    quality:80,

    // Target Mode
    targetSize:0,

    // Advanced
    keepMetadata:true,

  });

  async function handleCompress(){

    if(!image?.file){
      alert("Please upload an image.");
      return;
    }

    if(!settings.mode){
      alert("Please choose a compression method.");
      return;
    }

    if(
      settings.mode==="target" &&
      settings.targetSize<=0
    ){
      alert("Enter a valid target size.");
      return;
    }

    try{

      setLoading(true);

      const result=await compressImage(
        image.file,
        settings
      );

      setCompressedImage(result);

      setCompressionChanged(false);

    }
    catch(err){

      console.error(err);

      alert("Failed to compress image.");

    }
    finally{

      setLoading(false);

    }

  }

  return(

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Compress Image"
          description="Reduce image file size while maintaining the best possible quality."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          {/* LEFT */}

          <div className="space-y-6">

            <UploadBox
              image={image}
              setImage={(img)=>{

                setImage(img);

                setCompressedImage(null);

                setCompressionChanged(false);

              }}
              setSettings={setSettings}
            />

            <ImageInfo image={image}/>

          </div>

          {/* RIGHT */}

          <CompressionOptions
            image={image}
            settings={settings}
            setSettings={(updater)=>{

              setSettings(prev=>{

                const updated=
                  typeof updater==="function"
                    ? updater(prev)
                    : updater;

                return updated;

              });

              if(compressedImage){

                setCompressedImage(null);

                setCompressionChanged(true);

              }

            }}
            loading={loading}
            onCompress={handleCompress}
          />

        </div>

        {/* SETTINGS CHANGED */}

        {compressionChanged && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Settings Changed"
              description="Click Compress Image again to generate a new compressed image."
            />

          </div>

        )}

        {/* RESULT */}

        {compressedImage && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Compression Complete"
              description="Compare the original and compressed image before downloading."
            />

            <ImagePreview
              original={image}
              compressed={compressedImage}
            />

            <DownloadCard
              compressed={compressedImage}
            />

            <SuggestedTools currentTool="compress-image" />

          </div>

        )}

      </Container>

    </div>

  );

}