"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { RefObject } from "react";

export type TimelinePhase = {
  duration: number;
  tick: (phaseIndex: number) => void;
};

type Options = {
  amount?: number;
  shouldRun?: () => boolean;
};

export function usePausedTimeline(
  ref: RefObject<HTMLElement | null>,
  phases: TimelinePhase[],
  options?: Options
) {
  const amount = options?.amount ?? 0.2;
  const shouldRunRef = useRef(options?.shouldRun);
  shouldRunRef.current = options?.shouldRun;

  const isInView = useInView(ref, { amount });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isInView || reduce) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let i = 0;

    const step = () => {
      if (cancelled) return;
      const gate = shouldRunRef.current;
      if (gate && !gate()) {
        timer = setTimeout(step, 250);
        return;
      }
      const phase = phases[i % phases.length];
      phase.tick(i);
      timer = setTimeout(() => {
        i += 1;
        step();
      }, phase.duration);
    };
    step();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isInView, reduce, phases]);

  return { isInView, prefersReducedMotion: reduce };
}
