import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "brandPack" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const DEFAULT_TONES: Record<string, [string, string]> = {
  logo: ["#efece6", "#3a3a3a"],
  moodboard: ["#dcdbd6", "#a39e90"],
  product: ["#e3e0d8", "#7a7670"],
  video: ["#1c1c1e", "#3a3a3a"],
};

// 4 visual tiles representing the asset kinds the AI generated. Each kind
// gets a distinct mini-composition built from layered shapes; no external
// images. The video tile shows a play icon overlay and a subtle scanline
// effect to read as "video frame."
export default function BrandAssetPack({ widget, reducedMotion, isLatest }: Props) {
  const animate = !reducedMotion && isLatest;
  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
          Brand pack · generated
        </p>
        <span className="text-[10px] text-ink-3">on-brand · 4 assets</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {widget.tiles.map((tile, i) => {
          const tone = tile.tone ?? DEFAULT_TONES[tile.kind];
          return (
            <div
              key={i}
              className={`relative aspect-[4/3] rounded-xl border border-border overflow-hidden ${
                animate ? "animate-chat-image-in" : ""
              }`}
              style={{
                animationDelay: animate ? `${i * 90}ms` : undefined,
              }}
              aria-hidden="true"
            >
              <TileVisual kind={tile.kind} tone={tone} />
              {tile.label ? (
                <span className="absolute bottom-1.5 left-1.5 text-[8px] uppercase tracking-[0.16em] font-medium text-ink-2 bg-surface/80 backdrop-blur-sm px-1 py-0.5 rounded">
                  {tile.label}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TileVisual({
  kind,
  tone,
}: {
  kind: "logo" | "moodboard" | "video" | "product";
  tone: [string, string];
}) {
  const [a, b] = tone;
  if (kind === "logo") {
    return (
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <rect width="100" height="75" fill={a} />
        <g transform="translate(50, 37.5)">
          <circle cx="-10" cy="0" r="14" fill={b} />
          <circle cx="10" cy="0" r="14" fill={b} fillOpacity="0.4" />
        </g>
      </svg>
    );
  }
  if (kind === "moodboard") {
    return (
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <linearGradient id="mb-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <rect width="100" height="75" fill="url(#mb-bg)" />
        <rect x="8" y="8" width="34" height="22" rx="2" fill="#111" fillOpacity="0.18" />
        <rect x="48" y="8" width="44" height="34" rx="2" fill="#111" fillOpacity="0.10" />
        <rect x="8" y="36" width="34" height="31" rx="2" fill="#111" fillOpacity="0.14" />
        <rect x="48" y="48" width="44" height="19" rx="2" fill="#111" fillOpacity="0.22" />
      </svg>
    );
  }
  if (kind === "product") {
    return (
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <rect width="100" height="75" fill={a} />
        <ellipse cx="50" cy="68" rx="22" ry="3" fill="#111" fillOpacity="0.15" />
        <rect x="38" y="22" width="24" height="42" rx="3" fill={b} />
        <rect x="38" y="22" width="24" height="8" fill="#111" fillOpacity="0.25" />
        <circle cx="50" cy="42" r="3" fill="#111" fillOpacity="0.4" />
      </svg>
    );
  }
  // video
  return (
    <div className="relative w-full h-full" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      {/* Faint scanlines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-7 h-7 rounded-full bg-surface/95 flex items-center justify-center">
          <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
            <path d="M0.5 0.5 L8.5 5.5 L0.5 10.5 Z" fill="#111111" />
          </svg>
        </span>
      </div>
    </div>
  );
}
