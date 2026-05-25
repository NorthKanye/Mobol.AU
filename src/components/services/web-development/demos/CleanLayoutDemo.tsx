"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const ease = [0.16, 1, 0.3, 1] as const;

type Messy = {
  x: number;
  y: number;
  rotate: number;
  scaleX?: number;
  scale?: number;
};

type Piece = {
  id: string;
  style: CSSProperties;
  className: string;
  messy: Messy;
  children?: ReactNode;
};

// Every piece is positioned at its CLEAN coordinates inside the fixed-height
// canvas. The "messy" state is expressed purely as a transform offset, so the
// animation never triggers layout — the canvas height stays constant and the
// page below never shifts.
const CLEAN = { x: 0, y: 0, rotate: 0, scaleX: 1, scale: 1 } as const;

const pieces: Piece[] = [
  {
    id: "logo",
    style: { left: "6%", top: 18, width: 22, height: 22 },
    className: "rounded-[6px] bg-ink",
    messy: { x: -7, y: -5, rotate: -9, scale: 0.9 },
  },
  {
    id: "nav1",
    style: { left: "70%", top: 27, width: "8%", height: 6 },
    className: "rounded-full bg-[#e0e0e0]",
    messy: { x: 5, y: 5, rotate: 7, scaleX: 1.35 },
  },
  {
    id: "nav2",
    style: { left: "80%", top: 27, width: "8%", height: 6 },
    className: "rounded-full bg-[#e0e0e0]",
    messy: { x: -6, y: -7, rotate: -8, scaleX: 0.65 },
  },
  {
    id: "nav3",
    style: { left: "90%", top: 27, width: "8%", height: 6 },
    className: "rounded-full bg-[#e0e0e0]",
    messy: { x: 9, y: 3, rotate: 11, scaleX: 1.15 },
  },
  {
    id: "headline1",
    style: { left: "21%", top: 72, width: "58%", height: 14 },
    className: "rounded-[3px] bg-ink",
    messy: { x: -15, y: 9, rotate: -4, scaleX: 1.16 },
  },
  {
    id: "headline2",
    style: { left: "29%", top: 92, width: "42%", height: 14 },
    className: "rounded-[3px] bg-ink",
    messy: { x: 17, y: -7, rotate: 6, scaleX: 0.8 },
  },
  {
    id: "subtext",
    style: { left: "25%", top: 117, width: "50%", height: 7 },
    className: "rounded-full bg-[#cdcdcd]",
    messy: { x: -11, y: 13, rotate: -3.5, scaleX: 1.28 },
  },
  {
    id: "button",
    style: { left: "calc(50% - 48px)", top: 140, width: 96, height: 30 },
    className: "rounded-full bg-ink",
    messy: { x: 62, y: -12, rotate: 12, scale: 0.66 },
  },
  {
    id: "image",
    style: { left: "6%", top: 188, width: "88%", height: 74 },
    className: "rounded-lg bg-[#ececec]",
    messy: { x: -13, y: -20, rotate: -3, scale: 0.93 },
    children: (
      <span className="absolute left-3 top-3 w-7 h-7 rounded-full bg-[#dadada]" />
    ),
  },
  {
    id: "card1",
    style: { left: "6%", top: 280, width: "27.4%", height: 52 },
    className: "rounded-lg bg-[#f4f4f4] p-2.5",
    messy: { x: -15, y: 11, rotate: -7 },
    children: <CardInner />,
  },
  {
    id: "card2",
    style: { left: "36.3%", top: 280, width: "27.4%", height: 52 },
    className: "rounded-lg bg-[#f4f4f4] p-2.5",
    messy: { x: 9, y: -13, rotate: 5 },
    children: <CardInner />,
  },
  {
    id: "card3",
    style: { left: "66.6%", top: 280, width: "27.4%", height: 52 },
    className: "rounded-lg bg-[#f4f4f4] p-2.5",
    messy: { x: 18, y: 15, rotate: 9 },
    children: <CardInner />,
  },
];

function CardInner() {
  return (
    <>
      <span className="block w-3.5 h-3.5 rounded bg-[#d6d6d6]" />
      <span className="block mt-2 h-1.5 w-3/4 rounded-full bg-[#e3e3e3]" />
    </>
  );
}

export default function CleanLayoutDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tidy, setTidy] = useState(false);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 2400, tick: () => setTidy(false) },
      { duration: 4200, tick: () => setTidy(true) },
    ],
    []
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  // Reduced motion: hold the clean, organised state — no loop, no sweep.
  const showTidy = prefersReducedMotion || tidy;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of a cluttered web page rearranging itself into a clean, organised layout"
      className="relative w-full max-w-lg mx-auto h-[346px] overflow-hidden rounded-2xl bg-surface border border-black/[0.06]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {pieces.map((piece, i) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.className}`}
          style={piece.style}
          initial={false}
          animate={showTidy ? CLEAN : piece.messy}
          transition={{
            type: "spring",
            stiffness: 210,
            damping: 23,
            delay: i * 0.03,
          }}
        >
          {piece.children}
        </motion.div>
      ))}

      {/* Soft sweep — crosses once as the layout settles into place. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent)",
        }}
        initial={false}
        animate={{ x: showTidy ? "360%" : "-120%" }}
        transition={showTidy ? { duration: 0.75, ease } : { duration: 0 }}
      />

      {/* Before / After label — spells the message out for non-technical viewers. */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#f5f5f5] border border-black/[0.05]">
        <motion.span
          key={showTidy ? "after" : "before"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="block text-[10px] font-mono uppercase tracking-[0.16em] text-ink-2"
        >
          {showTidy ? "After" : "Before"}
        </motion.span>
      </div>
    </div>
  );
}
