"use client";

import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  category: string;
  title: string;
  body: string;
  bullets: string[];
  demo: ReactNode;
  demoOnLeft: boolean;
  aside?: ReactNode;
};

const ease = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, amount: 0.25 } as const;

export default function ServiceSection({
  category,
  title,
  body,
  bullets,
  demo,
  demoOnLeft,
  aside,
}: Props) {
  // demo/aside go in keyed Fragments: motion.div re-arrays its children, which
  // trips React's missing-key warning on these bare element props otherwise.
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-12 xl:gap-x-20 items-center">
      <motion.div
        className={`lg:col-span-7 ${demoOnLeft ? "" : "lg:order-2"}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.7, ease }}
      >
        <Fragment key="demo">{demo}</Fragment>
        <Fragment key="aside">{aside}</Fragment>
      </motion.div>

      <div className={`lg:col-span-5 ${demoOnLeft ? "" : "lg:order-1"}`}>
        <motion.p
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 font-mono"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease }}
        >
          {category}
        </motion.p>
        <motion.h2
          className="mt-4 text-ink font-semibold leading-[1.1] tracking-display text-[clamp(1.5rem,2.4vw,2rem)]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-5 text-[15px] leading-[1.6] text-ink-body max-w-[460px]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.15 }}
        >
          {body}
        </motion.p>
        <motion.ul
          className="mt-6 space-y-2.5"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
          }}
        >
          {bullets.map((bullet) => (
            <motion.li
              key={bullet}
              className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-body"
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.4, ease }}
            >
              <span
                aria-hidden="true"
                className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-ink shrink-0"
              />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </article>
  );
}
