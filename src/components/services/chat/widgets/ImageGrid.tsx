import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "images" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

// Three abstract compositions in the warm-paper / ink palette. Each is a
// tiny SVG scene with feTurbulence noise, layered shapes, and a subtle
// inner shadow. Rendered at 200×200 via viewBox so they scale crisply
// inside the chat thread on any screen.
const COMPOSITIONS: Array<{ id: string; node: React.ReactNode }> = [
  {
    id: "horizon",
    node: (
      <>
        <defs>
          <linearGradient id="img-h-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efece6" />
            <stop offset="100%" stopColor="#d9d6cc" />
          </linearGradient>
          <linearGradient id="img-h-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a39e90" />
            <stop offset="100%" stopColor="#5c5c5c" />
          </linearGradient>
          <filter id="img-h-noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
          </filter>
        </defs>
        <rect width="200" height="200" fill="url(#img-h-sky)" />
        <circle cx="138" cy="78" r="30" fill="#f6f5f2" opacity="0.95" />
        <circle cx="138" cy="78" r="30" fill="#111111" opacity="0.04" />
        <rect y="118" width="200" height="82" fill="url(#img-h-ground)" />
        <path d="M0 118 Q 60 110 110 122 T 200 116 L 200 132 L 0 132 Z" fill="#111111" opacity="0.18" />
        <rect width="200" height="200" filter="url(#img-h-noise)" />
      </>
    ),
  },
  {
    id: "arch",
    node: (
      <>
        <defs>
          <linearGradient id="img-a-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0efec" />
            <stop offset="100%" stopColor="#cfcec9" />
          </linearGradient>
          <linearGradient id="img-a-arch" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#7a7670" />
          </linearGradient>
          <filter id="img-a-noise">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
          </filter>
        </defs>
        <rect width="200" height="200" fill="url(#img-a-bg)" />
        <path
          d="M40 200 L40 80 A 60 60 0 0 1 160 80 L160 200 Z"
          fill="url(#img-a-arch)"
        />
        <path
          d="M70 200 L70 95 A 30 30 0 0 1 130 95 L130 200 Z"
          fill="#f6f5f2"
        />
        <circle cx="100" cy="106" r="3.5" fill="#111111" />
        <rect width="200" height="200" filter="url(#img-a-noise)" />
      </>
    ),
  },
  {
    id: "wave",
    node: (
      <>
        <defs>
          <linearGradient id="img-w-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3e0d8" />
            <stop offset="100%" stopColor="#b8b6af" />
          </linearGradient>
          <filter id="img-w-noise">
            <feTurbulence type="turbulence" baseFrequency="0.6" numOctaves="2" seed="14" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
        </defs>
        <rect width="200" height="200" fill="url(#img-w-bg)" />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 60 + i * 22;
          const opacity = 0.18 + i * 0.08;
          return (
            <path
              key={i}
              d={`M-10 ${y} Q 50 ${y - 14} 100 ${y} T 210 ${y}`}
              fill="none"
              stroke="#111111"
              strokeOpacity={opacity}
              strokeWidth={1.2}
            />
          );
        })}
        <circle cx="56" cy="48" r="14" fill="#111111" opacity="0.78" />
        <rect width="200" height="200" filter="url(#img-w-noise)" />
      </>
    ),
  },
  {
    id: "field",
    node: (
      <>
        <defs>
          <radialGradient id="img-f-bg" cx="0.7" cy="0.3" r="0.9">
            <stop offset="0%" stopColor="#f6f5f2" />
            <stop offset="100%" stopColor="#a39e90" />
          </radialGradient>
          <filter id="img-f-noise">
            <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" seed="22" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" />
          </filter>
        </defs>
        <rect width="200" height="200" fill="url(#img-f-bg)" />
        {Array.from({ length: 28 }, (_, i) => {
          const seed = (i * 9301 + 49297) % 233280;
          const x = (seed / 233280) * 200;
          const y = ((seed * 7) % 233280 / 233280) * 200;
          const r = 0.6 + ((seed * 3) % 5);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#111111"
              opacity={0.5 + ((seed % 5) / 12)}
            />
          );
        })}
        <rect width="200" height="200" filter="url(#img-f-noise)" />
      </>
    ),
  },
];

export default function ImageGrid({ widget, reducedMotion, isLatest }: Props) {
  const cols = widget.count;
  const animate = !reducedMotion && isLatest;
  return (
    <div
      className="grid gap-2 max-w-[380px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols }, (_, i) => {
        const comp = COMPOSITIONS[i % COMPOSITIONS.length];
        return (
          <div
            key={i}
            className={`aspect-square rounded-xl border border-border overflow-hidden bg-bg ${animate ? "animate-chat-image-in" : ""}`}
            style={{
              animationDelay: animate ? `${i * 80}ms` : undefined,
            }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full block"
            >
              {comp.node}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
