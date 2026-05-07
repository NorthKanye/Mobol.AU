import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "voice" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const BARS = 32;
// Hardcoded sine + noise heights, normalized 0–1. Stable across renders.
const HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const sine = Math.sin((i / BARS) * Math.PI * 2.6) * 0.42 + 0.5;
  const noise = ((i * 9301 + 49297) % 233280) / 233280;
  const taper = 1 - Math.abs(i - BARS / 2) / (BARS * 0.85); // softer at edges
  return Math.max(0.22, Math.min(0.96, (sine * 0.7 + noise * 0.45) * taper + 0.18));
});

export default function VoiceMessage({ widget, reducedMotion, isLatest }: Props) {
  const animate = !reducedMotion && isLatest;
  const durationMs = Math.max(2000, widget.durationSec * 1000);

  return (
    <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-3 py-2.5 max-w-[380px] relative">
      <button
        type="button"
        aria-label="Play voice message"
        className="shrink-0 w-9 h-9 rounded-full bg-ink text-surface flex items-center justify-center relative"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full ring-1 ring-ink/15"
        />
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
          <path d="M0.5 0.5 L8.5 5.5 L0.5 10.5 Z" fill="currentColor" />
        </svg>
      </button>
      <div
        className="flex-1 relative h-7 flex items-center"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center gap-[2px]">
          {HEIGHTS.map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-[2px] bg-ink/30 ${animate ? "animate-chat-waveform-bar" : ""}`}
              style={{
                height: `${Math.round(h * 100)}%`,
                animationDelay: animate ? `${(i * 38) % 720}ms` : undefined,
              }}
            />
          ))}
        </div>
        {animate ? (
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none animate-chat-voice-progress"
            style={{ animationDuration: `${durationMs}ms` }}
          >
            <div className="h-full flex items-center gap-[2px] w-full">
              {HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[2px] bg-ink"
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-ink-2">
        0:{widget.durationSec.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
