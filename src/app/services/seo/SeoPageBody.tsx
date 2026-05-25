"use client";

import { motion } from "motion/react";
import ServiceSection from "@/components/services/ServiceSection";
import FooterCta from "@/components/footer/FooterCta";
import KeywordResearchMockup from "@/components/services/seo/KeywordResearchMockup";
import OnPageMockup from "@/components/services/seo/OnPageMockup";
import ArticlePublishingMockup from "@/components/services/seo/ArticlePublishingMockup";
import BacklinksMockup from "@/components/services/seo/BacklinksMockup";

const ease = [0.16, 1, 0.3, 1] as const;

export default function SeoPageBody() {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        {/* Hero — text only, animate (above the fold) */}
        <header className="max-w-[820px]">
          <motion.p
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Search & SEO
          </motion.p>
          <motion.h1
            className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2.5rem,4.5vw,4.5rem)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            Found,
            <br />
            and worth the click.
          </motion.h1>
          <motion.p
            className="mt-6 text-[17px] leading-[1.55] text-ink-body max-w-[640px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
          >
            Technical SEO, content strategy, and ranking work for the queries
            your customers actually search. From a Perth team, working with
            clients across Australia.
          </motion.p>
        </header>

        {/* 4 ServiceSection blocks, alternating demoOnLeft */}
        <div className="mt-32 lg:mt-40 space-y-32 lg:space-y-40">
          <ServiceSection
            category="Research"
            title="Find the queries worth winning"
            body="Keyword research that maps real commercial intent. Not just what's easy to rank for."
            bullets={[
              "Volume, difficulty & CPC at a glance",
              "Buyer-intent over vanity terms",
              "Local AU & global breakdown",
              "Competitor gap mining",
            ]}
            demo={<KeywordResearchMockup />}
            demoOnLeft={false}
          />
          <ServiceSection
            category="Optimize"
            title="Make every page easy for search engines to read"
            body="We tidy the signals search engines use to understand a page: the title, search preview, page address, image labels, and links to related pages."
            bullets={[
              "Clear page titles and search previews",
              "Correct page address for duplicate pages",
              "Structured details added where useful",
              "Internal links that guide people and crawlers",
            ]}
            demo={<OnPageMockup />}
            demoOnLeft={true}
          />
          <ServiceSection
            category="Publish"
            title="Ship content that earns its reach"
            body="An editorial cadence that turns research into ranked pages. Not blog posts nobody reads."
            bullets={[
              "Editorial calendar",
              "Long-form pieces with depth",
              "On-brand voice & tone",
              "Distribution & repurposing",
            ]}
            demo={<ArticlePublishingMockup />}
            demoOnLeft={false}
          />
          <ServiceSection
            category="Earn links"
            title="Compound authority, one link at a time"
            body="Outreach and digital PR aimed at the domains that influence rankings. Measured by referring authority, not raw counts."
            bullets={[
              "High-DA referring domains",
              "Australian press placements",
              "Resource & citation outreach",
              "Link-worthy content design",
            ]}
            demo={<BacklinksMockup />}
            demoOnLeft={true}
          />
        </div>

        <div className="mt-32 lg:mt-40">
          <FooterCta />
        </div>
      </div>
    </div>
  );
}
