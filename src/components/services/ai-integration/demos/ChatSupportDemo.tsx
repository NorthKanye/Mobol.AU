"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type OrderWidget = { kind: "order"; ref: string; status: string; action: string };
type BundleWidget = { kind: "bundle"; name: string; items: string[]; credit: string };
type Widget = OrderWidget | BundleWidget;

type Message = { from: "customer" | "ai"; text: string; widget?: Widget };

const THREAD: ReadonlyArray<Message> = [
  {
    from: "customer",
    text: "Hi — I'm Mia. My Barrier Cream order from last week still hasn't shown up and I'd like a refund please.",
  },
  {
    from: "ai",
    text: "Found it — AusPost left it stuck at the Perth depot, so that's on us. Rather than a refund and a wait, I've re-shipped a fresh one today on free express:",
    widget: {
      kind: "order",
      ref: "AL-10872",
      status: "AusPost — held at the Perth depot",
      action: "Re-shipped free · express · arrives tomorrow",
    },
  },
  {
    from: "customer",
    text: "Yes please. Honestly my skin's been so reactive lately, I'm not even sure the cream is the right pick anymore.",
  },
  {
    from: "ai",
    text: "Reactive skin usually means a stressed barrier. The Barrier Cream is still right for that — I'd pair it with the Hydration Mist and skip strong actives for a week or two.",
  },
  {
    from: "customer",
    text: "That makes sense. Could you swap my order to something that covers all of that?",
  },
  {
    from: "ai",
    text: "Done — swapped it to the Sensitive-Skin Bundle. It's cheaper than those items separately, so you've got money back too:",
    widget: {
      kind: "bundle",
      name: "Sensitive-Skin Bundle",
      items: ["Barrier Cream", "Hydration Mist", "Night Renewal Serum — sample"],
      credit: "$14 credit returned to your card",
    },
  },
  {
    from: "customer",
    text: "Amazing, thank you. I always forget to repurchase before I run out, too.",
  },
  {
    from: "ai",
    text: "Sorted — auto-refill set for every 8 weeks, and your express tracking is on its way. Skip or change it anytime by messaging me.",
  },
];

function MessageWidget({ widget }: { widget: Widget }) {
  if (widget.kind === "order") {
    return (
      <div className="max-w-[300px] rounded-xl border border-border bg-surface p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10.5px] font-semibold text-ink">
            Order {widget.ref}
          </span>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
            Delayed
          </span>
        </div>
        <p className="mt-1 text-[10.5px] text-ink-2">{widget.status}</p>
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5">
          <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-emerald-500 text-surface">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="m2 5 2 2 4-4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[10.5px] font-medium leading-tight text-emerald-800">
            {widget.action}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[300px] rounded-xl border border-border bg-surface p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-ink">{widget.name}</span>
        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
          Order updated
        </span>
      </div>
      <div className="mt-1.5 space-y-1">
        {widget.items.map((item) => (
          <div key={item} className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-ink-3" />
            <span className="text-[10.5px] text-ink-2">{item}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 border-t border-border pt-2 text-[10.5px] font-semibold text-ink">
        {widget.credit}
      </p>
    </div>
  );
}

export default function ChatSupportDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  // Plays once, the first time it scrolls into view — never replays.
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(THREAD.length);
      setTyping(false);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let clock = 0;
    const at = (delay: number, fn: () => void) => {
      clock += delay;
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, clock),
      );
    };
    THREAD.forEach((msg, i) => {
      if (msg.from === "customer") {
        at(i === 0 ? 650 : 2300, () => setShown(i + 1));
      } else {
        at(700, () => setTyping(true));
        at(1500, () => {
          setTyping(false);
          setShown(i + 1);
        });
      }
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const el = threadRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    }
  }, [shown, typing, reduce]);

  const messages = THREAD.slice(0, shown);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of the Aster Lane AI assistant resolving a customer's delivery problem — it re-ships the order free, diagnoses their skin concern, swaps the order to a bundle with a credit, and sets up an automatic refill."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-surface px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </span>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[12px] font-medium text-ink">Aster Lane Assistant</p>
          </div>
          <span className="w-[45px]" aria-hidden="true" />
        </div>

        <div
          ref={threadRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {messages.map((msg, i) =>
            msg.from === "customer" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                className="flex justify-end"
              >
                <p className="max-w-[80%] rounded-2xl rounded-br-md bg-[#f0f0f0] px-3.5 py-2 text-[13px] leading-[1.5] text-ink-body">
                  {msg.text}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                className="flex gap-2.5"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[9px] font-semibold text-surface">
                  A
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[13px] leading-[1.6] text-ink-body">{msg.text}</p>
                  {msg.widget && <MessageWidget widget={msg.widget} />}
                </div>
              </motion.div>
            ),
          )}

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[9px] font-semibold text-surface">
                A
              </span>
              <span className="flex items-center gap-1 py-2">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-ink-3"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.16 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </div>

        <div className="border-t border-black/[0.06] px-3 py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-4 pr-1.5">
            <span className="flex-1 text-[12px] text-ink-3">Message Aster Lane&hellip;</span>
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-surface"
            >
              <svg width="11" height="12" viewBox="0 0 12 13" fill="none">
                <path
                  d="M6 11 V2.5 M2.5 6 L6 2.5 L9.5 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
