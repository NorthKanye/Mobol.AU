"use client";

import { useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";
import { chatScript } from "./chatScript";
import { useChatScript } from "./useChatScript";

export default function ChatMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const {
    phase,
    messages,
    showTypingDots,
    reducedMotion,
    enterViewport,
    exitViewport,
    submitUserMessage,
  } = useChatScript(chatScript);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("chat-paused", !entry.isIntersecting);
        if (entry.isIntersecting) {
          enterViewport();
        } else {
          exitViewport();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, [enterViewport, exitViewport, reducedMotion]);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Mobol AI demo chat"
      className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative bg-surface border border-black/[0.04] flex flex-col"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <ChatWindow />
      <div className="absolute inset-x-0 top-[8.5%] bottom-0 flex flex-col">
        <ChatThread
          messages={messages}
          showTypingDots={showTypingDots}
          reducedMotion={reducedMotion}
        />
        <ChatInput phase={phase} onSendMessageAction={submitUserMessage} />
      </div>
    </div>
  );
}
