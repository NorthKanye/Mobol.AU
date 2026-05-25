"use client";

import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";
import FooterCta from "@/components/footer/FooterCta";
import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  /** Title (h1). Defaults to service.label but pages can pass a richer headline with line breaks. */
  heading?: ReactNode;
  /** Lede paragraph below the h1. Defaults to service.shortDescription. */
  lede?: ReactNode;
  /** Hero visual on the right side — usually the matching Mockup component. */
  visual: ReactNode;
  /** Small uppercase eyebrow above the h1. Defaults to service.eyebrow's right-of-dash label. */
  eyebrow?: string;
  /** Section heading for the content block. */
  blockTitle: string;
  /** Lede paragraph for the content block. */
  blockBody: string;
  /** 4–6 short bullets describing what the service includes. */
  bullets: string[];
};

const ease = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, amount: 0.25 } as const;

export default function PlaceholderServicePage({
  service,
  heading,
  lede,
  visual,
  eyebrow,
  blockTitle,
  blockBody,
  bullets,
}: Props) {
  // Default eyebrow strips the order number from "03 — Rank" → "Rank"
  const eyebrowText = eyebrow ?? service.eyebrow.split("—")[1]?.trim() ?? service.label;

  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        {/* Hero — 2-column on lg+, stacked on mobile */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-12 xl:gap-x-20 items-center">
          <div className="lg:col-span-7 lg:order-2">
            <Fragment>{visual}</Fragment>
          </div>
          <div className="lg:col-span-5 lg:order-1 max-w-[620px]">
            <motion.p
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {eyebrowText}
            </motion.p>
            <motion.h1
              className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.4vw,3.25rem)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
            >
              {heading ?? service.label}
            </motion.h1>
            <motion.p
              className="mt-6 text-[16px] leading-[1.6] text-ink-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.18 }}
            >
              {lede ?? service.shortDescription}
            </motion.p>
          </div>
        </header>

        {/* Content block — heading + body + bullets */}
        <section className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 xl:gap-x-20">
          <div className="lg:col-span-5">
            <motion.h2
              className="text-ink font-semibold leading-[1.1] tracking-display text-[clamp(1.5rem,2.4vw,2rem)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, ease }}
            >
              {blockTitle}
            </motion.h2>
          </div>
          <div className="lg:col-span-7">
            <motion.p
              className="text-[15px] leading-[1.65] text-ink-body max-w-[640px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, ease, delay: 0.05 }}
            >
              {blockBody}
            </motion.p>
            <motion.ul
              className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 max-w-[640px]"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.18 },
                },
              }}
            >
              {bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-body"
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, ease }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-ink shrink-0"
                  />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <div className="mt-32 lg:mt-40">
          <FooterCta />
        </div>
      </div>
    </div>
  );
}
