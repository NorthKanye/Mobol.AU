"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

// ---- graph geometry (SVG viewBox 0 0 480 210) ----
const HUB = { x: 92, y: 105 };
const HUB_ANCHOR = { x: 158, y: 105 };
const NODE_X = 322;
const NODE_W = 140;
const nodeY = (i: number) => 25 + i * 38;

const NODES: ReadonlyArray<string> = [
  "Shopify",
  "Helpdesk",
  "CRM",
  "Inventory",
  "Reporting",
];

type Tool = { call: string; args: string; result: string; latency: string };
const TOOLS: ReadonlyArray<Tool> = [
  {
    call: "shopify.lookupOrder",
    args: '{ order: "AL-10872" }',
    result: '{ status: "stuck", carrier: "AusPost" }',
    latency: "120ms",
  },
  {
    call: "helpdesk.resolveTicket",
    args: '{ ticket: "T-4471" }',
    result: '{ closed: true }',
    latency: "80ms",
  },
  {
    call: "crm.updateSegment",
    args: '{ segment: "sensitive-skin" }',
    result: '{ flow: "replenishment" }',
    latency: "95ms",
  },
  {
    call: "inventory.reserveBundle",
    args: '{ sku: "sensitive-bundle" }',
    result: '{ reserved: true }',
    latency: "60ms",
  },
  {
    call: "reporting.logImpact",
    args: '{ event: "order-saved" }',
    result: '{ queued: true }',
    latency: "40ms",
  },
];

const EFFECTS: ReadonlyArray<string> = [
  "Order re-shipped on express",
  "Customer moved to the replenishment flow",
  "8-week refill scheduled",
  "Weekly impact dashboard updating",
];

// Sample a cubic bezier hub→node into deterministic coordinate arrays so the
// travelling dot can follow the curve (computed at module scope — SSR-safe).
function sampleConnector(targetY: number) {
  const p0 = HUB_ANCHOR;
  const p1 = { x: 240, y: 105 };
  const p2 = { x: 240, y: targetY };
  const p3 = { x: NODE_X, y: targetY };
  const xs: number[] = [];
  const ys: number[] = [];
  const N = 18;
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const u = 1 - t;
    xs.push(u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x);
    ys.push(u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y);
  }
  return { d: `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`, xs, ys };
}

const CONNECTORS = NODES.map((_, i) => {
  const { d, xs, ys } = sampleConnector(nodeY(i));
  return { d, xs, ys, xsRev: [...xs].reverse(), ysRev: [...ys].reverse() };
});

// step 0 = idle/reset · 1–10 = tool calls (out/in pairs) · 11 = hold (all done)
const HOLD_STEP = 11;

