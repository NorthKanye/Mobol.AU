"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Social Media — Services bottom card 04 ("Social Studio").
 *
 * Dashboard mockup laid out in vertical sections: header → "New post"
 * eyebrow → post-composition block (image placeholder + post copy +
 * action icons + Schedule button) → connector tree SVG that branches
 * into → four platform tiles (Instagram · TikTok · X · LinkedIn, real
 * brand marks loaded from MageCDN) → status chips row → footer.
 *
 * Motion: phase-based reveal on first viewport entry. Post block fades
 * up first; connector lines draw via `stroke-dashoffset`; platform
 * tiles + status chips + footer fade up in stagger. Plays once per
 * session — no replay on scroll-flap. IntersectionObserver toggles
 * `.social-paused` to freeze any in-flight motion. Reduced-motion
 * short-circuits to the resolved frame.
 */

type Platform = {
  id: "ig" | "tt" | "x" | "li";
  name: string;
  postType: string;
  iconUrl: string;
  // Brand-tile background. The MageCDN `tc-` SVGs already carry the
  // platform's full-colour mark, so the surrounding chip is just a
  // soft neutral that lets the icon do the talking.
  chipBg: string;
};

const PLATFORMS: Platform[] = [
  {
    id: "ig",
    name: "Instagram",
    postType: "Post",
    iconUrl: "https://s.magecdn.com/social/tc-instagram.svg",
    chipBg: "#fdf3ee",
  },
  {
    id: "tt",
    name: "TikTok",
    postType: "Video",
    iconUrl: "https://s.magecdn.com/social/tc-tiktok.svg",
    chipBg: "#f3f3f3",
  },
  {
    id: "x",
    name: "X",
    postType: "Post",
    iconUrl: "https://s.magecdn.com/social/tc-x.svg",
    chipBg: "#f3f3f3",
  },
  {
    id: "li",
    name: "LinkedIn",
    postType: "Post",
    iconUrl: "https://s.magecdn.com/social/tc-linkedin.svg",
    chipBg: "#e8f1fb",
  },
];

function CalendarIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14s1.4 2 3.5 2 3.5-2 3.5-2" />
      <circle cx="9" cy="10" r="0.7" fill="currentColor" />
      <circle cx="15" cy="10" r="0.7" fill="currentColor" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" />
    </svg>
  );
}

function ImageFrameIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5M3 21v-5h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l5 5L20 7" />
    </svg>
  );
}

function VerifiedDot() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1d9bf0" />
      <path
        d="M9 12.4l2.2 2.2 4.2-5.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConnectorTree({ active }: { active: boolean }) {
  // viewBox uses a normalised 100-wide coord space so x=12.5 / 37.5 /
  // 62.5 / 87.5 line up with evenly-spaced platform-tile centres
  // below. preserveAspectRatio="none" stretches horizontally to fill
  // the panel width; non-scaling-stroke keeps lines at 1px.
  const lineProps = {
    pathLength: 1,
    stroke: "var(--color-border)",
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
    className: active ? "animate-social-line-draw" : "",
  };
  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block"
    >
      {/* trunk */}
      <line x1="50" y1="0" x2="50" y2="12" {...lineProps} />
      {/* branches */}
      <line
        x1="50"
        y1="12"
        x2="12.5"
        y2="28"
        {...lineProps}
        style={{ animationDelay: active ? "80ms" : undefined }}
      />
      <line
        x1="50"
        y1="12"
        x2="37.5"
        y2="28"
        {...lineProps}
        style={{ animationDelay: active ? "140ms" : undefined }}
      />
      <line
        x1="50"
        y1="12"
        x2="62.5"
        y2="28"
        {...lineProps}
        style={{ animationDelay: active ? "200ms" : undefined }}
      />
      <line
        x1="50"
        y1="12"
        x2="87.5"
        y2="28"
        {...lineProps}
        style={{ animationDelay: active ? "260ms" : undefined }}
      />
      {/* junction + leaf dots — viewBox is stretched horizontally, so
          ellipses keep the dots roughly circular at typical card widths */}
      <ellipse cx="50" cy="12" rx="0.6" ry="1.4" fill="var(--color-border)" />
    </svg>
  );
}

