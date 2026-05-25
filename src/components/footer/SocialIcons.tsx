type IconProps = {
  className?: string;
};

const baseProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  "aria-hidden": true,
} as const;

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14.4" cy="5.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect x="5.6" y="8.5" width="1.6" height="6" fill="currentColor" />
      <circle cx="6.4" cy="6.3" r="0.95" fill="currentColor" />
      <path
        d="M9.6 14.5V8.5h1.55v0.85c0.35-0.55 1.05-1 2-1 1.45 0 2.35 0.95 2.35 2.65v3.5h-1.6v-3.1c0-0.95-0.4-1.55-1.25-1.55-0.9 0-1.45 0.65-1.45 1.55v3.1H9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M3.2 3.2 L16.8 16.8 M16.8 3.2 L3.2 16.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M12.4 2.5v8.8a2.7 2.7 0 1 1-2.7-2.7c0.23 0 0.45 0.03 0.66 0.09"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 2.5c0.15 1.95 1.55 3.35 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
