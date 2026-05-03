"use client";

import { useEffect, useRef } from "react";

type LanyardProps = {
  /** Override the fluid scale with a fixed value (e.g. "0.55") for tablet/compact layouts. */
  scale?: string;
};

export default function Lanyard({ scale }: LanyardProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const triggers = document.querySelectorAll<HTMLElement>(
      "[data-smile-trigger]",
    );
    if (triggers.length === 0) return;

    // Single source of truth for the animation state. The RAF tick reads
    // `direction` each frame and self-exits if it's no longer "reverse",
    // which is how we handle rapid hover toggles cleanly.
    const animState: {
      rafId: number | null;
      direction: "forward" | "reverse" | "idle";
    } = { rafId: null, direction: "idle" };

    const cancelRAF = () => {
      if (animState.rafId !== null) {
        cancelAnimationFrame(animState.rafId);
        animState.rafId = null;
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const playForward = () => {
      cancelRAF();
      animState.direction = "forward";

      if (reducedMotion) {
        // Snap to end without animation
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration;
        }
        return;
      }

      // Native play() resumes from current currentTime. If we were
      // mid-reverse at t=0.4, this picks up from 0.4 going forward.
      // loop=false (default) means it pauses naturally at duration.
      video.play().catch(() => {
        /* Browser may block autoplay in edge cases; silent fail is fine
           since the video is decorative. */
      });
    };

    const playReverse = () => {
      cancelRAF();
      animState.direction = "reverse";
      video.pause();

      if (reducedMotion) {
        video.currentTime = 0;
        animState.direction = "idle";
        return;
      }

      // RAF-driven scrubbing: each frame, decrement currentTime by the
      // real elapsed wall-clock delta. This means reverse plays at
      // exactly 1x speed regardless of monitor refresh rate.
      let lastFrameTime = performance.now();
      const tick = () => {
        if (animState.direction !== "reverse") {
          animState.rafId = null;
          return;
        }
        const now = performance.now();
        const delta = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        const newTime = Math.max(0, video.currentTime - delta);
        video.currentTime = newTime;

        if (newTime > 0) {
          animState.rafId = requestAnimationFrame(tick);
        } else {
          // Reached the start — hold here, exit RAF loop.
          animState.rafId = null;
          animState.direction = "idle";
        }
      };
      animState.rafId = requestAnimationFrame(tick);
    };

    const onEnter = () => playForward();
    const onLeave = () => playReverse();

    triggers.forEach((t) => {
      t.addEventListener("mouseenter", onEnter);
      t.addEventListener("mouseleave", onLeave);
      t.addEventListener("focus", onEnter);
      t.addEventListener("blur", onLeave);
    });

    return () => {
      cancelRAF();
      triggers.forEach((t) => {
        t.removeEventListener("mouseenter", onEnter);
        t.removeEventListener("mouseleave", onLeave);
        t.removeEventListener("focus", onEnter);
        t.removeEventListener("blur", onLeave);
      });
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center"
      style={
        {
          // Fluid scale tuned so the badge supports the headline rather than dominating it.
          // 1024 → 0.85, 1280 → 0.94, 1536 → 1.04, 1920 → 1.08 (capped).
          "--s":
            scale ?? "clamp(0.85, calc(0.85 + (100vw - 1024px) / 2700px), 1.08)",
        } as React.CSSProperties
      }
    >
      {/* Strap. Black ribbon emerging from the nav's threading slot. The
          strap ends in a clean horizontal cut at the bottom of its viewBox.
          The pill clip that connects strap-to-badge is drawn inside the
          badge SVG (so the pill animates with the badge, like a real clip
          riveted onto the card). */}
      <svg
        viewBox="0 0 60 180"
        className="block shrink-0"
        style={{
          width: "calc(var(--s) * 60px)",
          height: "calc(var(--s) * 180px)",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="strap-weave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1a1c" />
            <stop offset="22%" stopColor="#0e0e0e" />
            <stop offset="78%" stopColor="#0a0a0b" />
            <stop offset="100%" stopColor="#050506" />
          </linearGradient>
        </defs>

        {/* Strap body — shorter length so the badge bottom lands near the
            same vertical level as the hero text/buttons. */}
        <path
          d="M 18 0 L 42 0 L 41.5 180 L 18.5 180 Z"
          fill="url(#strap-weave)"
        />

        {/* Stitching */}
        <path
          d="M 21 6 L 22 176"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          fill="none"
        />
        <path
          d="M 39 6 L 38 176"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          fill="none"
        />
      </svg>

      {/* Badge stack. The pill clip is drawn inside the front-card SVG at
          negative y values (above the body), so the pill rotates with the
          badge as one unit. marginTop=+10 leaves room for the 12px-tall
          pill stem to sit between strap-bottom and body-top, with a 2px
          overlap into the strap so there's no visible seam. */}
      <div
        className="animate-lanyard-badge shrink-0 relative"
        style={{ marginTop: "calc(var(--s) * 10px)" }}
      >
        <figure
          className="pointer-events-none m-0 relative"
          aria-label="Mobol founder ID badge: Kyle Oakley"
          role="img"
        >
          {/* Back card — second silhouette tucked behind, peeking out the
              LEFT side. MOBOL wordmark runs vertically along the exposed
              strip, bottom-to-top reading orientation. Pivots from
              top-center (where the pill connects) just like the front. */}
          <svg
            viewBox="0 0 280 380"
            className="absolute animate-lanyard-back"
            style={{
              width: "calc(var(--s) * 280px)",
              height: "calc(var(--s) * 380px)",
              top: "calc(var(--s) * -6px)",
              left: 0,
              overflow: "visible",
              filter: "drop-shadow(-6px 6px 14px rgba(0,0,0,0.10))",
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <path
              d="M 32 0 L 248 0 A 32 32 0 0 1 280 32 L 280 348 A 32 32 0 0 1 248 380 L 32 380 A 32 32 0 0 1 0 348 L 0 32 A 32 32 0 0 1 32 0 Z"
              fill="#0E0E0E"
            />
            {/* Lowercase "mobol" wordmark — matches the brand wordmark in
                the nav. Sized and positioned to sit within the diagonal
                strip exposed by the back card's +7° rotation: text is
                rotated -90° so it reads top-to-bottom along the spine. */}
            <text
              x="14"
              y="240"
              fill="#f0efec"
              fontSize="16"
              fontWeight="600"
              letterSpacing="-0.3"
              transform="rotate(-90 14 240)"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              mobol
            </text>
          </svg>

          {/* Front card. Pure white body, with the pill clip drawn last in
              the SVG so it renders on top of the body (and above the body
              via overflow:visible). One drop-shadow traces the silhouette
              and pill together. */}
          <svg
            viewBox="0 0 280 380"
            className="relative block"
            style={{
              width: "calc(var(--s) * 280px)",
              height: "calc(var(--s) * 380px)",
              overflow: "visible",
              filter:
                "drop-shadow(8px 14px 24px rgba(17,17,17,0.08)) drop-shadow(16px 36px 60px rgba(17,17,17,0.10))",
              zIndex: 1,
            }}
          >
            <defs>
              {/* Vertical gradient gives the pill clip subtle dimensionality
                  — top edge a hair lighter, body solid black, bottom darker.
                  Reads as injection-molded plastic rather than a sticker. */}
              <linearGradient id="pill-shade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c1c1e" />
                <stop offset="50%" stopColor="#0a0a0b" />
                <stop offset="100%" stopColor="#050506" />
              </linearGradient>
            </defs>

            {/* Card body — pure white silhouette with generous corner
                rounding (32px). Matches the soft, modern ID-badge look in
                the reference. */}
            <path
              d="M 32 0 L 248 0 A 32 32 0 0 1 280 32 L 280 348 A 32 32 0 0 1 248 380 L 32 380 A 32 32 0 0 1 0 348 L 0 32 A 32 32 0 0 1 32 0 Z"
              fill="#ffffff"
            />

            {/* Card content — inset cream zone floating inside a white
                frame (per reference). 14px white padding all around the
                cream zone gives the badge a passport-photo feel. */}
            <foreignObject x="0" y="0" width="280" height="380">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "calc(var(--s) * 16px) calc(var(--s) * 16px) calc(var(--s) * 18px)",
                  boxSizing: "border-box",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "calc(var(--s) * 14px)",
                }}
              >
                {/* Red accent dot — sits just inside the top-left corner of
                    the white frame, as a small brand marker. */}
                <div
                  className="absolute rounded-full bg-[#e8442e]"
                  style={{
                    top: "calc(var(--s) * 16px)",
                    left: "calc(var(--s) * 16px)",
                    width: "calc(var(--s) * 6px)",
                    height: "calc(var(--s) * 6px)",
                  }}
                />

                {/* Inset cream zone — single video element holds frame 0
                    (neutral) by default. Hovering [data-smile-trigger]
                    plays it forward (pauses at end via loop=false);
                    leaving the trigger reverses it via RAF scrubbing.
                    Logic lives in the useEffect at the top of this
                    component. */}
                <div
                  className="bg-[#E8E5DE] overflow-hidden relative"
                  style={{
                    flex: 1,
                    marginTop: "calc(var(--s) * 4px)",
                    borderRadius: "calc(var(--s) * 12px)",
                  }}
                >
                  <video
                    ref={videoRef}
                    src="/video.mp4"
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                  />
                </div>

                {/* Info bar — single tight cluster directly under the cream
                    zone. Name in two lines, then a meta row aligned to the
                    baseline of the small caps so the # number sits flush
                    with the FOUNDER label. */}
                <div style={{ fontSize: "calc(var(--s) * 16px)" }}>
                  <p
                    className="font-semibold leading-[1] tracking-[-0.025em] text-ink"
                    style={{ fontSize: "1.05em" }}
                  >
                    Oakley
                    <br />
                    Kyle
                  </p>
                  <div
                    className="flex items-baseline justify-between"
                    style={{ marginTop: "calc(var(--s) * 9px)" }}
                  >
                    <span
                      className="uppercase tracking-[0.22em] text-ink-2 font-medium"
                      style={{ fontSize: "0.5em" }}
                    >
                      Founder
                    </span>
                    <span
                      className="text-ink-3 tabular-nums"
                      style={{ fontSize: "0.5em", letterSpacing: "0.05em" }}
                    >
                      #000001
                    </span>
                  </div>
                </div>
              </div>
            </foreignObject>

            {/* Pill clip — drawn LAST so it renders on top of the body.
                y=-12 to y=2 means 12px above the card and 2px inside it,
                giving a subtle "clip rests on top of card" look. The strap
                above ends just at y=-12 in this SVG's space (after the
                marginTop offset), so strap → pill is continuous. */}
            <rect
              x="116"
              y="-12"
              width="48"
              height="14"
              rx="7"
              fill="url(#pill-shade)"
            />
            {/* Hairline highlight on the pill's top — sells the curvature */}
            <rect
              x="120"
              y="-11"
              width="40"
              height="0.6"
              fill="rgba(255,255,255,0.2)"
            />
            {/* Hairline shadow under the pill where it meets the body */}
            <rect
              x="118"
              y="2"
              width="44"
              height="0.5"
              fill="rgba(0,0,0,0.18)"
            />
          </svg>
        </figure>
      </div>
    </div>
  );
}
