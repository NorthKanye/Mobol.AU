import type { Metadata } from "next";
import WebDevHero from "@/components/services/web-development/WebDevHero";
import ServiceSection from "@/components/services/ServiceSection";
import WebDevCta from "@/components/services/web-development/WebDevCta";
import CmsLogoRow from "@/components/services/web-development/CmsLogoRow";
import ContentEditingDemo from "@/components/services/web-development/demos/ContentEditingDemo";
import PerformanceDemo from "@/components/services/web-development/demos/PerformanceDemo";
import ResponsiveDemo from "@/components/services/web-development/demos/ResponsiveDemo";
import CleanLayoutDemo from "@/components/services/web-development/demos/CleanLayoutDemo";
import LivePreviewDemo from "@/components/services/web-development/demos/LivePreviewDemo";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Custom web development, responsive design, and CMS-driven sites by Mobol. Sharp, fast websites your team can update without calling a developer.",
  alternates: { canonical: "/services/web-development" },
  openGraph: {
    title: "Web Development | Mobol",
    description:
      "Sharp, fast websites your team can update without calling a developer.",
    url: "/services/web-development",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development | Mobol",
    description: "Websites your team can actually use.",
  },
};

const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Development",
  description:
    "Custom web development, responsive design, and CMS-driven sites your team can keep editing.",
  url: "/services/web-development",
  provider: {
    "@type": "Organization",
    name: "Mobol",
  },
  serviceType: [
    "Web Development",
    "Web Design",
    "WordPress Development",
    "Shopify Development",
    "Headless CMS",
  ],
  areaServed: "AU",
}).replace(/</g, "\\u003c");

export default function WebDevelopmentPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <WebDevHero />

        <div className="mt-24 lg:mt-32 space-y-24 lg:space-y-32">
          <ServiceSection
            category="Easy editing"
            title="Update your site without calling a developer"
            body="Change the everyday things yourself. Text, photos, services, products, staff, opening hours, page sections. We set up the editing side in plain English, and build cleanly underneath so updates stay stable."
            bullets={[
              "Edit everyday content yourself",
              "Clear page sections",
              "CMS matched to your team",
              "Stable underneath, even after edits",
            ]}
            demoOnLeft={true}
            demo={<ContentEditingDemo />}
          />

          <ServiceSection
            category="Development"
            title="Optimised for speed"
            body="We build performance in from the start. We design for Core Web Vitals, ship lean bundles, and put the heavy lifting at the edge, so your site stays fast as it grows."
            bullets={[
              "Core Web Vitals as a release gate",
              "Code splitting and lazy loading by default",
              "Image and font optimisation pipelines",
              "Edge caching and incremental revalidation",
            ]}
            demoOnLeft={false}
            demo={<PerformanceDemo />}
          />

          <ServiceSection
            category="Design"
            title="Responsive by default"
            body="The same site should feel right on a phone, a laptop, and a 4K display. We design and build mobile-first, so the layout holds up at every size."
            bullets={[
              "Mobile-first layout and content priority",
              "Adaptive grid and typography",
              "Touch-optimised interactions",
              "Cross-browser and cross-device tested",
            ]}
            demoOnLeft={true}
            demo={<ResponsiveDemo />}
          />

          <ServiceSection
            category="Design"
            title="From cluttered to clear"
            body="A page can hold all the right information and still feel a mess. We arrange yours so attention lands where it should. A clear headline, one obvious next step, and nothing fighting for the eye."
            bullets={[
              "A clear order: what you do, why you, what to do next",
              "One obvious action on every page",
              "Generous spacing that's easy to scan",
              "Looks considered, not crowded",
            ]}
            demoOnLeft={false}
            demo={<CleanLayoutDemo />}
          />

          <ServiceSection
            category="CMS"
            title="Built on the right platform"
            body="WordPress, Shopify, or headless. We work with whatever your team already understands, or recommend what fits the brief. The platform choice should make daily updates easier, not add another thing your team has to wrestle with."
            bullets={[
              "WordPress with block themes, Gutenberg, and plugins",
              "Shopify with storefronts, themes, and custom apps",
              "Headless setups with Sanity, Contentful, or Payload",
              "Custom admin dashboards when nothing else fits",
            ]}
            demoOnLeft={true}
            demo={<LivePreviewDemo />}
            aside={<CmsLogoRow />}
          />
        </div>

        <WebDevCta />
      </div>
    </div>
  );
}
