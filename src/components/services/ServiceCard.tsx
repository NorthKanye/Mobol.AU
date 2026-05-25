import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  variant: "primary" | "secondary";
  label: string;
  description: string;
  visual?: ReactNode;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
};

export default function ServiceCard({
  variant,
  label,
  description,
  visual,
  eyebrow,
  href,
  linkLabel,
}: Props) {
  const isPrimary = variant === "primary";

  const visualEl = (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.06] transition-transform duration-200 ${
        isPrimary ? "aspect-square" : "aspect-[4/3]"
      } ${href ? "group-hover:-translate-y-0.5" : ""}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {visual}
    </div>
  );

  const eyebrowEl = eyebrow ? (
    <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
      {eyebrow}
    </p>
  ) : null;

  const headingEl = (
    <h4
      className={`text-ink font-bold tracking-[-0.01em] ${
        eyebrow ? "mt-2.5" : "mt-5"
      } ${isPrimary ? "text-[18px]" : "text-[15px]"}`}
    >
      {label}
    </h4>
  );

  const descEl = (
    <p
      className={`mt-2 leading-[1.55] text-ink-body ${
        isPrimary ? "text-[14px]" : "text-[13px]"
      }`}
    >
      {description}
    </p>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block focus:outline-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:rounded-2xl"
      >
        {visualEl}
        {eyebrowEl}
        {headingEl}
        {descEl}
        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-ink-2 transition-colors group-hover:text-ink">
          {linkLabel ?? `Explore ${label.toLowerCase()}`}
          <span aria-hidden="true">&rarr;</span>
        </span>
      </Link>
    );
  }

  return (
    <div>
      {visualEl}
      {eyebrowEl}
      {headingEl}
      {descEl}
    </div>
  );
}
