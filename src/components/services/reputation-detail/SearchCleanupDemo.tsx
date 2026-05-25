"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePausedTimeline } from "@/components/services/usePausedTimeline";

type Sentiment = "negative" | "positive" | "neutral";
type Status = "visible" | "flagged" | "removing" | "removed";

type Result = {
  id: string;
  domain: string;
  title: string;
  snippet: string;
  sentiment: Sentiment;
};

const RESULTS: Result[] = [
  {
    id: "forbes",
    domain: "forbes.com",
    title: "Your Brand Named Top Innovator of the Year",
    snippet:
      "A remarkable display of innovation has transformed the category with new approaches to a long-standing problem.",
    sentiment: "positive",
  },
  {
    id: "reddit",
    domain: "reddit.com/r/complaints",
    title: "Terrible experience with Your Brand — stay away",
    snippet:
      "I had the worst experience ever. They completely ignored my requests and refused to provide any support…",
    sentiment: "negative",
  },
  {
    id: "linkedin",
    domain: "linkedin.com/company/your-brand",
    title: "Your Brand — Official Company Page",
    snippet:
      "A team of operators trusted by Fortune 500 companies for end-to-end delivery of measurable outcomes.",
    sentiment: "positive",
  },
  {
    id: "youtube",
    domain: "youtube.com/watch",
    title: "Your Brand EXPOSED — the truth they hide",
    snippet:
      "In this video, I reveal shocking information about this company that they don't want you to know…",
    sentiment: "negative",
  },
  {
    id: "businessinsider",
    domain: "businessinsider.com",
    title: "Your Brand announces new partnership in APAC",
    snippet:
      "The strategic partnership marks a significant milestone in the company's expansion into new markets across the region.",
    sentiment: "neutral",
  },
  {
    id: "medium",
    domain: "medium.com/@user",
    title: "Why I'll never use Your Brand again",
    snippet:
      "After three months of dealing with their support team, I finally gave up and switched to a competitor that…",
    sentiment: "negative",
  },
];

type ResultState = { status: Status };

const initialStates = (): ResultState[] =>
  RESULTS.map(() => ({ status: "visible" as Status }));

const finalStates = (): ResultState[] =>
  RESULTS.map((r) => ({
    status: r.sentiment === "negative" ? ("removed" as Status) : ("visible" as Status),
  }));

function ShieldIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DomainMark({ letter }: { letter: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-ink text-surface text-[9px] font-bold leading-none shrink-0"
    >
      {letter.toUpperCase()}
    </span>
  );
}

type Tone = "neutral" | "active" | "success" | "danger";

function XSpinIcon({ size = 9 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </motion.svg>
  );
}

