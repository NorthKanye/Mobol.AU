/**
 * Cell 1 — Mark / Logo construction.
 *
 * The cell holds a faint grid pattern, dashed construction guides
 * (only visible when `.show-grid` is on the window), and two SVG paths
 * (ring + M stem) that draw on via `stroke-dashoffset` transitions when
 * `.draw-ring` and `.draw-stroke` get applied. Two small mono coordinate
 * callouts in the corners (`x:14`, `r:32`) reinforce the "this is being
 * constructed" feel.
 */
export default function BrandingMark() {
  return (
    <div
      className="bcell relative bg-surface flex flex-col p-[14px] overflow-hidden"
      data-cell="mark"
    >
      <div className="bcell-tag font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        01 · Mark
      </div>

      <div className="mark-stage flex-1 relative flex items-center justify-center min-h-0">
        {/* Construction grid + dashed guides */}
        <svg
          className="mark-grid absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="markdots"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="0.6" fill="#bdb9b1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#markdots)" />
          <circle
            className="mg-circle"
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#0E0E0E"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line
            className="mg-line mg-h"
            x1="14"
            y1="50"
            x2="86"
            y2="50"
            stroke="#0E0E0E"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
          <line
            className="mg-line mg-v"
            x1="50"
            y1="14"
            x2="50"
            y2="86"
            stroke="#0E0E0E"
            strokeWidth="0.4"
            strokeDasharray="2 2"
          />
        </svg>

        {/* The mark — two paths drawn in sequence */}
        <svg
          className="mark-art absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <circle
            className="ma-ring"
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#0E0E0E"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          />
          <path
            className="ma-stroke"
            d="M38 66 L38 34 L50 50 L62 34 L62 66"
            fill="none"
            stroke="#0E0E0E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>

        {/* Coordinate callouts */}
        <span className="mark-coord absolute top-2 left-2 font-mono text-[8.5px] text-ink-3">
          x:14
        </span>
        <span className="mark-coord absolute bottom-2 right-2 font-mono text-[8.5px] text-ink-3">
          r:32
        </span>
      </div>
    </div>
  );
}
