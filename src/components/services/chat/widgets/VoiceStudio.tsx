"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "voiceStudio" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const BARS = 34;
const HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const wave = Math.sin((i / BARS) * Math.PI * 3.1) * 0.36 + 0.54;
  const noise = ((i * 5179 + 28411) % 1000) / 1000;
  return Math.max(0.22, Math.min(0.95, wave * 0.72 + noise * 0.36));
});

export default function VoiceStudio({ widget, reducedMotion, isLatest }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(widget.accents[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"ready" | "pending" | "fallback">("pending");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAt = useRef(0);
  const durationMs = Math.max(widget.durationSec, 3) * 1000;
  const selectedAccent = useMemo(
    () => widget.accents.find((accent) => accent.id === selectedId) ?? widget.accents[0],
    [selectedId, widget.accents],
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    startedAt.current = Date.now();
    setProgress(0);
    const id = window.setInterval(() => {
      const next = Math.min((Date.now() - startedAt.current) / durationMs, 1);
      setProgress(next);
      if (next >= 1) {
        setPlaying(false);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [durationMs, playing]);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setProgress(0);
  };

  const play = () => {
    setExpanded(true);
    if (playing) {
      stop();
      return;
    }

    setPlaying(true);
    setStatus(selectedAccent?.ready ? "ready" : "pending");

    if (!selectedAccent?.ready || typeof window === "undefined") {
      return;
    }

    const audio = new Audio(selectedAccent.src);
    audioRef.current = audio;
    audio.onplay = () => setStatus("ready");
    audio.onended = () => {
      setPlaying(false);
      setProgress(1);
    };
    audio.onerror = () => {
      setStatus("fallback");
      audioRef.current = null;
    };
    audio.play().catch(() => {
      setStatus("fallback");
      audioRef.current = null;
    });
  };

  const chooseAccent = (id: string) => {
    setSelectedId(id);
    if (playing) stop();
    setStatus("pending");
  };

  const animateWave = !reducedMotion && (playing || isLatest);
  const allPlaceholder = widget.accents.every((accent) => !accent.ready);
  const statusCopy =
    status === "ready"
      ? "playing MP3"
      : status === "fallback"
        ? "visual preview"
        : allPlaceholder
          ? "preview waveform"
          : "MP3 pending";

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={play}
          aria-label={playing ? "Stop voice preview" : "Play voice preview"}
          className="shrink-0 w-10 h-10 rounded-full bg-ink text-surface flex items-center justify-center transition-transform hover:scale-[1.04] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {playing ? (
            <span className="w-3 h-3 rounded-[2px] bg-current" aria-hidden="true" />
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
              <path d="M1 1 L9 6 L1 11 Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-medium text-ink truncate">{widget.title}</p>
            <span className="text-[11px] tabular-nums text-ink-2">{widget.durationSec}s</span>
          </div>
          <div className="mt-1.5 h-8 flex items-center gap-[2px]" aria-hidden="true">
            {HEIGHTS.map((height, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full bg-ink/20 ${
                  animateWave ? "animate-chat-waveform-bar" : ""
                }`}
                style={{
                  height: `${Math.round(height * 100)}%`,
                  animationDelay: animateWave ? `${(i * 47) % 640}ms` : undefined,
                }}
              />
            ))}
          </div>
          <div className="mt-1 h-1 rounded-full bg-bg overflow-hidden" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-ink transition-[width] duration-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="text-[11px] font-medium text-ink-2 hover:text-ink transition-colors"
        >
          {expanded ? "Hide voice options" : "Choose accent / expression"}
        </button>
        <span className="rounded-full bg-bg border border-border px-2 py-1 text-[10px] text-ink-2">
          {statusCopy}
        </span>
      </div>

      {expanded ? (
        <div className="mt-3 pt-3 border-t border-border animate-chat-widget-in">
          <div className="grid grid-cols-2 gap-1.5">
            {widget.accents.map((accent) => (
              <button
                key={accent.id}
                type="button"
                onClick={() => chooseAccent(accent.id)}
                aria-pressed={selectedId === accent.id}
                className={`rounded-2xl border px-2.5 py-2 text-left transition-colors ${
                  selectedId === accent.id
                    ? "bg-ink text-surface border-ink"
                    : "bg-bg text-ink border-border hover:border-ink/25"
                }`}
              >
                <span className="block text-[11px] font-semibold leading-tight">
                  {accent.label}
                </span>
                <span
                  className={`mt-0.5 block text-[10px] leading-tight ${
                    selectedId === accent.id ? "text-surface/68" : "text-ink-2"
                  }`}
                >
                  {accent.expression}
                </span>
              </button>
            ))}
          </div>
          {selectedAccent ? (
            <div className="mt-2.5 rounded-2xl bg-bg border border-border px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-ink">
                  {selectedAccent.accent} · {selectedAccent.tone}
                </p>
                <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-ink-3">
                  upload path
                </span>
              </div>
              <p className="mt-1 text-[10px] font-mono leading-[1.4] text-ink-2 break-all">
                {selectedAccent.src}
              </p>
              <p className="mt-2 text-[11px] leading-[1.45] text-ink-2">
                "{widget.script}"
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
