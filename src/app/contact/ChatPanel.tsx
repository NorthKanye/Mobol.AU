"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const STARTERS = [
  "Explain how server-sent events work.",
  "Suggest a name for a small design studio.",
  "Outline a 3-day Lisbon trip.",
];

const MAX_COMPOSER_HEIGHT = 200;

export default function ChatPanel({ active }: { active: boolean }) {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);

  const isStreaming = status === "submitted" || status === "streaming";
  const canSend = !isStreaming && input.trim().length > 0;

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
    // Reset composer height after the value clears.
    if (composerRef.current) {
      composerRef.current.style.height = "";
    }
  }, [input, isStreaming, sendMessage]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      (e.key === "Enter" || e.key === "NumpadEnter")
    ) {
      e.preventDefault();
      send();
    }
  };

  // Auto-grow composer up to a cap.
  const autosize = useCallback(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
  }, []);

  useLayoutEffect(() => {
    autosize();
  }, [input, autosize]);

  // Scroll to latest message.
  useEffect(() => {
    if (!listEndRef.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listEndRef.current.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "end",
    });
  }, [messages.length, status]);

  // Focus composer when the panel becomes active.
  useEffect(() => {
    if (active) composerRef.current?.focus();
  }, [active]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-3">
              Live demo
            </p>
            <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-tighter-display text-ink leading-tight max-w-[420px]">
              Ask me anything.
            </h3>
            <p className="mt-3 text-[14px] leading-[1.55] text-ink-body max-w-[360px]">
              A streaming chat interface — type a prompt or pick a starter
              below.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2 max-w-[480px]">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    composerRef.current?.focus();
                  }}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-[13px] text-ink-body transition-colors hover:border-ink/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ol
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Chat conversation"
            className="absolute inset-0 overflow-y-auto px-1 sm:px-2 pb-4 pt-2 flex flex-col gap-3"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              return (
                <li
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <span className="sr-only">
                    {isUser ? "You said: " : "Assistant said: "}
                  </span>
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-ink text-surface px-4 py-2.5 text-[14.5px] leading-[1.55] whitespace-pre-wrap break-words"
                        : "max-w-[90%] rounded-2xl rounded-bl-sm bg-[#fafaf9] border border-border text-ink-body px-4 py-2.5 text-[14.5px] leading-[1.55] whitespace-pre-wrap break-words"
                    }
                  >
                    {text || (
                      <span
                        aria-hidden="true"
                        className="inline-flex gap-1 align-middle"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-3 animate-pulse [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-3 animate-pulse [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-3 animate-pulse [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
            <div ref={listEndRef} aria-hidden="true" />
          </ol>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mx-1 mb-2 rounded-lg border border-[#a83232]/30 bg-[#a83232]/[0.06] px-3 py-2 text-[13px] text-[#a83232]"
        >
          Something went wrong. Please try again.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-surface pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-bg/60 px-3 py-2.5 transition-colors focus-within:border-ink/40 focus-within:bg-surface">
          <label htmlFor="chat-composer" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-composer"
            ref={composerRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message…"
            className="flex-1 resize-none bg-transparent text-[15px] leading-[1.55] text-ink placeholder:text-ink-3 outline-none max-h-[200px]"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop generating"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-surface transition-transform hover:scale-[1.04] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <span
                aria-hidden="true"
                className="block h-2.5 w-2.5 rounded-[2px] bg-surface"
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-surface transition disabled:bg-ink-3 disabled:cursor-not-allowed enabled:hover:scale-[1.04] enabled:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 11.5V2.5M7 2.5L3 6.5M7 2.5l4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-[11px] text-ink-3">
          ⌘ + Enter to send · Enter for newline
        </p>
      </form>
    </div>
  );
}
