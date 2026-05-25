"use client";

import { motion } from "motion/react";

const capabilities = [
  "Username claims",
  "Account recovery",
  "Day-to-day management",
  "Brand deals",
  "Verification prep",
  "Impersonation defence",
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function SocialHero() {
  return (
    <header className="max-w-[760px]">
      <motion.p
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        Social media
      </motion.p>
      <motion.h1
        className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.4vw,3.25rem)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
      >
        Hands on,
        <br />
        in the background.
      </motion.h1>
      <motion.p
        className="mt-6 text-[16px] leading-[1.6] text-ink-body max-w-[620px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.18 }}
      >
        Mobol runs the social work most teams don&apos;t have hours for &mdash;
        claiming the right username, walking suspended accounts through the
        appeals process, looking after the day-to-day, and preparing
        verification applications properly. Quiet work, done in your voice,
        from Perth.
      </motion.p>
      <motion.ul
        className="mt-7 flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
        }}
      >
        {capabilities.map((capability) => (
          <motion.li
            key={capability}
            className="px-3.5 py-1.5 rounded-full text-[12px] text-ink-2 bg-surface border border-black/[0.07]"
            variants={{
              hidden: { opacity: 0, y: 8, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.4, ease }}
          >
            {capability}
          </motion.li>
        ))}
      </motion.ul>
    </header>
  );
}