function Pill({
  label,
  tone = "neutral",
  withSpinner = false,
}: {
  label: string;
  tone?: Tone;
  withSpinner?: boolean;
}) {
  const toneClasses =
    tone === "success"
      ? "border-[#1f6c45]/35 text-[#1f6c45]"
      : tone === "danger"
        ? "border-[#e94f4f]/45 text-[#e94f4f]"
        : tone === "active"
          ? "border-ink text-ink"
          : "border-border text-ink-3";
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[9px] font-mono uppercase tracking-[0.14em] bg-bg ${toneClasses}`}
    >
      {withSpinner && <XSpinIcon size={9} />}
      {label}
    </span>
  );
}

export default function SearchCleanupDemo() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const reduce = useReducedMotion();

  const [states, setStates] = useState<ResultState[]>(() =>
    reduce ? finalStates() : initialStates()
  );
  const [scanning, setScanning] = useState(false);
  const [clearedCount, setClearedCount] = useState(reduce ? 3 : 0);

  // Sort: non-removed (in original order) first, then removed
  const ordered = useMemo(() => {
    const live: number[] = [];
    const dead: number[] = [];
    states.forEach((s, i) => (s.status === "removed" ? dead : live).push(i));
    return [...live, ...dead];
  }, [states]);

  const promotedCount = RESULTS.filter((r) => r.sentiment === "positive").length;
  const negativeIndices = useMemo(
    () =>
      RESULTS.map((r, i) => (r.sentiment === "negative" ? i : -1)).filter(
        (i) => i >= 0
      ),
    []
  );

  // Phase machine: for each negative result, flag → remove (with scan banner),
  // then a 2s reset hold. Tick callbacks advance the state.
  const phases = useMemo(() => {
    let targetCursor = 0;

    const flag = () => {
      setScanning(true);
      const targetIdx = negativeIndices[targetCursor];
      if (targetIdx === undefined) return;
      setStates((prev) => {
        const next = [...prev];
        next[targetIdx] = { status: "flagged" };
        return next;
      });
    };
    const startRemoving = () => {
      const targetIdx = negativeIndices[targetCursor];
      if (targetIdx === undefined) return;
      setStates((prev) => {
        const next = [...prev];
        next[targetIdx] = { status: "removing" };
        return next;
      });
    };
    const finishRemove = () => {
      const targetIdx = negativeIndices[targetCursor];
      if (targetIdx === undefined) return;
      setStates((prev) => {
        const next = [...prev];
        next[targetIdx] = { status: "removed" };
        return next;
      });
      setClearedCount((c) => c + 1);
      setScanning(false);
      targetCursor += 1;
    };
    const reset = () => {
      setStates(initialStates());
      setClearedCount(0);
      setScanning(false);
      targetCursor = 0;
    };

    const result: { duration: number; tick: () => void }[] = [];
    for (let n = 0; n < negativeIndices.length; n++) {
      result.push({ duration: 1100, tick: flag });
      result.push({ duration: 1100, tick: startRemoving });
      result.push({ duration: 1400, tick: finishRemove });
    }
    result.push({ duration: 2400, tick: () => {} });
    result.push({ duration: 100, tick: reset });
    return result;
  }, [negativeIndices]);

  usePausedTimeline(rootRef, phases, {
    amount: 0.2,
    shouldRun: () => !isHoveredRef.current,
  });

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Search-result cleanup: three harmful articles, forum threads, and videos in a brand-name Google search are progressively flagged and removed, leaving Forbes, LinkedIn, and other positive coverage on top."
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="relative w-full rounded-2xl overflow-hidden border border-black/[0.04] flex flex-col bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Top tray — like OnPageMockup: small label + query chip + scanning chip */}
      <div className="px-4 pt-3 pb-2.5 border-b border-border flex items-center gap-2 min-h-[44px]">
        <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-ink-3 shrink-0">
          Search
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-[2px] rounded-full bg-bg border border-border text-[9px] font-mono text-ink tracking-[-0.005em] min-w-0">
          <DomainMark letter="G" />
          <span className="truncate">google.com/search?q=Your+Brand+Name</span>
        </span>
        <span className="ml-auto shrink-0">
          <AnimatePresence>
            {scanning && (
              <motion.span
                key="scanning"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-1 text-[8px] font-mono uppercase tracking-[0.18em] text-ink bg-bg px-1.5 py-[2px] rounded-sm border border-border"
              >
                <ShieldIcon size={9} />
                <span>Scanning</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      {/* Result-count subhead */}
      <div className="px-4 pt-3 text-[9px] font-mono uppercase tracking-[0.18em] text-ink-3">
        About 2,340,000 results
      </div>

      {/* SERP rows — nested cards */}
      <ul className="px-4 pt-3 pb-4 flex flex-col gap-2.5 bg-surface">
        <AnimatePresence initial={false} mode="popLayout">
          {ordered.map((i) => {
            const r = RESULTS[i];
            const status = states[i].status;
            const isFlagged = status === "flagged";
            const isRemoving = status === "removing";
            const isRemoved = status === "removed";
            const isVisible = status === "visible";
            const isNegative = r.sentiment === "negative";
            const isPositive = r.sentiment === "positive";

            const borderClass = isRemoving
              ? "border-[#e94f4f]/40"
              : isFlagged
                ? "border-ink-3"
                : "border-border";

            return (
              <motion.li
                key={r.id}
                layout
                initial={false}
                animate={{
                  opacity: isRemoved ? 0.45 : isRemoving ? 0.8 : 1,
                }}
                transition={{
                  layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3 },
                }}
                className={`rounded-xl border bg-surface p-4 ${borderClass}`}
              >
                {/* URL row */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <DomainMark letter={r.domain[0]} />
                  <span className="text-[10px] font-mono text-ink-3 tracking-[-0.005em] truncate">
                    {r.domain}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    {isNegative && isVisible && (
                      <Pill label="Harmful" tone="danger" />
                    )}
                    {isFlagged && <Pill label="Flagged" tone="active" />}
                    {isRemoving && (
                      <Pill label="Removing" tone="danger" withSpinner />
                    )}
                    {isRemoved && <Pill label="Removed" tone="success" />}
                    {isPositive && isVisible && (
                      <Pill label="Promoted" tone="success" />
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-[15px] font-bold leading-[1.2] tracking-[-0.01em] line-clamp-2 ${
                    isRemoved
                      ? "text-ink-3 line-through decoration-[#e94f4f]/60 decoration-[1.5px]"
                      : "text-[#1a4cbe]"
                  }`}
                >
                  {r.title}
                </h3>

                {/* Snippet */}
                <p
                  className={`mt-1.5 text-[11px] leading-[1.45] line-clamp-2 ${
                    isRemoved ? "text-ink-3" : "text-ink-body"
                  }`}
                >
                  {r.snippet}
                </p>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Footer summary — light bar with green check accent */}
      <div className="bg-bg px-4 py-2.5 border-t border-border flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em]">
        <span className="inline-flex items-center gap-1.5 text-ink">
          <ShieldIcon size={11} />
          <span>Reputation shield</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="text-[#1f6c45]">
            ✓ <span className="tabular-nums">{clearedCount}</span> cleared
          </span>
          <span className="text-ink-3">·</span>
          <span className="text-ink-3">
            <span className="tabular-nums">{promotedCount}</span> promoted
          </span>
        </span>
      </div>
    </div>
  );
}
