import { useRef, useState } from "react";

import Container from "../../components/common/Container";

import UploadBox from "./components/UploadBox";
import PageGrid from "./components/PageGrid";
import RemoveOptions from "./components/RemoveOptions";
import ResultCard from "./components/ResultCard";

import PageHeader from "../../components/layout/PageHeader";
import Banner from "../../components/ui/Banner";

import usePageTitle from "../../hooks/usePageTitle";

import SuggestedTools from "../../components/common/SuggestedTools";

import {
  readAllPageThumbnails,
  removePages,
  parsePageSelection,
  formatPageSelection,
} from "../../services/pdfPageRemover";

export default function PdfPageRemover() {

  usePageTitle(
  "Remove Pages from PDF Online Free — Lumipix",
  "Delete specific pages from a PDF for free — click pages or type page numbers, right in your browser."
);

  const lastClickedRef = useRef(null);

  const [file, setFile] = useState(null);

  const [pageCount, setPageCount] = useState(0);

  const [thumbnails, setThumbnails] = useState([]);

  const [thumbsTruncated, setThumbsTruncated] = useState(false);

  const [readingPages, setReadingPages] = useState(false);

  const [readProgress, setReadProgress] = useState({ done: 0, total: 0 });

  const [selectedPages, setSelectedPages] = useState(new Set());

  const [pagesText, setPagesText] = useState("");

  const [resultPdf, setResultPdf] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [changed, setChanged] = useState(false);

  async function handleFileSelected(selectedFile) {

    setFile(selectedFile);
    setPageCount(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setPagesText("");
    setResultPdf(null);
    setChanged(false);
    lastClickedRef.current = null;

    if (!selectedFile) return;

    try {

      setReadingPages(true);
      setReadProgress({ done: 0, total: 0 });

      const { pageCount: count, thumbnails: thumbs, truncated } =
        await readAllPageThumbnails(selectedFile, (done, total) =>
          setReadProgress({ done, total })
        );

      setPageCount(count);
      setThumbnails(thumbs);
      setThumbsTruncated(truncated);

    } catch (err) {

      console.error(err);

      alert(err.message || "Couldn't read this PDF.");

      setFile(null);

    } finally {

      setReadingPages(false);

    }

  }

  function handleToggle(pageNum, shiftKey) {

    setSelectedPages((prev) => {

      const next = new Set(prev);

      if (shiftKey && lastClickedRef.current !== null) {

        const start = Math.min(lastClickedRef.current, pageNum);
        const end = Math.max(lastClickedRef.current, pageNum);

        for (let p = start; p <= end; p++) next.add(p);

      } else if (next.has(pageNum)) {

        next.delete(pageNum);

      } else {

        next.add(pageNum);

      }

      setPagesText(formatPageSelection(next));

      if (resultPdf) {
        setResultPdf(null);
        setChanged(true);
      }

      return next;

    });

    lastClickedRef.current = pageNum;

  }

  function handleTextChange(value) {

    setPagesText(value);

    setSelectedPages(parsePageSelection(value, pageCount));

    if (resultPdf) {
      setResultPdf(null);
      setChanged(true);
    }

  }

  async function handleRemove() {

    if (!file) return;

    if (selectedPages.size === 0) {
      alert("Select at least one page to remove.");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);

      const result = await removePages(
        file,
        selectedPages,
        pageCount,
        (pct) => setProgress(pct)
      );

      setResultPdf(result);

      setChanged(false);

    } catch (err) {

      console.error(err);

      alert(err.message || "Failed to remove pages.");

    } finally {

      setLoading(false);

      setProgress(0);

    }

  }

  return (

    <div className="min-h-screen bg-[#121212]">

      <Container className="py-12">

        <PageHeader
          title="Remove PDF Pages"
          description="Delete specific pages from a PDF — click pages or type page numbers, runs entirely in your browser."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          <div className="space-y-6">

            <UploadBox
              file={file}
              pageCount={pageCount}
              onFileSelected={handleFileSelected}
            />

            {readingPages && (

              <div className="bg-[#18181C] border border-zinc-800 rounded-2xl p-5">

                <div className="flex justify-between text-xs text-zinc-400 mb-2">

                  <span>Rendering pages...</span>

                  <span>

                    {readProgress.done}/{readProgress.total || "?"}

                  </span>

                </div>

                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">

                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{
                      width: readProgress.total
                        ? `${Math.round((readProgress.done / readProgress.total) * 100)}%`
                        : "10%",
                    }}
                  />

                </div>

              </div>

            )}

            {!readingPages && thumbnails.length > 0 && (

              <PageGrid
                thumbnails={thumbnails}
                totalPages={pageCount}
                selectedPages={selectedPages}
                onToggle={handleToggle}
              />

            )}

            {thumbsTruncated && (

              <Banner
                type="warning"
                title="Large Document"
                description="This PDF has more pages than can be shown as thumbnails — use the page number field to select pages beyond what's visible."
              />

            )}

          </div>

          <RemoveOptions
            pageCount={pageCount}
            pagesText={pagesText}
            selectedCount={selectedPages.size}
            onTextChange={handleTextChange}
            loading={loading}
            progress={progress}
            onRemove={handleRemove}
            disabled={!file || readingPages}
          />

        </div>

        {changed && !loading && (

          <div className="mt-7">

            <Banner
              type="warning"
              title="Selection Changed"
              description="Click Remove Pages again to create an updated file."
            />

          </div>

        )}

        {resultPdf && (

          <div className="mt-12 space-y-8">

            <Banner
              type="success"
              title="Pages Removed"
              description="Processed entirely in your browser — your file was never uploaded anywhere."
            />

            <ResultCard result={resultPdf} />

            <SuggestedTools currentTool="remove-pages" />

          </div>

        )}

      </Container>

    </div>

  );

}