"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  open: boolean;
  onClick: () => void;
};

/**
 * Hamburger / X morph button — two bars that animate into an X when open.
 * Accessible name + state mirror the MobileMenu it controls.
 */
export default function HamburgerButton({ open, onClick }: Props) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.22;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="
        relative inline-flex h-12 w-12 items-center justify-center
        rounded-full
        text-ink
        transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
      "
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      {/* Two bars in a 16x12 box. Each bar is 16px wide, 1.5px tall. */}
      <span className="relative block h-3 w-4" aria-hidden="true">
        <motion.span
          className="absolute left-0 top-0 block h-[1.5px] w-4 rounded-full bg-current"
          initial={false}
          animate={
            open
              ? { y: 5, rotate: 45 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute left-0 bottom-0 block h-[1.5px] w-4 rounded-full bg-current"
          initial={false}
          animate={
            open
              ? { y: -5, rotate: -45 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </button>
  );
}
