"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="transition-transform duration-300 group-hover:translate-x-0.5"
      aria-hidden="true"
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

export default function ClosingCta() {
  const ref = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-cta-heading"
      className={`closing-cta relative w-full overflow-hidden bg-surface py-28 sm:py-32 lg:py-40 min-h-[640px] md:min-h-[720px] lg:min-h-[820px] flex items-center ${
        entered ? "closing-cta-entered" : ""
      }`}
    >
      {/* Scatter — MacBook, top-right, hung off page (Acctual-style placement) */}
      <img
        src="/mac.avif"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="closing-cta-fade pointer-events-none select-none absolute hidden md:block"
        style={{
          top: "-280px",
          right: "-480px",
          width: "clamp(560px, 52vw, 760px)",
          transform: "rotate(-15deg)",
          transformOrigin: "center",
          "--reveal-delay": "700ms",
        } as CSSProperties}
      />

      {/* Scatter — boomerang, bottom-left, hung off page */}
      <img
        src="/boomerang.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="closing-cta-fade pointer-events-none select-none absolute hidden md:block"
        style={{
          bottom: "-90px",
          left: "-110px",
          width: "clamp(300px, 28vw, 420px)",
          transform: "rotate(-25deg)",
          transformOrigin: "center",
          "--reveal-delay": "800ms",
        } as CSSProperties}
      />

      <div className="relative max-w-[820px] mx-auto px-6 sm:px-8 flex flex-col items-center text-center">
        <p
          className="closing-cta-reveal font-mono text-[11px] tracking-[0.22em] uppercase text-ink-3"
          style={{ "--reveal-delay": "0ms" } as CSSProperties}
        >
          Let&apos;s begin
        </p>

        <h2
          id="closing-cta-heading"
          className="closing-cta-reveal mt-6 font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.25rem,4.6vw,3.75rem)] text-ink"
          style={{ "--reveal-delay": "100ms" } as CSSProperties}
        >
          Let&apos;s start
          <br />
          something new.
        </h2>

        <p
          className="closing-cta-reveal mt-6 text-[16px] leading-[1.65] text-ink-body max-w-[460px]"
          style={{ "--reveal-delay": "240ms" } as CSSProperties}
        >
          Tell us what you&apos;re building. We reply within two business days.
        </p>

        <Link
          href="/contact"
          className="closing-cta-reveal group relative mt-9 inline-flex items-center gap-2.5 rounded-full bg-ink text-surface h-12 pl-6 pr-5 text-[14px] font-medium overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
          style={{ "--reveal-delay": "400ms" } as CSSProperties}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(120% 80% at 100% 0%, rgba(240,239,236,0.18), transparent 60%)",
            }}
          />
          Start a project
          <Arrow />
        </Link>

        <svg
          viewBox="0 0 720 100"
          preserveAspectRatio="none"
          className="closing-cta-reveal mt-16 w-full max-w-[640px] h-[90px] text-ink"
          style={{ "--reveal-delay": "520ms" } as CSSProperties}
          aria-hidden="true"
        >
          <path
            d="M 20 30 C 200 90, 380 10, 560 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="0.1 9"
            opacity="0.7"
          />
          <circle
            cx="560"
            cy="70"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.85"
          />
          <circle cx="560" cy="70" r="2.5" fill="currentColor" opacity="0.85" />
        </svg>
      </div>
    </section>
  );
}
