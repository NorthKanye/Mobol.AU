import type { Metadata } from "next";
import ContactCards from "./ContactCards";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Mobol. Tell us about your brand, product, or website — or chat live with our streaming assistant.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Mobol",
    description:
      "Start a project with Mobol. Tell us about your brand, product, or website — or chat live with our streaming assistant.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Mobol",
    description: "Start a project with Mobol.",
  },
};

// Hardcoded JSON-LD: no user-supplied values flow into this string. The `<`
// escape is belt-and-braces protection against an `</script>` payload if
// any field above ever becomes user-supplied in the future.
const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Mobol",
  description:
    "Start a project with Mobol. Tell us about your brand, product, or website — or chat live with our streaming assistant.",
  url: "/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Mobol",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      availableLanguage: ["English"],
    },
  },
}).replace(/</g, "\\u003c");

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] pt-32 sm:pt-36 pb-16 sm:pb-20">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        <header className="mb-10 sm:mb-14 max-w-[640px]">
          <p className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-5">
            Contact
          </p>
          <h1 className="text-ink font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.25rem,4vw,3.5rem)]">
            Two ways to start
            <br />a conversation.
          </h1>
          <p className="mt-6 text-[15px] leading-[1.6] text-ink-body max-w-[520px]">
            Send us a project brief and we'll reply within two business days,
            or chat live with our assistant for quick answers. Pick whichever
            feels right.
          </p>
        </header>

        <div className="min-h-[640px] sm:min-h-[560px] lg:min-h-[600px]">
          <ContactCards />
        </div>
      </div>
    </div>
  );
}
