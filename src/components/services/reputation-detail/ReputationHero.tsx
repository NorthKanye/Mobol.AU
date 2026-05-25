"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  eyebrow: string;
  heading: React.ReactNode;
  lede: React.ReactNode;
};

export default function ReputationHero({ eyebrow, heading, lede }: Props) {
  return (
    <header className="mx-auto w-full max-w-[820px] text-center">
      <motion.p
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="mt-5 text-ink font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.25rem,4.6vw,4rem)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
      >
        {heading}
      </motion.h1>
      <motion.p
        className="mx-auto mt-7 max-w-[640px] text-[17px] leading-[1.55] text-ink-body"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.18 }}
      >
        {lede}
      </motion.p>
    </header>
  );
}
