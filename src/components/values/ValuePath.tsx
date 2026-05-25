import type { CSSProperties } from "react";
import { Footprint } from "./valueIcons";

type ValuePathProps = {
  className?: string;
};

const FOOTPRINT_CLUSTERS: Array<{ x: number; y: number; rotate: number }>[] = [
  [
    { x: 220, y: 96, rotate: -18 },
    { x: 260, y: 84, rotate: -10 },
    { x: 300, y: 78, rotate: -2 },
    { x: 340, y: 80, rotate: 8 },
  ],
  [
    { x: 520, y: 110, rotate: 14 },
    { x: 560, y: 122, rotate: 6 },
    { x: 600, y: 126, rotate: -4 },
    { x: 640, y: 124, rotate: -14 },
    { x: 680, y: 116, rotate: -22 },
  ],
  [
    { x: 820, y: 96, rotate: -16 },
    { x: 860, y: 84, rotate: -8 },
    { x: 900, y: 80, rotate: 0 },
    { x: 940, y: 84, rotate: 10 },
  ],
];

export default function ValuePath({ className }: ValuePathProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="hwf-path-curve"
        d="M 40 110 C 250 30, 350 190, 600 110 S 950 30, 1160 110"
        stroke="var(--color-ink-3)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <g className="hwf-footprints" stroke="none">
        {FOOTPRINT_CLUSTERS.flatMap((cluster, clusterIdx) =>
          cluster.map((fp, i) => {
            const flatIndex = FOOTPRINT_CLUSTERS.slice(0, clusterIdx).reduce(
              (acc, c) => acc + c.length,
              0,
            ) + i;
            return (
              <g
                key={`${clusterIdx}-${i}`}
                className="hwf-footprint"
                data-i={flatIndex}
                style={{ "--reveal-delay": `${200 + flatIndex * 70}ms` } as CSSProperties}
                transform={`translate(${fp.x} ${fp.y}) rotate(${fp.rotate})`}
                fill="var(--color-ink-3)"
              >
                <Footprint />
              </g>
            );
          }),
        )}
      </g>
    </svg>
  );
}
