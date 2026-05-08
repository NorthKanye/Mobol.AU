import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "chart" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const W = 280;
const H = 132;
const PAD_X = 10;
const PAD_TOP = 24;
const PAD_BOTTOM = 16;

export default function AnalyticsChart({ widget, reducedMotion, isLatest }: Props) {
  const { values, chart, label } = widget;
  const max = Math.max(...values, 1);
  const animate = !reducedMotion && isLatest;
  const last = values[values.length - 1] ?? 0;
  const prev = values[values.length - 2] ?? last;
  const deltaPct =
    prev === 0 ? 0 : Math.round(((last - prev) / Math.max(prev, 1)) * 100);
  const deltaSign = deltaPct >= 0 ? "+" : "";

  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const baselineY = H - PAD_BOTTOM;

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        {label ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            {label}
          </p>
        ) : <span />}
        <span
          className={`text-[10px] font-semibold tabular-nums tracking-tight ${
            deltaPct >= 0 ? "text-[#2a8a4f]" : "text-[#b35038]"
          }`}
        >
          {deltaSign}
          {deltaPct}% WoW
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Baseline grid — three horizontal rules */}
        {[0.33, 0.66, 1].map((t, i) => {
          const y = PAD_TOP + innerH * (1 - t);
          return (
            <line
              key={i}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={y}
              y2={y}
              stroke="#e8e7e3"
              strokeWidth={1}
              strokeDasharray={t === 1 ? "0" : "2 3"}
            />
          );
        })}

        {chart === "bars" ? (
          (() => {
            const slot = (W - PAD_X * 2) / values.length;
            const barW = slot - 4;
            return (
              <>
                {values.map((v, i) => {
                  const x = PAD_X + i * slot + 2;
                  const target = (v / max) * innerH;
                  const y = baselineY - target;
                  const isLast = i === values.length - 1;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width={barW}
                      height={target}
                      rx={2.5}
                      fill="#111111"
                      fillOpacity={isLast ? 1 : 0.78}
                      className={animate ? "animate-chat-bar-grow" : ""}
                      style={{
                        transformOrigin: `${x + barW / 2}px ${baselineY}px`,
                        animationDelay: animate ? `${i * 55}ms` : undefined,
                      }}
                    />
                  );
                })}
                {/* Value label on the last bar */}
                {(() => {
                  const i = values.length - 1;
                  const x = PAD_X + i * slot + 2 + barW / 2;
                  const target = (last / max) * innerH;
                  const y = baselineY - target - 6;
                  return (
                    <g
                      className={animate ? "animate-chat-chart-label-in" : ""}
                      style={{
                        animationDelay: animate
                          ? `${values.length * 55 + 200}ms`
                          : undefined,
                      }}
                    >
                      <rect
                        x={x - 14}
                        y={y - 11}
                        width={28}
                        height={14}
                        rx={3}
                        fill="#111111"
                      />
                      <text
                        x={x}
                        y={y - 1}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                      >
                        {last}
                      </text>
                    </g>
                  );
                })()}
              </>
            );
          })()
        ) : (
          (() => {
            const stepX = (W - PAD_X * 2) / Math.max(values.length - 1, 1);
            const points = values.map((v, i) => {
              const x = PAD_X + i * stepX;
              const y = baselineY - (v / max) * innerH;
              return [x, y] as const;
            });
            const d = `M ${points.map(([x, y]) => `${x},${y}`).join(" L ")}`;
            return (
              <>
                <path
                  d={d}
                  fill="none"
                  stroke="#111111"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={animate ? "animate-chat-line-draw" : ""}
                  pathLength={1}
                />
                {points.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === points.length - 1 ? 3 : 2}
                    fill="#111111"
                  />
                ))}
              </>
            );
          })()
        )}
      </svg>
    </div>
  );
}
