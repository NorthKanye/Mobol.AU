import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import FooterCta from "@/components/footer/FooterCta";

export const metadata: Metadata = {
  title: "Services | Mobol",
  description:
    "Web development, AI integration, SEO, social media, branding, and reputation management — six disciplines run together by Mobol in Perth.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Mobol",
    description:
      "Six disciplines run together — web, AI, SEO, social, brand, reputation.",
    url: "/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Mobol",
    description: "Six disciplines run together by Mobol.",
  },
};

const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mobol services",
  url: "/services",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.label,
    url: s.href,
    description: s.shortDescription,
  })),
}).replace(/</g, "\\u003c");

function ArrowShort() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M3 7 H11 M7.5 3 L11 7 L7.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesIndexPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <header className="max-w-[760px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono">
            Services
          </p>
          <h1 className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.6vw,3.5rem)]">
            Six disciplines,
            <br />
            run together.
          </h1>
          <p className="mt-6 text-[16px] leading-[1.6] text-ink-body max-w-[620px]">
            Web, AI, search, social, brand, and reputation — handled by a small
            team that ships the work itself. Pick a service to see what it
            includes; we usually combine two or three for a given engagement.
          </p>
        </header>

        <ul className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={service.href}
                className="group block focus:outline-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:rounded-2xl"
              >
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.06] transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[40px] font-bold tracking-tighter-display text-ink-3 group-hover:text-ink-2 transition-colors duration-300">
                      {service.eyebrow.split("—")[0]?.trim()}
                    </span>
                  </div>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono">
                  {service.eyebrow}
                </p>
                <h2 className="mt-2.5 text-ink font-bold tracking-[-0.01em] text-[18px]">
                  {service.label}
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-ink-body">
                  {service.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-ink-2 transition-colors group-hover:text-ink">
                  Explore {service.label.toLowerCase()}
                  <ArrowShort />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-32 lg:mt-40">
          <FooterCta />
        </div>
      </div>
    </div>
  );
}
