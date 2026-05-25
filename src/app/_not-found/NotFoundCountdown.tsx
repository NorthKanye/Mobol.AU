"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const COUNTDOWN_MS = 10_000;

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M3 7 H11 M7.5 3 L11 7 L7.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotFoundCountdown() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const deadlineRef = useRef<number>(Date.now() + COUNTDOWN_MS);
  const [remaining, setRemaining] = useState(10);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const msLeft = deadlineRef.current - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      setRemaining(next);

      if (next <= 0) {
        router.replace("/");
        return;
      }

      const nextBoundary = msLeft - (next - 1) * 1000;
      timerId = setTimeout(tick, Math.max(50, nextBoundary));
    };

    tick();

    return () => {
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [router]);

  const entry = (delay: number) =>
    reduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.15, delay },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <div className="flex max-w-2xl flex-col items-center text-center">
      <motion.p
        {...entry(0)}
        className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2"
      >
        Error 404
      </motion.p>

      <motion.h1
        ref={headingRef}
        tabIndex={-1}
        {...entry(0.08)}
        className="mt-6 font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.25rem,4.6vw,3.75rem)] text-ink focus:outline-none"
      >
        This page hasn&rsquo;t been built yet.
      </motion.h1>

      <motion.p
        {...entry(0.16)}
        className="mt-6 max-w-[460px] text-[16px] leading-[1.65] text-ink-body"
      >
        You&rsquo;ve stumbled on a route that doesn&rsquo;t exist. Let&rsquo;s
        get you back on the map.
      </motion.p>

      <motion.div {...entry(0.24)} className="mt-9">
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink text-surface h-12 pl-6 pr-5 text-[14px] font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 80% at 100% 0%, rgba(240,239,236,0.18), transparent 60%)",
            }}
          />
          Take me home
          <Arrow />
        </Link>
      </motion.div>

      <motion.p
        {...entry(0.32)}
        className="mt-6 text-[13px] text-ink-2"
        aria-hidden="true"
      >
        Auto-redirecting in{" "}
        <span className="inline-block w-[1ch] text-left align-baseline text-ink tabular-nums">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={remaining}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{
                duration: reduceMotion ? 0.15 : 0.25,
                ease: EASE,
              }}
              className="inline-block"
            >
              {remaining}
            </motion.span>
          </AnimatePresence>
        </span>
        s
      </motion.p>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {remaining === 0
          ? "Redirecting to home now."
          : remaining === 5
            ? "Five seconds until automatic redirect to home."
            : ""}
      </p>
    </div>
  );
}
