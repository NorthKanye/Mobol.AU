"use client";

import Link from "next/link";
import { motion } from "motion/react";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function ArrowShort() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-0.5"
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

export default function FooterCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
          Say hi
        </p>
        <a
          href="mailto:hello@mobol.com.au"
          id="footer-cta-heading"
          className="mt-3 inline-block text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.5rem,2.6vw,2.25rem)] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink rounded-sm"
        >
          hello@mobol.com.au
        </a>
      </div>

      <Link
        href="/contact"
        className="group inline-flex w-fit items-center gap-2.5 rounded-full bg-ink text-surface h-11 pl-5 pr-4 text-[14px] font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
      >
        Send a message
        <ArrowShort />
      </Link>
    </motion.div>
  );
}
