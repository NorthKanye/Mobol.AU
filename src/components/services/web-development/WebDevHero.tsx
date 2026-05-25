"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export default function WebDevHero() {
  return (
    <header className="max-w-[760px]">
      <motion.p
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        Web development
      </motion.p>
      <motion.h1
        className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.4vw,3.25rem)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
      >
        Websites your team
        <br />
        can actually use.
      </motion.h1>
      <motion.p
        className="mt-6 text-[16px] leading-[1.6] text-ink-body max-w-[620px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.18 }}
      >
        Fast websites from a team in Perth, working with clients across
        Australia. We design the public site and the editing experience
        together, then ship it on the right setup for your team. WordPress,
        Shopify, or a custom CMS when the usual tools don&apos;t fit.
      </motion.p>
    </header>
  );
}
