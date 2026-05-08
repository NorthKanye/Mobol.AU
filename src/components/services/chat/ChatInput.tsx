"use client";

import { useEffect, useRef, useState } from "react";
import type { Phase } from "./types";

type Props = {
  phase: Phase;
  onSendMessageAction: (text: string) => void;
};

export default function ChatInput({ phase, onSendMessageAction }: Props) {
  const [value, setValue] = useState("");
  const [readyPulse, setReadyPulse] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(false);
  const prevPhaseRef = useRef<Phase>(phase);
  const disabled = phase !== "done";

  // Detect playing/idle/paused → done transition exactly once and trigger
  // the one-shot ready signal: 1.5s border pulse + placeholder fade-in.
  useEffect(() => {
    const prev = prevPhaseRef.current;
    const becameReady =
      phase === "done" &&
      (prev === "playing" || prev === "idle" || prev === "paused");
    prevPhaseRef.current = phase;
    if (!becameReady) {
      // First mount under reduced-motion: phase is already "done" — show
      // placeholder without the pulse.
      if (phase === "done" && !placeholderVisible) {
        setPlaceholderVisible(true);
      }
      return;
    }
    setReadyPulse(true);
    setPlaceholderVisible(true);
    const id = window.setTimeout(() => setReadyPulse(false), 1500);
    return () => window.clearTimeout(id);
  }, [phase, placeholderVisible]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSendMessageAction(trimmed);
    setValue("");
  };

  const placeholder = (() => {
    switch (phase) {
      case "responding":
        return "AI is responding…";
      case "playing":
      case "paused":
      case "idle":
        return "";
      case "done":
      default:
        return "Ask about AI for your business…";
    }
  })();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-border bg-surface px-3 py-2.5 flex items-center gap-2"
    >
      <div
        className={`flex-1 rounded-full ${readyPulse ? "chat-input-ready" : ""}`}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
          rows={1}
          maxLength={280}
          placeholder={placeholder}
          aria-label="Message the AI"
          style={{
            transition: "opacity 350ms ease-out",
          }}
          className={`w-full resize-none bg-bg rounded-full px-4 py-2 text-[13px] leading-[1.4] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink/15 disabled:opacity-60 disabled:cursor-not-allowed max-h-20 ${
            placeholderVisible ? "placeholder:opacity-100" : "placeholder:opacity-0"
          }`}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className="shrink-0 w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center transition-transform hover:scale-[1.04] active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 10 V2 M2.5 5.5 L6 2 L9.5 5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
