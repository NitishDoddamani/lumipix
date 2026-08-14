import Container from "../components/common/Container";
import PageHeader from "../components/layout/PageHeader";
import usePageTitle from "../hooks/usePageTitle";

export default function About() {
  usePageTitle(
    "About — Lumipix",
    "Lumipix is a free, browser-based image and PDF toolkit. No uploads, no signup, no watermark."
  );

  return (
    <div className="bg-[#121212] min-h-screen">
      <Container className="py-12">
        <PageHeader
          title="About Lumipix"
          description="Free image and PDF tools that run entirely in your browser."
        />

        <div className="max-w-3xl text-zinc-400 leading-8 space-y-5">
          <p>
            Lumipix is a set of free image and PDF tools — resize, compress,
            crop, convert, remove backgrounds, upscale, and more. Every tool
            runs entirely inside your browser using client-side processing,
            so your files are never uploaded to a server.
          </p>

          <p>
            No sign-up, no watermark, and no hidden limits. Lumipix was
            built to be a fast, no-friction alternative to bloated online
            editors that require accounts or push you toward paid plans.
          </p>

          <p>
            The project is actively growing — new tools and improvements
            ship regularly.
          </p>
        </div>
      </Container>
    </div>
  );
}