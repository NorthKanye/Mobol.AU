"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";
import { CalendarIcon, ChevronDownIcon } from "../icons";

const ease = [0.16, 1, 0.3, 1] as const;

type DayToken = "posted" | "inflight" | "scheduled";

type Day = {
  label: string;
  tokens: ReadonlyArray<DayToken>;
};

const WEEK: ReadonlyArray<Day> = [
  { label: "Mon", tokens: ["posted"] },
  { label: "Tue", tokens: ["posted", "posted"] },
  { label: "Wed", tokens: ["posted"] },
  { label: "Thu", tokens: ["posted"] },
  { label: "Fri", tokens: ["inflight"] },
  { label: "Sat", tokens: ["scheduled"] },
  { label: "Sun", tokens: ["scheduled"] },
];

type Deal = {
  brand: string;
  glyph: string;
  type: string;
  status: "Active" | "Negotiating" | "Draft";
  value?: string;
  expand?: ReadonlyArray<{ k: string; v: string }>;
};

const DEALS: ReadonlyArray<Deal> = [
  {
    brand: "Northbound Outdoor",
    glyph: "N",
    type: "3-post run",
    status: "Active",
    value: "$4,800",
    expand: [
      { k: "Duration", v: "Four weeks · IG + TT" },
      { k: "Progress", v: "Two posts shipped · one in review" },
      { k: "Contact", v: "Marketing lead" },
      { k: "Next beat", v: "Final post live Fri" },
    ],
  },
  { brand: "Powell Coffee Roasters", glyph: "P", type: "Reels series", status: "Negotiating" },
  { brand: "Salt & Stone", glyph: "S", type: "Ambassador", status: "Draft" },
];

const FINAL_STAGE = 6; // hold

function Token({ kind }: { kind: DayToken }) {
  if (kind === "posted") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: "#1f7a4a" }}
      />
    );
  }
  if (kind === "inflight") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full border-[1.5px] border-ink"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ink) 50%, transparent 50%)",
        }}
      />
    );
  }
  return (
    <span className="inline-block w-2 h-2 rounded-full border border-border" />
  );
}

function StatusChip({ status }: { status: Deal["status"] }) {
  if (status === "Active") {
    return (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
        style={{ background: "#ecf6f0", color: "#1f7a4a" }}
      >
        {status}
      </span>
    );
  }
  if (status === "Negotiating") {
    return (
      <span className="inline-flex items-center rounded-full bg-bg px-2 py-0.5 text-[9.5px] font-medium text-ink-2 border border-black/[0.04]">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[9.5px] font-medium text-ink-3">
      {status}
    </span>
  );
}

export default function AccountManagementDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(FINAL_STAGE);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 700, tick: () => setStage(0) }, // header
      { duration: 1100, tick: () => setStage(1) }, // week dots
      { duration: 1000, tick: () => setStage(2) }, // queued caption
      { duration: 900, tick: () => setStage(3) }, // deals header
      { duration: 1200, tick: () => setStage(4) }, // deal rows
      { duration: 1200, tick: () => setStage(5) }, // expand
      { duration: 1000, tick: () => setStage(FINAL_STAGE) }, // footer
      { duration: 7000, tick: () => setStage(FINAL_STAGE) }, // hold
      { duration: 800, tick: () => setStage(0) }, // reset
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);
  const s = prefersReducedMotion ? FINAL_STAGE : stage;

  const showHeader = s >= 0;
  const showWeek = s >= 1;
  const showCaption = s >= 2;
  const showDealsHeader = s >= 3;
  const showDeals = s >= 4;
  const expanded = s >= 5;
  const showFooter = s >= FINAL_STAGE;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Account management dashboard: a week of scheduled posts and three active brand deals."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col gap-3 overflow-hidden rounded-[20px] border border-border bg-surface p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: showHeader ? 1 : 0, y: showHeader ? 0 : 6 }}
          transition={{ duration: 0.4, ease }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-ink">
            <CalendarIcon className="text-ink-2" />
            <span className="text-[13px] font-semibold tracking-[-0.01em]">
              Account &middot; @aster-lane
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-3">
            This week
          </span>
        </motion.div>

        {/* Week strip */}
        <div className="rounded-xl border border-border bg-bg p-3">
          <div className="flex items-start justify-between">
            {WEEK.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{
                  opacity: showWeek ? 1 : 0,
                  y: showWeek ? 0 : 4,
                }}
                transition={{ duration: 0.35, ease, delay: showWeek ? i * 0.05 : 0 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-ink-3">
                  {d.label}
                </span>
                <div className="flex flex-col items-center gap-1">
                  {d.tokens.map((t, ti) => (
                    <Token key={ti} kind={t} />
                  ))}
                  {d.tokens.length === 1 && <span className="invisible h-2" />}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showCaption ? 1 : 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-3 text-[10.5px] text-ink-2"
          >
            <span className="font-semibold text-ink">9 posts queued</span>
            <span className="text-ink-3"> &middot; cadence steady through the weekend.</span>
          </motion.p>
        </div>

        {/* Deals header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: showDealsHeader ? 1 : 0, y: showDealsHeader ? 0 : 4 }}
          transition={{ duration: 0.4, ease }}
          className="mt-1 flex items-center justify-between"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-2 font-mono">
            Active deals
          </p>
          <span className="text-[10px] text-ink-3">3 in flight</span>
        </motion.div>

        {/* Deal rows */}
        <div className="flex flex-1 flex-col gap-1.5 min-h-0">
          {DEALS.map((deal, i) => (
            <motion.div
              key={deal.brand}
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: showDeals ? 1 : 0,
                y: showDeals ? 0 : 6,
              }}
              transition={{ duration: 0.35, ease, delay: showDeals ? i * 0.08 : 0 }}
              className="rounded-xl border border-border bg-surface"
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-md bg-bg border border-border text-[11px] font-bold text-ink">
                  {deal.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-ink leading-tight truncate">
                    {deal.brand}
                  </p>
                  <p className="text-[10px] text-ink-3 leading-tight">
                    {deal.type}
                  </p>
                </div>
                <StatusChip status={deal.status} />
                {deal.value && (
                  <span className="text-[11px] font-mono tabular-nums text-ink ml-1">
                    {deal.value}
                  </span>
                )}
                {deal.expand && (
                  <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="text-ink-3"
                  >
                    <ChevronDownIcon />
                  </motion.span>
                )}
              </div>
              {deal.expand && (
                <motion.div
                  initial={false}
                  animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease }}
                  className="overflow-hidden"
                  aria-hidden={!expanded}
                >
                  <div className="border-t border-border px-3 py-2.5">
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {deal.expand.map((row) => (
                        <div key={row.k}>
                          <dt className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-ink-3">
                            {row.k}
                          </dt>
                          <dd className="text-[11px] text-ink-body leading-tight">
                            {row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFooter ? 1 : 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-auto flex items-center justify-between border-t border-border pt-3"
        >
          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-ink-3">
            Mobol &middot; Account
          </span>
          <span className="text-[9.5px] text-ink-3">
            This month &middot; 11 posts shipped &middot; 3 deals in flight
          </span>
        </motion.div>
      </div>
    </div>
  );
}