export default function BackendAutomationDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(HOLD_STEP);

  const phases = useMemo<TimelinePhase[]>(() => {
    const out: TimelinePhase[] = [];
    for (let s = 1; s <= 10; s++) {
      out.push({ duration: 1300, tick: () => setStep(s) });
    }
    out.push({ duration: 6000, tick: () => setStep(HOLD_STEP) });
    out.push({ duration: 700, tick: () => setStep(0) });
    return out;
  }, []);

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const tool = step >= 1 && step <= 10 ? Math.floor((step - 1) / 2) : -1;
  const outbound = tool >= 0 && step % 2 === 1;
  const inbound = tool >= 0 && step % 2 === 0;

  const nodeStatus = (i: number): "idle" | "calling" | "done" => {
    if (step === HOLD_STEP) return "done";
    if (step === 0) return "idle";
    if (i < tool) return "done";
    if (i === tool) return outbound ? "calling" : "done";
    return "idle";
  };

  const effectsShown =
    step === 0 ? 0 : step === HOLD_STEP ? 4 : Math.min(4, Math.max(0, Math.floor((step - 2) / 2)));

  const terminalTool = tool >= 0 ? tool : step === HOLD_STEP ? 4 : 0;
  const t = TOOLS[terminalTool];
  const resultShown = tool >= 0 ? inbound : step === HOLD_STEP;

  const conn = tool >= 0 ? CONNECTORS[tool] : null;
  const dotXs = conn ? (outbound ? conn.xs : conn.xsRev) : [];
  const dotYs = conn ? (outbound ? conn.ys : conn.ysRev) : [];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of AI backend automation: a central Mobol AI hub calls Shopify, Helpdesk, CRM, Inventory, and Reporting in turn — a dot travels out to each system and a result returns — then a four-step workflow completes."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col gap-3 overflow-hidden rounded-[20px] border border-border bg-surface p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="h-[200px] w-full">
          <svg viewBox="0 0 480 210" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            {CONNECTORS.map((c, i) => (
              <path
                key={i}
                d={c.d}
                fill="none"
                stroke={i === tool ? "#cdcdcd" : "#e8e8e8"}
                strokeWidth={1.5}
              />
            ))}

            <motion.circle
              cx={HUB.x}
              cy={HUB.y}
              r={80}
              fill="none"
              stroke="#d4d4d4"
              strokeWidth={1}
              strokeDasharray="2 8"
              animate={prefersReducedMotion ? {} : { strokeDashoffset: [0, -40] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />

            <rect x={26} y={70} width={132} height={70} rx={14} fill="#111111" />
            <text x={HUB.x} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
              Mobol AI
            </text>
            <text x={HUB.x} y={118} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.6)">
              &middot; Hub
            </text>

            {NODES.map((name, i) => {
              const st = nodeStatus(i);
              const y = nodeY(i);
              const fill = st === "calling" ? "#fdf3e3" : "#fafafa";
              const stroke =
                st === "calling" ? "#f59e0b" : st === "done" ? "#bbf0d6" : "#e5e5e5";
              const textFill =
                st === "calling" ? "#92400e" : st === "done" ? "#171717" : "#8a8a8a";
              return (
                <g key={name}>
                  <rect
                    x={NODE_X}
                    y={y - 15}
                    width={NODE_W}
                    height={30}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.25}
                  />
                  <text
                    x={NODE_X + 16}
                    y={y}
                    fontSize={10.5}
                    fontWeight={500}
                    fill={textFill}
                    dominantBaseline="middle"
                  >
                    {name}
                  </text>
                  {st === "done" && <circle cx={NODE_X + NODE_W - 13} cy={y} r={3} fill="#10b981" />}
                  {st === "calling" && !prefersReducedMotion && (
                    <motion.rect
                      x={NODE_X}
                      y={y - 15}
                      width={NODE_W}
                      height={30}
                      rx={8}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={1.25}
                      animate={{ opacity: [0.15, 0.85, 0.15] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  )}
                </g>
              );
            })}

            {conn && (
              <motion.circle
                key={step}
                r={4.5}
                cx={0}
                cy={0}
                fill={outbound ? "#111111" : "#10b981"}
                initial={{ x: dotXs[0], y: dotYs[0] }}
                animate={{ x: dotXs, y: dotYs }}
                transition={{ duration: 1.05, ease: "easeInOut" }}
              />
            )}
          </svg>
        </div>

        <div
          className="rounded-xl border border-black/10 px-3.5 py-2.5 font-mono"
          style={{ backgroundColor: "#1c1c1e" }}
        >
          <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Live tool call</p>
          <p className="mt-1.5 truncate text-[11px] text-white">
            <span className="text-[#e94f4f]">&#9656;</span> {t.call}
          </p>
          <p className="truncate pl-3.5 text-[11px] text-white/45">{t.args}</p>
          <p className="truncate pl-3.5 text-[11px]">
            {resultShown ? (
              <>
                <span className="text-emerald-400">&larr;</span>{" "}
                <span className="text-white/70">{t.result}</span>{" "}
                <span className="text-white/35">&middot; {t.latency}</span>
              </>
            ) : (
              <span className="text-white/30">running&hellip;</span>
            )}
          </p>
        </div>

        <div className="flex-1">
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-2">
            Triggered from one chat
          </p>
          <div className="space-y-2">
            {EFFECTS.map((effect, i) => {
              const shown = i < effectsShown;
              const isLast = i === EFFECTS.length - 1;
              return (
                <div
                  key={effect}
                  className="flex items-center gap-2.5 transition-opacity duration-300"
                  style={{ opacity: shown ? 1 : 0.32 }}
                >
                  {shown && isLast ? (
                    <motion.span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.6px] border-ink/20 border-t-ink"
                      animate={prefersReducedMotion ? {} : { rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : shown ? (
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
                  ) : (
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                  )}
                  <span className="text-[11px] leading-tight text-ink-2">{effect}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
