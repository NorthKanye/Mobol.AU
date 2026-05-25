"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { PALETTE } from "../constants";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

type Readout = { name: string; hex: string; role: string };
const EMPTY_READOUT: Readout = { name: "—", hex: "", role: "" };

/**
 * Section 03 — Palette (standalone).
 *
 * Three beats:
 *  1. Swatches pop in (.in) one by one over ~1s
 *  2. Walkthrough — each swatch is highlighted (.active) with the
 *     readout panel naming the role
 *  3. New beat for the dedicated section: an applied-to-UI panel
 *     (button + chip + badge) fades in alongside the swatches with
 *     the palette colours actually applied to interface chrome.
 *
 * Reduced motion: fully-revealed state with the applied panel visible.
 */
export default function BrandingPaletteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [shown, setShown] = useState(reduce ? PALETTE.length : 0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [readout, setReadout] = useState<Readout>(EMPTY_READOUT);
  const [showApplied, setShowApplied] = useState(reduce);

  const phases = useMemo<TimelinePhase[]>(() => {
    const list: TimelinePhase[] = [];
    // 1. Pop swatches in one at a time
    for (let i = 1; i <= PALETTE.length; i += 1) {
      list.push({
        duration: 150,
        tick: () => {
          setShown(i);
          setActiveIdx(-1);
          setReadout(EMPTY_READOUT);
          setShowApplied(false);
        },
      });
    }
    list.push({ duration: 400, tick: () => {} });

    // 2. Walk through each swatch — highlight + readout
    PALETTE.forEach((swatch, i) => {
      list.push({
        duration: 600,
        tick: () => {
          setActiveIdx(i);
          setReadout({ name: swatch.name, hex: swatch.hex, role: swatch.role });
        },
      });
    });

    // 3. Applied beat — clear highlight, show UI mock
    list.push({
      duration: 400,
      tick: () => {
        setActiveIdx(-1);
        setReadout(EMPTY_READOUT);
      },
    });
    list.push({ duration: 3000, tick: () => setShowApplied(true) });

    // Reset
    list.push({
      duration: 0,
      tick: () => {
        setShown(0);
        setActiveIdx(-1);
        setReadout(EMPTY_READOUT);
        setShowApplied(false);
      },
    });

    return list;
  }, []);

  usePausedTimeline(ref, phases);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Six brand colour swatches popping in, each named with hex and role, then applied to a small UI panel"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#fafaf9] border border-black/[0.04]"
    >
      <div className="brand-window absolute inset-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 p-8 lg:p-10">
        {/* Left: swatches grid */}
        <div className="flex flex-col min-h-0">
          <div
            className="pal-grid flex-1 grid gap-2 min-h-0"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
            }}
          >
            {PALETTE.map((s, i) => {
              const cls = [
                "swatch relative rounded-[10px]",
                i < shown && "in",
                i === activeIdx && "active",
                s.name === "Paper" && "is-paper",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div
                  key={s.hex}
                  className={cls}
                  style={{ backgroundColor: s.hex }}
                  data-name={s.name}
                  data-hex={s.hex}
                />
              );
            })}
          </div>

          {/* Readout strip */}
          <div className="flex items-baseline gap-3 pt-4 mt-4 border-t border-dashed border-border">
            <span
              className="text-ink"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "-0.01em",
              }}
            >
              {readout.name}
            </span>
            <span
              className="text-ink-3 tabular-nums ml-auto"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            >
              {readout.hex}
            </span>
            <span
              className="text-ink-2"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                minWidth: "60px",
                textAlign: "right",
              }}
            >
              {readout.role}
            </span>
          </div>
        </div>

        {/* Right: applied-to-UI panel */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ opacity: showApplied ? 1 : 0.08, y: showApplied ? 0 : 8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col gap-4 justify-center"
        >
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-3 font-mono">
            applied
          </div>

          {/* Mobol button — Ink + Paper */}
          <button
            type="button"
            tabIndex={-1}
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-default"
            style={{ backgroundColor: PALETTE[0].hex, color: PALETTE[1].hex }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: PALETTE[2].hex }}
            />
            Start a project
          </button>

          {/* Chip — Marigold highlight */}
          <div
            className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
            style={{ backgroundColor: PALETTE[3].hex, color: PALETTE[0].hex }}
          >
            New · v3.2
          </div>

          {/* Badge — Slate text on Mist */}
          <div
            className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-md text-[12px]"
            style={{
              backgroundColor: PALETTE[5].hex,
              color: PALETTE[4].hex,
              fontFamily: "var(--font-mono)",
            }}
          >
            <span
              className="inline-block w-1 h-1 rounded-full"
              style={{ backgroundColor: PALETTE[4].hex }}
            />
            mobol.com.au
          </div>
        </motion.div>
      </div>
    </div>
  );
}
