import { useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import MergeOptions from "./components/MergeOptions";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import { mergePdfs } from "../../services/pdfMerge";

import usePageTitle from "../../hooks/usePageTitle";
import SuggestedTools from "../../components/common/SuggestedTools";

export default function PdfMerger() {

  usePageTitle(
  "Merge PDF Files Online Free — Lumipix",
  "Combine multiple PDF files into one document for free, in whatever order you choose."
);

  const [files, setFiles] = useState([]);

  const [outputName, setOutputName] = useState("");

  const [resultPdf, setResultPdf] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [changed, setChanged] = useState(false);

  function updateFiles(next) {

    setFiles(next);

    if (resultPdf) {

      setResultPdf(null);
      setChanged(true);

    }

  }

  const hasErrors = files.some((f) => f.error);
  const isLoadingMeta = files.some((f) => f.loading);

  async function handleMerge() {

    if (files.length === 0) {
      alert("Add at least one PDF.");
      return;
    }

    if (hasErrors) {
      alert("Remove the files that couldn't be read before merging.");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);

      const result = await mergePdfs(
        files,
        outputName,
        (pct) => setProgress(pct)
      );

      setResultPdf(result);

      setChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to merge PDFs.");

    } finally {

      setLoading(false);

      setProgress(0);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Merge PDF"
          description="Combine multiple PDFs into one file, in whatever order you choose — runs entirely in your browser."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          <UploadBox
            files={files}
            setFiles={updateFiles}
          />

          <MergeOptions
            files={files}
            outputName={outputName}
            setOutputName={(name) => {

              setOutputName(name);

              if (resultPdf) {

                setResultPdf(null);
                setChanged(true);

              }

            }}
            hasErrors={hasErrors}
            isLoadingMeta={isLoadingMeta}
            loading={loading}
            progress={progress}
            onMerge={handleMerge}
          />

        </div>

        {changed && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Changes Made"
              description="Click Merge PDFs again to create an updated file."
            />

          </div>

        )}

        {resultPdf && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="PDFs Merged"
              description="Processed entirely in your browser — your files were never uploaded anywhere."
            />

            <ResultCard result={resultPdf} />

            <SuggestedTools currentTool="merge-pdf" />

          </div>

        )}

      </Container>

    </div>

  );

}