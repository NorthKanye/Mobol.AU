"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePausedTimeline } from "@/components/services/usePausedTimeline";

type Status = "flagged" | "pending" | "under_review" | "removed";

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  initialStatus: Status;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "John S.",
    date: "2d",
    rating: 1,
    text: "Terrible service, complete scam. DO NOT USE.",
    initialStatus: "flagged",
  },
  {
    id: "r2",
    name: "Anonymous",
    date: "1w",
    rating: 1,
    text: "They stole my money and never delivered.",
    initialStatus: "flagged",
  },
  {
    id: "r3",
    name: "Mike R.",
    date: "3d",
    rating: 2,
    text: "Owner is a crook. Worst experience ever.",
    initialStatus: "flagged",
  },
  {
    id: "r4",
    name: "Sarah L.",
    date: "5d",
    rating: 1,
    text: "FRAUD! They will take your money and run!",
    initialStatus: "flagged",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  flagged: "Flagged",
  pending: "Pending",
  under_review: "Under review",
  removed: "Removed",
};

const NEXT: Record<Status, Status> = {
  flagged: "pending",
  pending: "under_review",
  under_review: "removed",
  removed: "removed",
};

const START_RATING = 3.2;
const TARGET_RATING = 4.8;
const RATING_STEP = (TARGET_RATING - START_RATING) / REVIEWS.length; // 0.4

const initialStates = (): Status[] => REVIEWS.map((r) => r.initialStatus);
const finalStates = (): Status[] => REVIEWS.map(() => "removed");

function StarSvg({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f5b700" : "var(--color-border)"}
      aria-hidden="true"
    >
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
    </svg>
  );
}

function StatusPill({ status }: { status: Status }) {
  // flagged/pending/under_review → inverted (active) ; removed → outline
  const inverted = status !== "removed";
  return (
    <span
      className={`shrink-0 inline-flex items-center px-2 py-[3px] text-[9.5px] font-mono uppercase tracking-[0.14em] rounded-full ${
        inverted
          ? "bg-ink text-surface"
          : "border border-ink text-ink"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function ReviewPulseDemo() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const reduce = useReducedMotion();

  const [states, setStates] = useState<Status[]>(() =>
    reduce ? finalStates() : initialStates()
  );

  // Derived: number of reviews fully removed → drives rating + progress bar
  const removedCount = states.filter((s) => s === "removed").length;
  const rating = Math.min(
    TARGET_RATING,
    START_RATING + removedCount * RATING_STEP
  );

  // Sort: non-removed first (in original order), then removed (at bottom)
  const orderedIndices = useMemo(() => {
    const live: number[] = [];
    const dead: number[] = [];
    states.forEach((s, i) => (s === "removed" ? dead : live).push(i));
    return [...live, ...dead];
  }, [states]);

  // Timeline: one tick per ~1700 ms; advance one review at a time through the
  // states. Each review takes 3 ticks to fully remove (flagged → pending →
  // under_review → removed). After all 4 are removed, hold 2 phases then reset.
  const phases = useMemo(() => {
    const tick = () => {
      setStates((prev) => {
        // If all already removed, reset (the hold below gives a pause)
        if (prev.every((s) => s === "removed")) {
          return initialStates();
        }
        // Advance the first non-removed review one step
        const next = [...prev];
        const idx = next.findIndex((s) => s !== "removed");
        if (idx !== -1) next[idx] = NEXT[next[idx]];
        return next;
      });
    };
    return [
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      { duration: 1700, tick },
      // hold a couple of extra ticks at the end before reset
      { duration: 2000, tick: () => {} },
      { duration: 1000, tick: () => {} },
    ];
  }, []);

  usePausedTimeline(rootRef, phases, {
    amount: 0.2,
    shouldRun: () => !isHoveredRef.current,
  });

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Review Pulse: 4 fake one-star reviews are progressively flagged, reviewed, and removed, lifting the overall Google rating from 3.2 to 4.8."
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] p-6 sm:p-7"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ink text-surface grid place-items-center font-mono font-bold text-[16px] leading-none">
            G
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-ink">
              Google Reviews
            </p>
            <p className="text-[11px] text-ink-2 font-mono uppercase tracking-[0.12em]">
              Business profile
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[28px] sm:text-[32px] font-bold text-ink tabular-nums leading-none tracking-tighter-display">
              {rating.toFixed(1)}
            </span>
            <StarSvg size={20} filled />
          </div>
          <p className="mt-1 text-[10.5px] font-mono uppercase tracking-[0.14em] text-ink-2">
            <span aria-hidden="true">↑</span> Improving
          </p>
        </div>
      </div>

      {/* Review cards */}
      <ul className="mt-6 flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {orderedIndices.map((i) => {
            const r = REVIEWS[i];
            const status = states[i];
            const isRemoved = status === "removed";
            return (
              <motion.li
                key={r.id}
                layout
                initial={false}
                animate={{
                  opacity: isRemoved ? 0.45 : 1,
                }}
                transition={{
                  layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3 },
                }}
                className={`rounded-xl border border-border bg-bg/40 px-3.5 py-3 ${
                  isRemoved ? "line-through decoration-ink-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12.5px] font-semibold text-ink">
                        {r.name}
                      </span>
                      <span className="flex items-center gap-px">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <StarSvg
                            key={idx}
                            size={10}
                            filled={idx < r.rating}
                          />
                        ))}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-3">
                        {r.date}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-[1.45] text-ink-2 truncate">
                      {r.text}
                    </p>
                  </div>
                  <StatusPill status={status} />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Progress bar */}
      <div className="mt-5 rounded-xl bg-bg border border-border px-4 py-3">
        <div className="flex items-center justify-between text-[10.5px] font-mono uppercase tracking-[0.14em] text-ink-2">
          <span>Removal progress</span>
          <span className="text-ink tabular-nums">
            {removedCount}/{REVIEWS.length} complete
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full bg-ink rounded-full"
            initial={false}
            animate={{ width: `${(removedCount / REVIEWS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-4">
        <Stat value="89%" label="Removal rate" />
        <Stat value="+1.6" label="Avg rating boost" />
        <Stat value="3.2K" label="Reviews managed" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[20px] font-bold text-ink tabular-nums leading-none tracking-tighter-display">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-2">
        {label}
      </p>
    </div>
  );
}
