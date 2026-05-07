"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated macOS-style browser mockup. A cursor builds a website over a
 * 15-second loop: clicks Hero → wireframe hero appears, clicks Cards →
 * wireframe cards appear (staggered), clicks Styling → hero darkens and
 * cards gain header strips, clicks Text → text shapes fill in, clicks
 * Publish → all wireframe layers fade out and a polished site fades in.
 *
 * Motion is CSS-only (`@keyframes` in globals.css). This component just
 * renders the DOM, wires an IntersectionObserver to pause when offscreen,
 * and bypasses the animation under prefers-reduced-motion (rendering the
 * polished final state statically).
 *
 * Positions are percentages of the outer mockup so the scene scales
 * cleanly with viewport width — the 4:3 aspect ratio keeps proportions
 * locked. The cursor is a sibling of the editor body (z-30) so it can
 * travel freely over the sidebar and chrome bar without clipping.
 */
export default function BuilderMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    if (mq.matches) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("builder-paused", !entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  const cursorClass = reducedMotion ? "hidden" : "animate-builder-cursor";
  const publishClass = reducedMotion ? "" : "animate-builder-publish";
  const sidebarHeroClass = reducedMotion ? "" : "animate-builder-sidebar-hero";
  const sidebarCardsClass = reducedMotion
    ? ""
    : "animate-builder-sidebar-cards";
  const sidebarStylingClass = reducedMotion
    ? ""
    : "animate-builder-sidebar-styling";
  const sidebarTextClass = reducedMotion ? "" : "animate-builder-sidebar-text";
  const heroWireClass = reducedMotion ? "opacity-0" : "animate-builder-hero";
  const card1Class = reducedMotion ? "opacity-0" : "animate-builder-card-1";
  const card2Class = reducedMotion ? "opacity-0" : "animate-builder-card-2";
  const card3Class = reducedMotion ? "opacity-0" : "animate-builder-card-3";
  const stylingClass = reducedMotion ? "opacity-0" : "animate-builder-styling";
  const textOverlayClass = reducedMotion ? "opacity-0" : "animate-builder-text";
  const polishClass = reducedMotion ? "" : "animate-builder-polish";
  const polishStyle = reducedMotion ? { opacity: 1 } : undefined;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated diagram of a cursor building a website inside a browser window"
      className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative bg-surface border border-black/[0.04]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Browser chrome bar */}
      <div className="absolute inset-x-0 top-0 h-[9%] flex items-center px-3 bg-[#f6f5f2] border-b border-border z-20">
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span
          className="w-2 h-2 rounded-full bg-[#febc2e] ml-1.5"
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full bg-[#28c840] ml-1.5"
          aria-hidden="true"
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 h-[60%] min-w-[35%] max-w-[45%] rounded-full bg-border/60 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-[clamp(8px,1vw,11px)] text-ink-2">mobol.co</span>
        </div>

        <div
          aria-hidden="true"
          className={`ml-auto h-[70%] px-2.5 rounded-full bg-ink text-surface text-[clamp(8px,1vw,10px)] font-medium flex items-center justify-center ${publishClass}`}
        >
          Publish
        </div>
      </div>

      {/* Editor body */}
      <div className="absolute inset-x-0 top-[9%] bottom-0">
        {/* Sidebar — 4 component chips, each animates dim on its click moment */}
        <div
          className="absolute inset-y-0 left-0 w-[14%] bg-[#faf9f7] border-r border-border flex flex-col gap-1.5 py-3 px-1.5"
          aria-hidden="true"
        >
          <div
            className={`h-[14%] rounded-[4px] bg-border/80 flex items-center justify-center text-[clamp(7px,0.8vw,9px)] text-ink-2 ${sidebarHeroClass}`}
          >
            Hero
          </div>
          <div
            className={`h-[14%] rounded-[4px] bg-border/80 flex items-center justify-center text-[clamp(7px,0.8vw,9px)] text-ink-2 ${sidebarCardsClass}`}
          >
            Cards
          </div>
          <div
            className={`h-[14%] rounded-[4px] bg-border/80 flex items-center justify-center text-[clamp(7px,0.8vw,9px)] text-ink-2 ${sidebarStylingClass}`}
          >
            Style
          </div>
          <div
            className={`h-[14%] rounded-[4px] bg-border/80 flex items-center justify-center text-[clamp(7px,0.8vw,9px)] text-ink-2 ${sidebarTextClass}`}
          >
            Text
          </div>
        </div>

        {/* Canvas — stacked layers fade in additively as the cursor clicks
           each chip. Final polish layer crossfades over them after Publish. */}
        <div
          className="absolute inset-y-0 left-[14%] right-0 bg-bg overflow-hidden"
          aria-hidden="true"
        >
          {/* Stage 1 — wireframe hero (border only) */}
          <div
            className={`absolute left-[5%] right-[5%] top-[6%] h-[22%] rounded-[4px] bg-surface border border-border opacity-0 ${heroWireClass}`}
          />

          {/* Stage 2 — wireframe cards row (border only, staggered) */}
          <div className="absolute left-[5%] right-[5%] top-[34%] h-[18%] flex gap-[3%]">
            <div
              className={`flex-1 rounded-[4px] bg-surface border border-border opacity-0 ${card1Class}`}
            />
            <div
              className={`flex-1 rounded-[4px] bg-surface border border-border opacity-0 ${card2Class}`}
            />
            <div
              className={`flex-1 rounded-[4px] bg-surface border border-border opacity-0 ${card3Class}`}
            />
          </div>

          {/* Stage 3 — styling overlay (dark hero fill + card header strips).
             Sits ON TOP of the wireframes since opacity 1 covers them. */}
          <div className={`absolute inset-0 opacity-0 ${stylingClass}`}>
            <div className="absolute left-[5%] right-[5%] top-[6%] h-[22%] rounded-[4px] bg-ink" />
            <div className="absolute left-[5%] right-[5%] top-[34%] h-[18%] flex gap-[3%]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[4px] bg-surface border border-border relative overflow-hidden"
                >
                  <div className="absolute left-[10%] right-[55%] top-[18%] h-[18%] rounded-[2px] bg-ink/85" />
                </div>
              ))}
            </div>
          </div>

          {/* Stage 4 — text overlay (headline + sub on hero, body lines in
             cards, paragraph below cards). Sits on top of styling. */}
          <div className={`absolute inset-0 opacity-0 ${textOverlayClass}`}>
            {/* Hero text shapes */}
            <div className="absolute left-[10%] top-[12%] h-[3%] w-[18%] rounded-full bg-surface/40" />
            <div className="absolute left-[10%] top-[17%] h-[4%] w-[55%] rounded-[2px] bg-surface" />
            <div className="absolute left-[10%] top-[23%] h-[2%] w-[40%] rounded-full bg-surface/50" />

            {/* Card body lines (3 cards) */}
            <div className="absolute left-[5%] right-[5%] top-[34%] h-[18%] flex gap-[3%]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 relative">
                  <div className="absolute left-[10%] top-[52%] h-[8%] w-[60%] rounded-full bg-ink/25" />
                  <div className="absolute left-[10%] top-[68%] h-[8%] w-[40%] rounded-full bg-ink/15" />
                </div>
              ))}
            </div>

            {/* Paragraph block beneath cards */}
            <div className="absolute left-[5%] top-[58%] h-[2.5%] w-[42%] rounded-full bg-ink/25" />
            <div className="absolute left-[5%] top-[63%] h-[2.5%] w-[30%] rounded-full bg-ink/15" />
          </div>

          {/* Stage 5 — polished site (after Publish). Final refined version
             with CTA pill. Crossfades over all earlier layers. */}
          <div
            className={`absolute inset-0 opacity-0 ${polishClass}`}
            style={polishStyle}
          >
            {/* Polished hero — dark fill with eyebrow, headline, sub, CTA */}
            <div className="absolute left-[5%] right-[5%] top-[6%] h-[22%] rounded-[4px] bg-ink overflow-hidden">
              <div className="absolute left-[6%] top-[18%] h-[8%] w-[14%] rounded-full bg-surface/30" />
              <div className="absolute left-[6%] top-[36%] h-[18%] w-[55%] rounded-[2px] bg-surface" />
              <div className="absolute left-[6%] top-[60%] h-[8%] w-[40%] rounded-full bg-surface/40" />
              <div className="absolute left-[6%] bottom-[14%] h-[18%] w-[20%] rounded-full bg-surface" />
            </div>

            {/* Polished cards */}
            <div className="absolute left-[5%] right-[5%] top-[34%] h-[18%] flex gap-[3%]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[4px] bg-surface border border-border relative overflow-hidden"
                >
                  <div className="absolute left-[10%] right-[55%] top-[18%] h-[18%] rounded-[2px] bg-ink/85" />
                  <div className="absolute left-[10%] top-[52%] h-[8%] w-[60%] rounded-full bg-ink/25" />
                  <div className="absolute left-[10%] top-[68%] h-[8%] w-[40%] rounded-full bg-ink/15" />
                </div>
              ))}
            </div>

            {/* Body block beneath cards */}
            <div className="absolute left-[5%] top-[58%] h-[3%] w-[40%] rounded-full bg-ink/25" />
            <div className="absolute left-[5%] top-[64%] h-[3%] w-[28%] rounded-full bg-ink/15" />

            {/* CTA pill */}
            <div className="absolute left-[5%] bottom-[8%] h-[7%] w-[20%] rounded-full bg-ink" />
          </div>
        </div>
      </div>

      {/* Cursor — sibling of editor body so it travels over sidebar and
         chrome bar without clipping. z-30 puts it above chrome's z-20. */}
      <svg
        viewBox="0 0 16 20"
        className={`absolute left-0 top-0 w-[5.5%] h-auto pointer-events-none z-30 ${cursorClass}`}
        aria-hidden="true"
      >
        <path
          d="M1 1 L7.5 16 L10 10 L16 7.5 Z"
          fill="#111111"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
