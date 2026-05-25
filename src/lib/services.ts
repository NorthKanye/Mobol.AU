/**
 * Service catalog — single source of truth for the nav dropdown, mobile menu,
 * footer service column, and the placeholder service pages' metadata.
 *
 * Display order matches the homepage Services section (rows 01–03 + cards 04–06).
 * `live` is informational only — every entry has a real route after this change
 * lands; we still scaffold the unbuilt ones as PlaceholderServicePage instances.
 *
 * NOT consumed by src/components/services/Services.tsx (homepage hub) —
 * that section keeps its bespoke per-service copy + Mockup visuals.
 */
export type Service = {
  slug: string;
  label: string;
  shortDescription: string;
  href: string;
  eyebrow: string;
};

export const services: Service[] = [
  {
    slug: "web-development",
    label: "Website Development",
    shortDescription:
      "WordPress, Shopify, and custom React builds. Design and code shipped together.",
    href: "/services/web-development",
    eyebrow: "01 · Build",
  },
  {
    slug: "ai-integration",
    label: "AI Integration",
    shortDescription:
      "Branded chat, knowledge retrieval, voice, tool-calling, and workflow automation.",
    href: "/services/ai-integration",
    eyebrow: "02 · Automate",
  },
  {
    slug: "seo",
    label: "Search & SEO",
    shortDescription:
      "Technical SEO, content strategy, and ranking work. Page-one placement that lasts.",
    href: "/services/seo",
    eyebrow: "03 · Rank",
  },
  {
    slug: "social-media",
    label: "Social Media",
    shortDescription:
      "Username claims, account recovery, day-to-day management, and verification prep.",
    href: "/services/social-media",
    eyebrow: "04 · Run",
  },
  {
    slug: "reputation",
    label: "Reputation Management",
    shortDescription:
      "Review responses, PR placements, and on-brand playbooks across Google and beyond.",
    href: "/services/reputation",
    eyebrow: "06 · Protect",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
