"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero for /services/branding — text-only.
 *
 * The six animated sections below carry all the visual weight; the
 * hero is a calm, large-type opener so the page doesn't compete with
 * itself. Mirrors the typographic scale of the home-page hero but
 * scoped tighter on max width so the headline lands as a statement.
 */
export default function BrandingHero() {
  return (
    <section className="max-w-[920px]">
      <motion.p
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        Identify
      </motion.p>
      <motion.h1
        className="mt-6 text-ink font-semibold tracking-tighter-display leading-[0.96] text-[clamp(2.5rem,7vw,5.25rem)] max-w-[14ch]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease, delay: 0.05 }}
      >
        One language,
        <br />
        every surface.
      </motion.h1>
      <motion.p
        className="mt-7 text-[18px] leading-[1.55] text-ink-body max-w-[640px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease, delay: 0.18 }}
      >
        Marks, wordmarks, palettes, type, voice, and applied identity systems — a coherent visual language that scales from favicon to billboard. Built to ship, not just to win awards in a deck.
      </motion.p>
    </section>
  );
}
