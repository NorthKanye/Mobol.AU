import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "impactDashboard" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

// 3 stacked transformation metrics with mini sparklines. Each row reads as
// a "before → after" with visible improvement. Sparklines draw on entrance.
export default function ImpactDashboard({ widget, reducedMotion, isLatest }: Props) {
  const animate = !reducedMotion && isLatest;

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2 mb-2.5">
        Impact · last 30 days
      </p>
      <ul className="flex flex-col divide-y divide-border">
        {widget.metrics.map((m, i) => (
          <li
            key={i}
            className={`flex items-center gap-3 py-2 first:pt-0 last:pb-0 ${
              animate ? "animate-chat-thinking-step-in" : ""
            }`}
            style={{ animationDelay: animate ? `${i * 120}ms` : undefined }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-2 mb-0.5">
                {m.label}
              </p>
              <p className="text-[12px] leading-[1.3] tabular-nums">
                <span className="text-ink-3 line-through mr-1.5">{m.before}</span>
                <span className="text-ink font-semibold">{m.after}</span>
              </p>
            </div>
            <Sparkline values={m.sparkline} animate={animate} delay={i * 120 + 200} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sparkline({
  values,
  animate,
  delay,
}: {
  values: ReadonlyArray<number>;
  animate: boolean;
  delay: number;
}) {
  if (values.length === 0) return null;
  const W = 56;
  const H = 22;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const stepX = W / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = `M ${points.join(" L ")}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="#111111"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={animate ? "animate-chat-line-draw" : ""}
        style={{ animationDelay: animate ? `${delay}ms` : undefined }}
      />
    </svg>
  );
}
