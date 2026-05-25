"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

/**
 * Section 06 — Applied identity, one mark across six surfaces.
 *
 * A single Ember mark (motion.div with layoutId="applied-mark") travels
 * via Motion's shared-layout animation across six different CSS/SVG
 * surface mockups — favicon, address bar, social avatar, business card,
 * exterior sign, and OG card. Each surface mounts via AnimatePresence;
 * Motion bridges the layoutId-tagged mark between them, producing a
 * single continuous traversal instead of six hard cuts.
 *
 * Reduced motion: renders all six surfaces stacked in a static grid
 * with the mark placed in each — no morph, no AnimatePresence.
 */

const SURFACES = [
  "favicon",
  "address-bar",
  "avatar",
  "card",
  "sign",
  "og",
] as const;
type SurfaceKey = (typeof SURFACES)[number];

const SURFACE_LABEL: Record<SurfaceKey, string> = {
  favicon: "Favicon · 32 × 32",
  "address-bar": "Browser · address bar",
  avatar: "Social · 1:1 avatar",
  card: "Business card · 3.5 × 2",
  sign: "Exterior · vertical sign",
  og: "Open Graph · 1200 × 630",
};

const transition = { type: "spring", stiffness: 220, damping: 28, mass: 0.9 } as const;

function MarkDot({ size, className }: { size: number; className?: string }) {
  return (
    <motion.div
      layoutId="applied-mark"
      transition={transition}
      className={`rounded-full ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--color-accent)",
      }}
    />
  );
}

function Wordmark({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <span
      className={`text-ink ${className ?? ""}`}
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        fontSize: size,
        lineHeight: 1,
      }}
    >
      Mobol
    </span>
  );
}

/* ─── Surface mockups ─────────────────────────────────────────────── */

function FaviconSurface() {
  return (
    <motion.div
      key="favicon"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      {/* Browser chrome + active tab with favicon */}
      <div className="w-full max-w-[420px] rounded-lg shadow-[0_18px_40px_-22px_rgba(0,0,0,0.25)] bg-surface border border-border overflow-hidden">
        <div className="h-7 px-2 flex items-end gap-1 bg-[#ececec]">
          <div className="w-32 h-6 rounded-t-md bg-surface border border-border border-b-0 flex items-center gap-1.5 px-2">
            <MarkDot size={9} />
            <span
              className="text-ink truncate"
              style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500 }}
            >
              Mobol — Identity
            </span>
          </div>
          <div className="w-20 h-5 rounded-t-md bg-[#e0e0e0]" />
          <div className="w-20 h-5 rounded-t-md bg-[#e0e0e0]" />
        </div>
        <div className="px-3 py-2 border-t border-border bg-surface flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
          <div className="flex-1 h-5 rounded-full bg-[#f5f5f4] px-2 flex items-center gap-1.5">
            <span
              className="text-ink-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
            >
              mobol.com.au
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddressBarSurface() {
  return (
    <motion.div
      key="address-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div className="w-full max-w-[460px] h-12 rounded-full bg-[#f5f5f4] border border-border flex items-center gap-3 px-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.2)]">
        <MarkDot size={14} />
        <span
          className="text-ink flex-1 truncate"
          style={{ fontFamily: "var(--font-mono)", fontSize: "14px", letterSpacing: "0.005em" }}
        >
          mobol.com.au
        </span>
        <span
          className="text-ink-3"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
        >
          secure
        </span>
      </div>
    </motion.div>
  );
}

function AvatarSurface() {
  return (
    <motion.div
      key="avatar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div className="w-full max-w-[300px] flex flex-col items-center gap-3">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-ink)" }}
        >
          <MarkDot size={42} />
        </div>
        <div className="text-center">
          <Wordmark size={16} />
          <div
            className="text-ink-3 mt-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em" }}
          >
            @mobol · Perth
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BusinessCardSurface() {
  return (
    <motion.div
      key="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div
        className="relative w-full max-w-[360px] rounded-md shadow-[0_24px_48px_-22px_rgba(0,0,0,0.35)] p-5 flex flex-col justify-between"
        style={{ aspectRatio: "1.75 / 1", backgroundColor: "var(--color-ink)", color: "var(--color-paper)" }}
      >
        <div className="flex items-center gap-2">
          <MarkDot size={14} />
          <span
            style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.04em" }}
          >
            Mobol
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p
              style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600 }}
            >
              Kyle Oakley
            </p>
            <p
              className="opacity-60"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em" }}
            >
              Founder · Identity & Build
            </p>
          </div>
          <p
            className="opacity-60"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em" }}
          >
            mobol.com.au
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SignSurface() {
  return (
    <motion.div
      key="sign"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div
        className="relative h-full max-h-[320px] flex flex-col items-center justify-between rounded-md py-8 px-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
        style={{
          aspectRatio: "0.55 / 1",
          backgroundColor: "var(--color-ink)",
          color: "var(--color-paper)",
        }}
      >
        <MarkDot size={64} />
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "-0.04em",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Mobol
        </div>
        <span
          className="opacity-50 text-center"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase" }}
        >
          Studio
        </span>
      </div>
    </motion.div>
  );
}

function OgSurface() {
  return (
    <motion.div
      key="og"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div
        className="relative w-full max-w-[480px] rounded-lg overflow-hidden shadow-[0_24px_48px_-20px_rgba(0,0,0,0.3)]"
        style={{ aspectRatio: "1200 / 630", backgroundColor: "var(--color-ink)", color: "var(--color-paper)" }}
      >
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <MarkDot size={18} />
            <Wordmark size={20} className="text-paper" />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(16px, 2.4vw, 26px)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              Designed to ship.
              <br />
              Documented to extend.
            </p>
            <p
              className="mt-2 opacity-60"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em" }}
            >
              mobol.com.au
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const SURFACE_COMPONENT: Record<SurfaceKey, () => React.ReactElement> = {
  favicon: FaviconSurface,
  "address-bar": AddressBarSurface,
  avatar: AvatarSurface,
  card: BusinessCardSurface,
  sign: SignSurface,
  og: OgSurface,
};

/* ─── Section component ───────────────────────────────────────────── */

export default function BrandingAppliedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  const phases = useMemo<TimelinePhase[]>(
    () =>
      SURFACES.map((_, i) => ({
        duration: i === SURFACES.length - 1 ? 3400 : 2200,
        tick: () => setActiveIdx(i),
      })),
    [],
  );

  usePausedTimeline(ref, phases);

  if (reduce) {
    return <ReducedAppliedGrid />;
  }

  const key = SURFACES[activeIdx];
  const SurfaceComponent = SURFACE_COMPONENT[key];

  return (
    <div
      role="img"
      aria-label="One Ember mark traveling across six surfaces — favicon, browser bar, social avatar, business card, exterior sign, and Open Graph share card"
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#fafaf9] border border-black/[0.04]"
    >
      <AnimatePresence>
        <SurfaceComponent key={key} />
      </AnimatePresence>

      {/* Surface label + pager */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
        <span
          className="text-ink-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {SURFACE_LABEL[key]}
        </span>
        <div className="flex items-center gap-1.5">
          {SURFACES.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === activeIdx ? "w-5 bg-ink" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReducedAppliedGrid() {
  return (
    <div
      role="img"
      aria-label="Six brand surface mockups arranged in a grid — the Ember mark appearing on a favicon, browser bar, avatar, card, sign, and OG card"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#fafaf9] border border-black/[0.04] p-4"
    >
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
        {SURFACES.map((key) => (
          <div
            key={key}
            className="relative rounded-lg bg-surface border border-border flex items-center justify-center"
          >
            <div
              className="rounded-full"
              style={{ width: 24, height: 24, backgroundColor: "var(--color-accent)" }}
            />
            <span
              className="absolute bottom-1.5 left-2 text-ink-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
