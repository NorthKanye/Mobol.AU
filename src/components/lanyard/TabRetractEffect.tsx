"use client";

import { useEffect } from "react";

/**
 * Drives the nav tab's scroll-linked retraction. Writes `--tab-pull` (0..180px)
 * onto <html> so `.tab-retract` (in PillNav) translates the tab and slot up
 * as the badge scrolls toward them.
 *
 * No rendering. The lanyard itself lives inside <Hero/> and scrolls naturally
 * with the section — there's no `--lanyard-pull` or `past-hero` machinery
 * here anymore.
 *
 * Threshold derivation: the moment the badge's pill clip top edge reaches the
 * tab's bottom edge marks `tabStart`. From the Lanyard.tsx geometry, the pill
 * clip top sits at element-y (180+10−12)·s = 178·s, and total un-rotated
 * lanyard height is (180+10+380)·s = 570·s, so the ratio 178/570 holds across
 * scales. We measure the rendered lanyard once with sway animations paused
 * (the 15° tilt would otherwise inflate getBoundingClientRect height by
 * 40–60px and push the trigger far too late).
 */
export default function TabRetractEffect() {
  useEffect(() => {
    // Lanyard is hidden below sm (640px); skip the scroll listener there so
    // we don't write `--tab-pull` for a tab the user can't see motivated.
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lanyard = document.querySelector<HTMLElement>(
      "[data-lanyard-root]",
    );
    if (!lanyard) return;

    const PILL_CLIP_RATIO = 178 / 570;
    const LAYER_TO_TAB_OFFSET = 20;
    const TAB_TRAVEL = 180;
    const TAB_RANGE = 80;

    let tabStart = 158;
    let lastScroll = -1;
    let lastApplied = -1;
    let rafId: number | null = null;

    const apply = () => {
      rafId = null;
      const y = lastScroll;
      if (y === lastApplied) return;
      lastApplied = y;

      const tabPull = Math.min(
        TAB_TRAVEL,
        Math.max(0, ((y - tabStart) / TAB_RANGE) * TAB_TRAVEL),
      );
      document.documentElement.style.setProperty("--tab-pull", `${tabPull}px`);
    };

    const schedule = () => {
      lastScroll = window.scrollY;
      if (rafId === null) rafId = requestAnimationFrame(apply);
    };

    const measure = () => {
      const animated = [
        lanyard,
        ...Array.from(
          lanyard.querySelectorAll<HTMLElement>(
            ".animate-lanyard-badge, .animate-lanyard-back",
          ),
        ),
      ];
      const restore = animated.map(
        (el) => [el, el.style.animation] as const,
      );
      for (const el of animated) el.style.animation = "none";
      void lanyard.offsetHeight;
      const rect = lanyard.getBoundingClientRect();
      for (const [el, prev] of restore) el.style.animation = prev;
      // tabStart: the scrollY at which the badge's pill clip top edge visually
      // meets the tab's bottom edge (viewport y=140). Lanyard top is at
      // element-y=120 in document coords (anchored at top:120 inside Hero,
      // which starts at document y=0), so tabStart = 120 + 178·s − 140 =
      // rect.height·(178/570) − 20.
      tabStart = Math.max(0, rect.height * PILL_CLIP_RATIO - LAYER_TO_TAB_OFFSET);
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty("--tab-pull");
    };
  }, []);

  return null;
}
