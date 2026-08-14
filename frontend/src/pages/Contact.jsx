import { Mail } from "lucide-react";
import Container from "../components/common/Container";
import PageHeader from "../components/layout/PageHeader";
import usePageTitle from "../hooks/usePageTitle";

// NOTE: replace the placeholder email below with your real contact
// address before deploying.
const CONTACT_EMAIL = "nitishdoddamani098@gmail.com";

export default function Contact() {
  usePageTitle(
    "Contact — Lumipix",
    "Get in touch with the Lumipix team."
  );

  return (
    <div className="bg-[#121212] min-h-screen">
      <Container className="py-12">
        <PageHeader
          title="Contact"
          description="Questions, feedback, or found a bug? Reach out."
        />

        <div className="max-w-xl bg-[#18181C] border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/15 rounded-lg p-2.5 shrink-0">
              <Mail size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Email us</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-zinc-400 hover:text-blue-400 transition text-sm"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <p className="text-zinc-500 text-sm mt-6 leading-6">
            We try to respond within a couple of days. For bug reports,
            mentioning which tool and browser you're using helps a lot.
          </p>
        </div>
      </Container>
    </div>
  );
}