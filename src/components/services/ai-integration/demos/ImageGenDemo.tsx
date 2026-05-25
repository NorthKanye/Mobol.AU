"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const ease = [0.16, 1, 0.3, 1] as const;

type Shot = { prompt: string; src: string; alt: string; label: string };

// `src` points at committed Aster Lane assets so the demo never looks broken.
// Drop dedicated renders in public/ai-demo/ai-integration/ and update src here.
const SHOTS: ReadonlyArray<Shot> = [
  {
    prompt:
      "Aster Lane hero set — frosted-glass serum bottle, charcoal cap, warm off-white plaster, muted sage backdrop, soft morning light",
    src: "/ai-demo/aster-lane-product-set.png",
    alt: "Generated Aster Lane skincare hero product set.",
    label: "Hero shot",
  },
  {
    prompt:
      "Overhead flatlay — refillable skincare on warm off-white linen, serum, refill pouch, ceramic dish, sage sprig, soft daylight",
    src: "/ai-demo/aster-lane-flatlay.png",
    alt: "Generated Aster Lane skincare flatlay.",
    label: "Social flatlay",
  },
  {
    prompt:
      "Cinematic campaign frame — single serum bottle in soft window light, warm off-white wall, faint mist, shallow depth of field",
    src: "/ai-demo/aster-lane-video-frame.png",
    alt: "Generated Aster Lane cinematic campaign frame.",
    label: "Ad frame",
  },
];

type Status = "typing" | "generating" | "done";

const LAST = SHOTS.length - 1;

export default function ImageGenDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [shotIdx, setShotIdx] = useState(LAST);
  const [typed, setTyped] = useState(SHOTS[LAST].prompt.length);
  const [status, setStatus] = useState<Status>("done");

  const phases = useMemo<TimelinePhase[]>(() => {
    const out: TimelinePhase[] = [];
    SHOTS.forEach((shot, idx) => {
      for (let c = 0; c <= shot.prompt.length; c++) {
        out.push({
          duration: c === 0 ? 500 : 32,
          tick: () => {
            setShotIdx(idx);
            setTyped(c);
            setStatus("typing");
          },
        });
      }
      out.push({ duration: 2200, tick: () => setStatus("generating") });
      out.push({ duration: 6000, tick: () => setStatus("done") });
    });
    return out;
  }, []);

  // usePausedTimeline never starts the loop under prefers-reduced-motion, so
  // state stays at its initial (final) values — no extra branching needed.
  usePausedTimeline(ref, phases);

  const shot = SHOTS[shotIdx];
  const typedText = shot.prompt.slice(0, typed);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of AI image generation: a campaign prompt is typed out, then an on-brand Aster Lane product image is generated from it."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="rounded-2xl bg-[#f1f1f2] p-3">
          <p className="h-[54px] overflow-hidden text-[12px] leading-[1.5] text-ink-body">
            {typedText}
            {status === "typing" && (
              <motion.span
                aria-hidden="true"
                className="ml-px inline-block h-[12px] w-[2px] translate-y-[1px] bg-ink"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-ink-3">
              image prompt
            </span>
            <span
              aria-hidden="true"
              className="grid h-6 w-6 place-items-center rounded-full bg-ink text-surface"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 0.5 L7.1 4.9 L11.5 6 L7.1 7.1 L6 11.5 L4.9 7.1 L0.5 6 L4.9 4.9 Z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="relative mt-3 flex-1 overflow-hidden rounded-xl border border-border bg-bg">
          {status === "done" ? (
            <motion.div
              key={shotIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="absolute inset-0"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-ink backdrop-blur-sm">
                {shot.label}
              </span>
            </motion.div>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              {status === "generating" && (
                <>
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-y-0 w-1/3"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
                    }}
                    animate={{ x: ["-130%", "330%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center gap-2 text-[11px] text-ink-2">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-ink-3"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.16 }}
                      />
                    ))}
                    <span className="ml-1">Generating image&hellip;</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[9.5px] text-ink-3">
            on-brand &middot; art-directable
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {SHOTS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === shotIdx ? "bg-ink" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
