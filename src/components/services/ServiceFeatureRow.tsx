import type { ReactNode } from "react";

type Props = {
  imageOnLeft: boolean;
  index: string;
  title: string;
  body: string;
  visual?: ReactNode;
};

export default function ServiceFeatureRow({
  imageOnLeft,
  index,
  title,
  body,
  visual,
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
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
          {index}
        </p>
        <h3 className="mt-4 text-ink font-semibold leading-[1.1] tracking-display text-[clamp(1.5rem,2.4vw,2rem)]">
          {title}
        </h3>
        <p className="mt-5 text-[15px] leading-[1.6] text-ink-body max-w-[460px]">
          {body}
        </p>
      </div>
    </article>
  );
}
