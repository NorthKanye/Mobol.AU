"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  /**
   * Trigger threshold expressed as a fraction of viewport height from the top.
   * 0.8 = fires when this point has scrolled to 80% down the viewport
   * (i.e. element is 20% in from the bottom — a common "in view" trigger).
   */
  triggerAtVh?: number;
};

export default function ScrollDebugMarker({ label, triggerAtVh = 0.45 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setFired(rect.top <= window.innerHeight * triggerAtVh);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [triggerAtVh]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-0 pointer-events-none select-none"
    >
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ backgroundColor: fired ? "#16a34a" : "#e8442e" }}
      />
      <div
        className="absolute top-0 left-0 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] text-white rounded-sm"
        style={{ backgroundColor: fired ? "#16a34a" : "#e8442e" }}
      >
        {label} · trigger@{Math.round(triggerAtVh * 100)}vh{fired ? " · FIRED" : ""}
      </div>
    </div>
  );
}
