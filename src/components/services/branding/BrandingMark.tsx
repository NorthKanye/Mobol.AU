import { useId } from "react";

/**
 * Cell 1 — Mark / Logo construction (6-stage).
 *
 * Sequence (driven by .mark-s1 .. .mark-s6 on the window root):
 *   s1 — anchor points pop in (staggered)
 *   s2 — crosshair axes draw outward from center
 *   s3 — phi guides + x-height ring fade in
 *   s4 — ring draws on (also legacy .draw-ring)
 *   s5 — M stem draws on (also legacy .draw-stroke)
 *   s6 — construction guides + anchors fade out, mark sits clean
 *
 * Construction guides use cool gray (#9CA3AF, #D1D5DB) so they read as
 * drafting marks, not part of the final mark itself. The four anchor
 * points use the brand Ember accent for a single warm note inside the
 * otherwise cool, modern construction.
 *
 * SVG `<defs>` ids are uniquified per instance via React.useId() so the
 * /services/branding page (which renders multiple BrandingMark-derived
 * cells on the same page) doesn't end up with every instance pointing
 * at the first one's pattern.
 */
export default function BrandingMark() {
  const uid = useId().replace(/:/g, "");
  const dotsId = `markdots-${uid}`;
  return (
    <div
      className="bcell relative bg-surface flex flex-col p-[14px] overflow-hidden"
      data-cell="mark"
    >
      <div className="bcell-tag font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        Mark
      </div>

      <div className="mark-stage flex-1 relative flex items-center justify-center min-h-0">
        {/* Background dot pattern (cool gray) — always visible */}
        <svg
          className="mark-grid absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={dotsId}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="0.6" fill="#d9dadc" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill={`url(#${dotsId})`} />
          <circle
            className="mg-circle"
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          {/* Crosshair axes — draw on at stage 2 via stroke-dashoffset */}
          <line
            className="mg-axis-h"
            x1="14"
            y1="50"
            x2="86"
            y2="50"
            stroke="#9CA3AF"
            strokeWidth="0.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          />
          <line
            className="mg-axis-v"
            x1="50"
            y1="14"
            x2="50"
            y2="86"
            stroke="#9CA3AF"
            strokeWidth="0.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          />
          {/* Phi guides (golden ratio horizontals) — fade in at stage 3 */}
          <line
            className="mg-phi"
            x1="14"
            y1="38.2"
            x2="86"
            y2="38.2"
            stroke="#D1D5DB"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
          <line
            className="mg-phi"
            x1="14"
            y1="61.8"
            x2="86"
            y2="61.8"
            stroke="#D1D5DB"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
          {/* X-height ring — fade in at stage 3 */}
          <circle
            className="mg-xheight"
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
        </svg>

        {/* The mark — anchors at stage 1, ring at stage 4, M stem at stage 5 */}
        <svg
          className="mark-art absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Four anchor points at compass positions — Ember accent */}
          <circle
            className="ma-anchor"
            cx="50"
            cy="18"
            r="1.4"
            fill="var(--color-accent)"
            style={{ transitionDelay: "0ms" }}
          />
          <circle
            className="ma-anchor"
            cx="82"
            cy="50"
            r="1.4"
            fill="var(--color-accent)"
            style={{ transitionDelay: "80ms" }}
          />
          <circle
            className="ma-anchor"
            cx="50"
            cy="82"
            r="1.4"
            fill="var(--color-accent)"
            style={{ transitionDelay: "160ms" }}
          />
          <circle
            className="ma-anchor"
            cx="18"
            cy="50"
            r="1.4"
            fill="var(--color-accent)"
            style={{ transitionDelay: "240ms" }}
          />

          {/* Ring — rotated -90deg so the dash starts visually from 12 o'clock */}
          <circle
            className="ma-ring"
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
            transform="rotate(-90 50 50)"
          />
          <path
            className="ma-stroke"
            d="M38 66 L38 34 L50 50 L62 34 L62 66"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>

        {/* Coordinate callouts — drafting-style annotations */}
        <span
          className="mark-coord absolute top-2 left-2 text-[10px] text-ink-3"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.04em",
          }}
        >
          x:50.0
        </span>
        <span
          className="mark-coord absolute bottom-2 right-2 text-[10px] text-ink-3"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.04em",
          }}
        >
          r:32
        </span>
        <span
          className="mark-coord mark-coord-phi absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-ink-3"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.04em",
          }}
        >
          φ:1.618
        </span>
      </div>
    </div>
  );
}