export default function SocialMediaMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = (matches: boolean) => {
      setReducedMotion(matches);
      if (matches) {
        hasPlayedRef.current = true;
        setHasEntered(true);
      }
    };
    applyMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => applyMotion(e.matches);
    mq.addEventListener("change", onChange);

    const obs = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting;
        root.classList.toggle("social-paused", offscreen);
        if (!entry.isIntersecting) return;
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;
        setHasEntered(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => {
      obs.disconnect();
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Convenience: on first paint (pre-observer), the post block, tiles
  // and chips render with `opacity: 0` so the entrance animation plays
  // when classes flip in. Reduced-motion users skip straight to full.
  const fadeClass = (animClass: string) => {
    if (reducedMotion) return "";
    return hasEntered ? animClass : "opacity-0";
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Social Studio dashboard: a new post is queued for Instagram, TikTok, X and LinkedIn. Four channels connected with auto-sync, ready to publish."
      className="absolute inset-0 bg-surface flex flex-col px-5 pt-4 pb-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
          Social Studio
        </span>
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
          style={{ background: "#ecf6f0", color: "#1f7a4a" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#1f7a4a" }}
          />
          Live
        </span>
      </div>

      {/* Eyebrow */}
      <p className="mt-2.5 text-[9.5px] font-medium tracking-[0.18em] uppercase text-ink-2">
        New post
      </p>

      {/* Post composition block */}
      <div
        className={`mt-1.5 rounded-xl border border-border bg-surface p-2.5 ${fadeClass(
          "animate-social-post-in",
        )}`}
        style={{
          animationDelay:
            !reducedMotion && hasEntered ? "0ms" : undefined,
        }}
      >
        <div className="flex items-start gap-2.5">
          {/* Post image — Mobol brand-kit flat-lay */}
          <Image
            src="/social-media.png"
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
            className="shrink-0 w-16 h-16 rounded-lg object-cover"
          />
          {/* Post copy */}
          <div className="flex-1 min-w-0 leading-snug">
            <p className="text-[10.5px] font-medium text-ink-body line-clamp-2">
              Behind every great brand is a clear strategy and consistent
              execution.
            </p>
            <p className="mt-1 text-[10.5px] font-semibold text-ink line-clamp-1">
              Let&apos;s build something that lasts.
            </p>
          </div>
        </div>
        {/* Action row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-3">
            <SmileIcon />
            <HashIcon />
            <ImageFrameIcon />
          </div>
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10.5px] font-semibold text-white select-none"
            style={{ background: "#1a4cbe" }}
          >
            <CalendarIcon />
            Schedule
          </span>
        </div>
      </div>

      {/* Connector tree */}
      <div className="mt-1">
        <ConnectorTree active={hasEntered} />
      </div>

      {/* Platform tiles */}
      <div className="flex items-stretch gap-1.5">
        {PLATFORMS.map((p, i) => (
          <div
            key={p.id}
            className={`flex-1 relative rounded-lg border border-border bg-surface px-2 py-2 ${fadeClass(
              "animate-social-row-in",
            )}`}
            style={{
              animationDelay:
                !reducedMotion && hasEntered ? `${380 + i * 80}ms` : undefined,
            }}
          >
            <span
              className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-md"
              style={{ background: p.chipBg }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.iconUrl}
                alt=""
                aria-hidden="true"
                width={11}
                height={11}
              />
            </span>
            <p className="mt-1.5 text-[9.5px] font-semibold text-ink leading-tight truncate">
              {p.name}
            </p>
            <p className="text-[8.5px] text-ink-3 leading-tight truncate">
              {p.postType}
            </p>
            <span className="absolute bottom-1.5 right-1.5">
              <VerifiedDot />
            </span>
          </div>
        ))}
      </div>

      {/* Status chips */}
      <div
        className={`mt-2.5 flex items-center gap-1.5 ${fadeClass(
          "animate-social-row-in",
        )}`}
        style={{
          animationDelay:
            !reducedMotion && hasEntered ? "780ms" : undefined,
        }}
      >
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-medium text-ink-2 border border-black/[0.04]"
          style={{ background: "var(--color-bg)" }}
        >
          <UsersIcon />4 channels
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-medium text-ink-2 border border-black/[0.04]"
          style={{ background: "var(--color-bg)" }}
        >
          <SyncIcon />
          Auto-sync
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-semibold"
          style={{ background: "#ecf6f0", color: "#1f7a4a" }}
        >
          <CheckIcon />
          Ready to publish
        </span>
      </div>

      {/* Footer */}
      <div
        className={`mt-auto pt-2 border-t border-border flex items-center justify-between ${fadeClass(
          "animate-social-row-in",
        )}`}
        style={{
          animationDelay:
            !reducedMotion && hasEntered ? "880ms" : undefined,
        }}
      >
        <span className="text-[8.5px] font-semibold tracking-[0.18em] uppercase text-ink-3">
          Mobol · Social
        </span>
        <span className="text-[8.5px] font-mono tabular-nums text-ink-3">
          1 campaign
        </span>
      </div>
    </div>
  );
}
