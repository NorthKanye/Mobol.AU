"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const BARS = 44;
// Deterministic bar heights — computed at module scope so server and client
// render identical markup (no render-time randomness).
const BAR_HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const wave = Math.sin((i / BARS) * Math.PI * 3) * 0.32 + 0.5;
  const ripple = Math.sin((i / BARS) * Math.PI * 13) * 0.18;
  return Math.min(0.95, Math.max(0.18, wave + ripple));
});

type Accent = {
  id: string;
  label: string;
  accent: string;
  expression: string;
  style: string;
  line: string;
  src: string;
  ready: boolean;
};

// `ready` flips to true once the matching MP3 is dropped into
// public/ai-demo/audio/ — see the asset workflow in CLAUDE.md.
const ACCENTS: ReadonlyArray<Accent> = [
  {
    id: "au-calm",
    label: "AU · calm",
    accent: "Australian",
    expression: "Calm support",
    style: "calm, warm, reassuring",
    line: "Hi Mia, your Aster Lane refill is packed and on its way — it'll reach you tomorrow.",
    src: "/ai-demo/audio/aster-lane-au-calm.mp3",
    ready: false,
  },
  {
    id: "uk-luxe",
    label: "UK · luxe",
    accent: "British",
    expression: "Luxury concierge",
    style: "measured, refined, unhurried",
    line: "Good evening. Your Aster Lane order has been prepared with care and will arrive tomorrow.",
    src: "/ai-demo/audio/aster-lane-uk-luxe.mp3",
    ready: false,
  },
  {
    id: "us-bright",
    label: "US · bright",
    accent: "American",
    expression: "Warm sales",
    style: "upbeat, friendly, energetic",
    line: "Hey Mia! Great news — your Aster Lane refill just shipped and lands tomorrow!",
    src: "/ai-demo/audio/aster-lane-us-bright.mp3",
    ready: false,
  },
  {
    id: "au-soft",
    label: "AU · soft",
    accent: "Australian",
    expression: "Soft apology",
    style: "gentle, sincere, softly apologetic",
    line: "Hi Mia, I'm sorry your order was delayed — it's on its way now, with a little extra for the wait.",
    src: "/ai-demo/audio/aster-lane-au-soft-apology.mp3",
    ready: false,
  },
];

const DURATION_MS = 9000;

export default function VoiceDemo() {
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState(ACCENTS[0].id);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRef = useRef(0);

  const selected = ACCENTS.find((a) => a.id === selectedId) ?? ACCENTS[0];

  // Detach handlers, pause, and drop the current Audio element.
  const releaseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audioRef.current = null;
    }
  };

  // While playing, advance progress — tracking the real clip's own timeline
  // when an MP3 is loaded, otherwise a fixed simulated duration.
  useEffect(() => {
    if (!playing) return;
    startRef.current = Date.now();
    const id = window.setInterval(() => {
      const audio = audioRef.current;
      const ratio =
        audio && audio.duration > 0
          ? audio.currentTime / audio.duration
          : (Date.now() - startRef.current) / DURATION_MS;
      const p = Math.min(Math.max(ratio, 0), 1);
      setProgress(p);
      if (p >= 1) {
        releaseAudio();
        setPlaying(false);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => releaseAudio, []);

  const stop = () => {
    releaseAudio();
    setPlaying(false);
    setProgress(0);
  };

  const play = () => {
    setProgress(0);
    setPlaying(true);
    // A real MP3 plays only once a clip is supplied (accent.ready); otherwise
    // the waveform and progress run as a visual preview.
    if (!selected.ready || typeof window === "undefined") return;
    const audio = new Audio(selected.src);
    audioRef.current = audio;
    const isCurrent = () => audioRef.current === audio;
    audio.onended = () => {
      if (!isCurrent()) return;
      releaseAudio();
      setPlaying(false);
      setProgress(1);
    };
    audio.onerror = () => {
      if (!isCurrent()) return;
      releaseAudio();
      setPlaying(false);
    };
    audio.play().catch(() => {
      if (!isCurrent()) return;
      releaseAudio();
      setPlaying(false);
    });
  };

  const togglePlay = () => {
    if (playing) stop();
    else play();
  };

  const selectAccent = (id: string) => {
    if (playing) stop();
    setSelectedId(id);
  };

  const animateWave = playing && !reduce;
  const elapsed = Math.max(0, Math.min(9, Math.round(progress * 9)));

  return (
    <div
      role="group"
      aria-label="AI voice generator — choose an accent and play a sample clip"
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-2">
            Gemini 3.1 Flash TTS
          </p>
          <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[9.5px] text-ink-2">
            {selected.ready ? "MP3" : "preview"}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5">
          <div className="flex h-24 items-center gap-[3px]" aria-hidden="true">
            {BAR_HEIGHTS.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full bg-ink/25 ${
                  animateWave ? "animate-chat-waveform-bar" : ""
                }`}
                style={{
                  height: `${Math.round(h * 100)}%`,
                  animationDelay: animateWave ? `${(i * 53) % 680}ms` : undefined,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Stop voice sample" : "Play voice sample"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-surface transition-transform hover:scale-[1.05] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {playing ? (
                <span className="h-3 w-3 rounded-[2px] bg-current" />
              ) : (
                <svg width="13" height="15" viewBox="0 0 13 15" aria-hidden="true">
                  <path d="M2 1.5 L11.5 7.5 L2 13.5 Z" fill="currentColor" />
                </svg>
              )}
            </button>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
              <span
                className="block h-full rounded-full bg-ink transition-[width] duration-100"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-ink-3">
              0:0{elapsed}&thinsp;/&thinsp;0:09
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {ACCENTS.map((accent) => {
            const active = accent.id === selectedId;
            return (
              <button
                key={accent.id}
                type="button"
                onClick={() => selectAccent(accent.id)}
                aria-pressed={active}
                className={`rounded-xl border px-1.5 py-2.5 text-center transition-colors ${
                  active
                    ? "border-ink bg-ink text-surface"
                    : "border-border bg-bg text-ink hover:border-ink/30"
                }`}
              >
                <span className="block text-[11px] font-semibold leading-tight">
                  {accent.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 h-[96px] rounded-xl border border-border bg-bg px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11.5px] font-medium text-ink">
              {selected.accent} &middot; {selected.expression}
            </p>
            <span className="font-mono text-[9.5px] text-ink-3">
              style: {selected.style}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.5] text-ink-2">
            &ldquo;{selected.line}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
