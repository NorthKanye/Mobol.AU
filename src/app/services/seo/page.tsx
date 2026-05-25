import type { Metadata } from "next";
import SeoPageBody from "./SeoPageBody";
import { getService } from "@/lib/services";

const service = getService("seo")!;

export const metadata: Metadata = {
  title: "Search & SEO in Perth | Mobol",
  description:
    "Technical SEO, content strategy, and ranking work by Mobol. Page-one placement for the queries your customers actually search.",
  alternates: { canonical: service.href },
  openGraph: {
    title: "Search & SEO | Mobol",
    description: service.shortDescription,
    url: service.href,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search & SEO | Mobol",
    description: service.shortDescription,
  },
};

const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.label,
  description: service.shortDescription,
  url: service.href,
  provider: { "@type": "Organization", name: "Mobol" },
  serviceType: [
    "Technical SEO",
    "Content Strategy",
    "Ranking Recovery",
    "Core Web Vitals",
    "Site Architecture",
  ],
  areaServed: "AU",
}).replace(/</g, "\\u003c");

export default function SeoPage() {
  return (
    <>
      <script type="application/ld+json">{JSON_LD_STRING}</script>
      <SeoPageBody />
    </>
  );
}
