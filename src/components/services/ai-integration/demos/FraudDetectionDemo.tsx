"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const ease = [0.16, 1, 0.3, 1] as const;

type Order = {
  ref: string;
  amount: string;
  detail: string;
  fraud?: boolean;
  reasons?: string[];
  outcome?: string;
};

const ORDERS: ReadonlyArray<Order> = [
  { ref: "#10486", amount: "$58", detail: "Perth, AU · regular customer" },
  { ref: "#10487", amount: "$74", detail: "Melbourne, AU · saved card" },
  {
    ref: "#10488",
    amount: "$1,920",
    detail: "Brand-new account · rushed checkout",
    fraud: true,
    reasons: [
      "The card is registered overseas, far from the delivery address.",
      "14 orders placed from one device in 3 minutes.",
    ],
    outcome: "$1,920 stopped before it shipped",
  },
  { ref: "#10489", amount: "$63", detail: "Sydney, AU · regular customer" },
  { ref: "#10490", amount: "$45", detail: "Brisbane, AU · saved card" },
];

const FRAUD_INDEX = 2;
const HOLD_STEP = 9;

// step 0 = reset · 1,2 = first orders · 3–6 = the fraud order being screened
// · 7,8 = last orders · 9 = hold
function ordersShown(step: number): number {
  if (step === 0) return 0;
  if (step === HOLD_STEP) return ORDERS.length;
  if (step <= 2) return step;
  if (step <= 6) return 3;
  return step - 3;
}

export default function FraudDetectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(HOLD_STEP);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 1300, tick: () => setStep(1) },
      { duration: 1300, tick: () => setStep(2) },
      { duration: 1700, tick: () => setStep(3) },
      { duration: 1800, tick: () => setStep(4) },
      { duration: 1800, tick: () => setStep(5) },
      { duration: 2200, tick: () => setStep(6) },
      { duration: 1400, tick: () => setStep(7) },
      { duration: 1400, tick: () => setStep(8) },
      { duration: 6500, tick: () => setStep(HOLD_STEP) },
      { duration: 800, tick: () => setStep(0) },
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const shown = ordersShown(step);
  const fraudReasons = step >= 5 ? 2 : step === 4 ? 1 : 0;
  const fraudBlocked = step >= 6;
  const fraudShown = shown > FRAUD_INDEX;
  const checked = shown - (fraudShown && !fraudBlocked ? 1 : 0);
  const protectedAmount = fraudBlocked ? "$1,920" : "$0";
  const orders = ORDERS.slice(0, shown);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of AI order screening: each incoming order is checked for fraud — ordinary orders are cleared, and a suspicious $1,920 order is caught with plain-English reasons and blocked before it ships."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-surface">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M7 1 L12 3 V7 C12 10 9.7 12.3 7 13 C4.3 12.3 2 10 2 7 V3 Z" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[12.5px] font-medium text-ink">Order screening</p>
              <p className="text-[9.5px] text-ink-2">AI checks every order for fraud</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-ink-2">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
            live
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3">
          {orders.map((order) => {
            if (!order.fraud) {
              return (
                <motion.div
                  key={order.ref}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-[11.5px] text-ink">
                      <span className="font-mono font-medium">{order.ref}</span>
                      <span className="text-ink-2"> &middot; {order.amount}</span>
                    </p>
                    <p className="truncate text-[10px] text-ink-3">{order.detail}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path
                        d="m2 5 2 2 4-4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Looks legit
                  </span>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={order.ref}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                className="rounded-xl border border-accent/35 bg-accent/[0.05] px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11.5px] text-ink">
                    <span className="font-mono font-medium">{order.ref}</span>
                    <span className="font-semibold"> &middot; {order.amount}</span>
                  </p>
                  {fraudBlocked ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-1 text-[10px] font-semibold text-accent">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="M2.5 2.5 7.5 7.5 M7.5 2.5 2.5 7.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                      Blocked
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-bg px-2 py-1 text-[10px] font-medium text-ink-2">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1 w-1 rounded-full bg-ink-3"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.16 }}
                        />
                      ))}
                      Checking
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] text-ink-3">{order.detail}</p>

                <div className="mt-2 space-y-1.5">
                  {(order.reasons ?? []).slice(0, fraudReasons).map((reason) => (
                    <motion.div
                      key={reason}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="flex items-start gap-1.5"
                    >
                      <span className="mt-[1px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                        <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path
                            d="M2.5 2.5 7.5 7.5 M7.5 2.5 2.5 7.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[10.5px] leading-[1.4] text-ink-body">{reason}</span>
                    </motion.div>
                  ))}
                </div>

                {fraudBlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5"
                  >
                    <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-emerald-500 text-surface">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="m2 5 2 2 4-4.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[10.5px] font-semibold text-emerald-800">
                      {order.outcome}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-bg text-center">
          <div className="px-2 py-2.5">
            <p className="text-[15px] font-semibold tabular-nums text-ink">{checked}</p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-ink-3">checked</p>
          </div>
          <div className="px-2 py-2.5">
            <p className="text-[15px] font-semibold tabular-nums text-accent">
              {fraudBlocked ? 1 : 0}
            </p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-ink-3">blocked</p>
          </div>
          <div className="px-2 py-2.5">
            <p className="text-[15px] font-semibold tabular-nums text-emerald-600">
              {protectedAmount}
            </p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-ink-3">protected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
