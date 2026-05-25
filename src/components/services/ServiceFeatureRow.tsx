import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  imageOnLeft: boolean;
  title: string;
  body: string;
  visual?: ReactNode;
  href?: string;
  linkLabel?: string;
};

export default function ServiceFeatureRow({
  imageOnLeft,
  title,
  body,
  visual,
  href,
  linkLabel,
}: Props) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 xl:gap-x-20 items-center">
      <div className={`lg:col-span-7 ${imageOnLeft ? "" : "lg:order-2"}`}>
        {visual ?? (
          <div
            className="aspect-[4/3] w-full rounded-2xl bg-bg border border-black/[0.04]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className={`lg:col-span-5 ${imageOnLeft ? "" : "lg:order-1"}`}>
        <h3 className="text-ink font-semibold leading-[1.1] tracking-display text-[clamp(1.5rem,2.4vw,2rem)]">
          {title}
        </h3>
        <p className="mt-5 text-[15px] leading-[1.6] text-ink-body max-w-[460px]">
          {body}
        </p>
        {href && (
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-1.5 text-[14px] text-ink font-medium underline-offset-4 hover:underline"
          >
            {linkLabel ?? "Learn more"}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
