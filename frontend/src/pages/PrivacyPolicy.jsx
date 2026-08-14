import Container from "../components/common/Container";
import PageHeader from "../components/layout/PageHeader";
import usePageTitle from "../hooks/usePageTitle";

export default function PrivacyPolicy() {
  usePageTitle(
    "Privacy Policy — Lumipix",
    "How Lumipix handles your data — in short, it doesn't leave your browser."
  );

  return (
    <div className="bg-[#121212] min-h-screen">
      <Container className="py-12">
        <PageHeader
          title="Privacy Policy"
          description="Last updated August 2026."
        />

        <div className="max-w-3xl text-zinc-400 leading-8 space-y-6">
          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              Your files never leave your device
            </h2>
            <p>
              Every image and PDF tool on Lumipix processes files entirely
              in your browser using JavaScript and WebAssembly. We do not
              upload, store, or have access to any file you edit on this
              site.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              Analytics
            </h2>
            <p>
              We use privacy-respecting analytics to understand overall
              site traffic and which tools are used most — this covers
              anonymous, aggregate usage data only, not your files or
              their contents.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              Cookies
            </h2>
            <p>
              Lumipix does not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              Changes to this policy
            </h2>
            <p>
              If this policy changes, the update date at the top of this
              page will reflect that.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}