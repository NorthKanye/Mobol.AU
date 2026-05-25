"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ValuePath from "./ValuePath";
import {
  CompassIcon,
  InnovationIcon,
  TrustIcon,
  UnityIcon,
  WalkingTogetherIcon,
} from "./valueIcons";

interface ValueDef {
  name: string;
  body: string;
  proof: string | null;
  accent: string;
  hasFlags?: boolean;
  /** When provided, renders a real image in place of the placeholder SVG.
   *  Drop final art at /public/values/<name>.{png,svg} and fill this in. */
  iconImage?: { src: string; alt: string; width: number; height: number };
  PlaceholderIcon: React.ComponentType<{ className?: string; accent: string }>;
}

const VALUES: ValueDef[] = [
  {
    name: "Walking Together",
    body: "Real partnership. We walk the path with you. Open conversations, shared decisions, growth on both sides.",
    proof: null,
    accent: "#e94f4f",
    iconImage: {
      src: "/01.png",
      alt: "A circle of figures gathered around a meeting place",
      width: 1080,
      height: 1080,
    },
    PlaceholderIcon: WalkingTogetherIcon,
  },
  {
    name: "Innovation",
    body: "Modern frameworks, modern AI, newer tools as soon as they earn their place. We stay current so your work doesn't go stale.",
    proof: null,
    accent: "#fbbf24",
    iconImage: {
      src: "/02.png",
      alt: "A returning boomerang decorated with curved patterns",
      width: 1080,
      height: 1080,
    },
    PlaceholderIcon: InnovationIcon,
  },
  {
    name: "Trust",
    body: "Honest scope. Honest pricing. We tell you what's worth building. And what isn't.",
    proof: null,
    accent: "#1e88e5",
    iconImage: {
      src: "/03.png",
      alt: "Two figures yarning across a small fire",
      width: 1080,
      height: 1080,
    },
    PlaceholderIcon: TrustIcon,
  },
  {
    name: "Unity",
    // Practice-led per codex's finding #4: lead with what we DO (operating
    // practice — hiring, partnership, governance) rather than restating
    // ownership identity, which the flag icon + top-of-section pill already
    // signal. Keeps the row crisp and earns the flag-attribution beneath it.
    body: "Hiring, upskilling, and partnering with mob. Building strong Aboriginal-led business. Ours, and the ones we work alongside.",
    proof: null,
    accent: "#ec4899",
    hasFlags: true,
    iconImage: {
      src: "/04.png",
      alt: "Aboriginal, Torres Strait Islander, and Australian flags side by side",
      width: 1080,
      height: 1080,
    },
    PlaceholderIcon: UnityIcon,
  },
];

export default function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
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
      id="who"
      aria-labelledby="how-we-work-heading"
      className={`relative w-full bg-surface py-24 lg:py-32 ${
        entered ? "how-we-work-entered" : ""
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="hwf-header flex flex-col items-center text-center">
          <span className="bg-ink text-surface text-[10px] font-mono uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-surface" aria-hidden />
            Aboriginal-owned. People-led.
          </span>
          <h2
            id="how-we-work-heading"
            className="mt-7 font-bold text-ink leading-[1.02] tracking-tighter-display text-[clamp(2.5rem,5.4vw,4.5rem)] max-w-[840px]"
          >
            Our values, in motion.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.65] text-ink-body max-w-[560px]">
            Four ideas that shape how we work, and the work we take on.
          </p>
        </div>

        {/* Desktop: horizontal path */}
        <div className="hidden lg:block mt-24 relative">
          <ValuePath className="absolute inset-x-0 top-[14px] w-full h-[220px] pointer-events-none" />
          <ol className="relative grid grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <ValueMarker key={v.name} value={v} index={i} variant="horizontal" />
            ))}
          </ol>
        </div>

        {/* Mobile / tablet: vertical stack */}
        <ol className="hwf-marker-stack lg:hidden mt-16 space-y-12">
          {VALUES.map((v, i) => (
            <ValueMarker key={v.name} value={v} index={i} variant="vertical" />
          ))}
        </ol>

        <div className="mt-20 lg:mt-28 flex justify-center">
          <p className="hwf-tagline-pill bg-bg border border-border text-ink-2 text-[12px] font-medium px-4 py-2 rounded-full inline-flex items-center gap-2.5">
            <CompassIcon className="w-4 h-4 text-ink" />
            <span>
              <span className="text-ink font-semibold">Our values are our compass.</span>{" "}
              They keep us grounded and guide us forward.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

type ValueMarkerProps = {
  value: ValueDef;
  index: number;
  variant: "horizontal" | "vertical";
};

function ValueMarker({ value, index, variant }: ValueMarkerProps) {
  const { name, body, proof, accent, hasFlags, iconImage, PlaceholderIcon } = value;
  const iconDelay = 400 + index * 90;
  const copyDelay = 500 + index * 90;
  const markerStyle = {
    "--reveal-delay": `${iconDelay}ms`,
    "--copy-delay": `${copyDelay}ms`,
    "--accent": accent,
  } as CSSProperties;

  if (variant === "horizontal") {
    return (
      <li className="hwf-marker relative flex flex-col items-center text-center" style={markerStyle}>
        <div className="hwf-icon-wrap h-24 mb-6 flex items-end justify-center">
          {iconImage ? (
            <img
              src={iconImage.src}
              alt={iconImage.alt}
              width="96"
              height="96"
              className="hwf-icon w-24 h-24 object-contain text-ink"
            />
          ) : (
            <PlaceholderIcon className="hwf-icon w-24 h-24 text-ink" accent={accent} />
          )}
        </div>
        {/* spacer that lets the SVG path sit between icon and copy */}
        <div className="h-12" aria-hidden />
        <div className="hwf-copy flex flex-col items-center max-w-[260px]">
          <h3 className="text-[18px] font-semibold tracking-tight text-ink">
            {name}
          </h3>
          <p className="mt-2.5 text-[14px] leading-[1.55] text-ink-body">
            {body}
          </p>
          {hasFlags ? (
            <FlagGroup />
          ) : (
            proof && (
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-ink-2 font-mono">
                — {proof}
              </p>
            )
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="hwf-marker relative" style={markerStyle}>
      <div className="flex gap-5 items-start">
        <div className="shrink-0">
          {iconImage ? (
            <img
              src={iconImage.src}
              alt={iconImage.alt}
              width="96"
              height="96"
              className="hwf-icon w-16 h-16 object-contain text-ink"
            />
          ) : (
            <PlaceholderIcon className="hwf-icon w-16 h-16 text-ink" accent={accent} />
          )}
        </div>
        <div className="hwf-copy min-w-0">
          <h3 className="text-[18px] font-semibold tracking-tight text-ink">
            {name}
          </h3>
          <p className="mt-2.5 text-[14.5px] leading-[1.55] text-ink-body max-w-[420px]">
            {body}
          </p>
          {hasFlags ? (
            <FlagGroup />
          ) : (
            proof && (
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-ink-2 font-mono">
                — {proof}
              </p>
            )
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * Attribution caption beneath the Unity row. The flags themselves are now
 * shown in the value's `iconImage`, so we don't duplicate them here — this
 * component only renders the cultural-credit line for Harold Thomas and
 * Bernard Namok, which is required wherever those flags appear.
 */
function FlagGroup() {
  return (
    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-ink-2 font-mono">
      Aboriginal Flag · Harold Thomas. TSI Flag · Bernard Namok.
    </p>
  );
}
