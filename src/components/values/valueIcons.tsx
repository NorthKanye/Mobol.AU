import type { SVGProps } from "react";

type IconProps = {
  className?: string;
  accent?: string;
} & Omit<SVGProps<SVGSVGElement>, "className">;

const baseSvgProps = {
  viewBox: "0 0 96 96",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
} as const;

export function WalkingTogetherIcon({ className, accent = "#e94f4f", ...rest }: IconProps) {
  return (
    <svg className={className} {...baseSvgProps} {...rest}>
      <path
        d="M16 60 C 30 36, 66 36, 80 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="20" cy="60" r="7" fill="currentColor" opacity="0.85" />
      <circle cx="38" cy="44" r="7" fill="currentColor" opacity="0.85" />
      <circle cx="58" cy="44" r="7" fill={accent} />
      <circle cx="76" cy="60" r="7" fill="currentColor" opacity="0.85" />
      <circle cx="20" cy="60" r="2.5" fill="var(--color-surface, #fff)" />
      <circle cx="38" cy="44" r="2.5" fill="var(--color-surface, #fff)" />
      <circle cx="58" cy="44" r="2.5" fill="var(--color-surface, #fff)" />
      <circle cx="76" cy="60" r="2.5" fill="var(--color-surface, #fff)" />
    </svg>
  );
}

export function InnovationIcon({ className, accent = "#fbbf24", ...rest }: IconProps) {
  return (
    <svg className={className} {...baseSvgProps} {...rest}>
      <path
        d="M22 70 C 30 30, 60 22, 78 38"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 64 C 36 32, 60 28, 72 40"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="78" cy="38" r="4" fill={accent} />
      <circle cx="84" cy="28" r="2" fill={accent} opacity="0.7" />
      <circle cx="74" cy="22" r="1.5" fill={accent} opacity="0.55" />
    </svg>
  );
}

export function TrustIcon({ className, accent = "#1e88e5", ...rest }: IconProps) {
  return (
    <svg className={className} {...baseSvgProps} {...rest}>
      <circle cx="48" cy="48" r="32" stroke={accent} strokeWidth="2" fill="none" opacity="0.45" />
      <circle cx="48" cy="48" r="22" stroke={accent} strokeWidth="2" fill="none" opacity="0.7" />
      <circle cx="48" cy="48" r="6" fill={accent} />
      <ellipse cx="48" cy="38" rx="3" ry="2" fill="currentColor" />
      <ellipse cx="44" cy="44" rx="1.5" ry="1.5" fill="currentColor" />
      <ellipse cx="52" cy="44" rx="1.5" ry="1.5" fill="currentColor" />
      <ellipse cx="46" cy="58" rx="3" ry="2" fill="currentColor" />
      <ellipse cx="50" cy="58" rx="1.5" ry="1.5" fill="currentColor" />
    </svg>
  );
}

export function UnityIcon({ className, accent = "#ec4899", ...rest }: IconProps) {
  return (
    <svg className={className} {...baseSvgProps} {...rest}>
      <rect x="14" y="32" width="24" height="32" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="14" y="32" width="24" height="11" fill={accent} opacity="0.6" />
      <rect x="36" y="28" width="24" height="32" rx="2" fill={accent} />
      <rect x="36" y="28" width="24" height="11" fill="currentColor" opacity="0.85" />
      <rect x="58" y="32" width="24" height="32" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="58" y="32" width="24" height="11" fill={accent} opacity="0.6" />
      <line x1="20" y1="64" x2="20" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="48" y1="60" x2="48" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="76" y1="64" x2="76" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function CompassIcon({ className, ...rest }: Omit<IconProps, "accent">) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 6.5 L13.5 11.5 L17.5 12 L13.5 12.5 L12 17.5 L10.5 12.5 L6.5 12 L10.5 11.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footprint({ className, ...rest }: Omit<SVGProps<SVGGElement>, "className"> & { className?: string }) {
  return (
    <g className={className} {...rest}>
      <ellipse cx="0" cy="0" rx="3" ry="4.5" fill="currentColor" />
      <circle cx="-2" cy="-5.5" r="1" fill="currentColor" />
      <circle cx="0" cy="-6.5" r="1" fill="currentColor" />
      <circle cx="2" cy="-5.5" r="1" fill="currentColor" />
    </g>
  );
}
