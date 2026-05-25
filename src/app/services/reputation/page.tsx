import type { Metadata } from "next";
import { getService } from "@/lib/services";
import ReputationHero from "@/components/services/reputation-detail/ReputationHero";
import MediaPlacementDemo from "@/components/services/reputation-detail/MediaPlacementDemo";
import SearchCleanupDemo from "@/components/services/reputation-detail/SearchCleanupDemo";
import ReviewPulseDemo from "@/components/services/reputation-detail/ReviewPulseDemo";
import FooterCta from "@/components/footer/FooterCta";

const service = getService("reputation")!;

export const metadata: Metadata = {
  title: "Reputation Management in Perth | Mobol",
  description:
    "Review responses, removal requests where eligible, search de-indexing, and PR placements. Mobol handles the day-to-day across Google, Trustpilot, and the App Store.",
  alternates: { canonical: service.href },
  openGraph: {
    title: "Reputation Management | Mobol",
    description: service.shortDescription,
    url: service.href,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reputation Management | Mobol",
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
    "Online Reputation Management",
    "PR Placements",
    "Review Response",
    "Review Removal Requests",
    "Search-Result De-indexing",
  ],
  areaServed: "AU",
}).replace(/</g, "\\u003c");

type Section = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  demo: React.ReactNode;
  demoOnRight: boolean;
};

const sections: Section[] = [
  {
    id: "pr-media-placement",
    index: "01",
    kicker: "PR & Media",
    title: "Placed in the publications that matter",
    body: "PR placements with the publications your customers, partners, and investors read. Yahoo Finance, the Canberra Times, and the category trade publications that matter in your space. We pitch the angle, line up the interview, and place the story where it counts.",
    bullets: [
      "Yahoo Finance & national business press",
      "Category trade publications",
      "Founder interviews & thought leadership",
      "Local & regional press coverage",
      "Embargoed announcement coordination",
      "Press kit & spokesperson prep",
    ],
    demo: <MediaPlacementDemo />,
    demoOnRight: true,
  },
  {
    id: "content-removal",
    index: "02",
    kicker: "Search cleanup",
    title: "Clean what's already out there",
    body: "Negative articles, hostile forum threads, AI-scraped content farms, and old YouTube clips that no longer reflect reality. We file de-indexing requests, escalate platform cases, push positive results up, and report what cleared and what didn't. Without theatre.",
    bullets: [
      "News article de-indexing requests",
      "Reddit & forum cleanup requests",
      "YouTube & TikTok takedown requests",
      "Google search result de-indexing",
      "Content farm takedown reports",
      "Platform escalations and case files",
    ],
    demo: <SearchCleanupDemo />,
    demoOnRight: false,
  },
  {
    id: "review-management",
    index: "03",
    kicker: "Reviews",
    title: "Quiet work, week after week",
    body: "The day-to-day discipline that lifts and holds your rating over months, not days. Monitored review streams across Google, Trustpilot, Facebook, and the App Store. On-brand responses written in your voice. Fake-review flagging through the right channels. A quarterly read on the trends moving your rating.",
    bullets: [
      "Daily Google review monitoring",
      "Fake & policy-violating review cases",
      "On-brand response playbooks",
      "Trustpilot & App Store coverage",
      "Rating-trend & sentiment reports",
      "Quarterly category benchmarks",
    ],
    demo: <ReviewPulseDemo />,
    demoOnRight: true,
  },
];

export default function ReputationPage() {
  return (
    <>
      <script type="application/ld+json">{JSON_LD_STRING}</script>
      <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
          <ReputationHero
            eyebrow={service.eyebrow.split("·")[1]?.trim() ?? "Protect"}
            heading={
              <>
                Control your narrative.
                <br />
                Protect your reputation.
              </>
            }
            lede="PR placements, search-result de-indexing, and the day-to-day review work that keeps your name where you want it. Quiet, consistent work across every channel your customers check before they ever land on your site."
          />

          <div className="mt-28 lg:mt-36 flex flex-col gap-28 lg:gap-40">
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-12 xl:gap-x-20 items-start"
              >
                <div
                  className={`lg:col-span-5 lg:sticky lg:top-32 ${
                    s.demoOnRight ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono">
                    {s.index} · {s.kicker}
                  </p>
                  <h2
                    id={`${s.id}-title`}
                    className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.75rem,2.8vw,2.5rem)]"
                  >
                    {s.title}
                  </h2>
                  <p className="mt-5 text-[15px] leading-[1.65] text-ink-body max-w-[480px]">
                    {s.body}
                  </p>
                  <ul className="mt-7 grid grid-cols-1 gap-y-2.5 max-w-[480px]">
                    {s.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-body"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-ink shrink-0"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`lg:col-span-7 ${
                    s.demoOnRight ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {s.demo}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-32 lg:mt-40">
            <FooterCta />
          </div>
        </div>
      </div>
    </>
  );
}
