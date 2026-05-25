import type { Metadata } from "next";
import ContactCards from "./ContactCards";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Mobol. Tell us about your brand, product, or website and we'll reply within two business days.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Mobol",
    description:
      "Start a project with Mobol. Tell us about your brand, product, or website and we'll reply within two business days.",
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
    "Start a project with Mobol. Tell us about your brand, product, or website and we'll reply within two business days.",
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
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        <ContactCards />
      </div>
    </div>
  );
}
