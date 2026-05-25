"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { services } from "@/lib/services";

/**
 * Desktop Services disclosure.
 *
 * Layout: a navigable <Link> (real navigation to /services on click) and a
 * sibling chevron <button> that toggles the disclosure panel. Hovering or
 * focusing either control opens the panel after a 120ms intent delay;
 * leaving closes it after 200ms. Esc closes and returns focus to the chevron.
 *
 * Not a WAI menu (role="menu") — it's a disclosure: link stays a link, panel
 * is a <nav> with semantic <ul>. ARIA describes visibility via aria-expanded
 * + aria-controls on the chevron button only, so the link itself isn't
 * overloaded with menu semantics.
 */
export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerLinkRef = useRef<HTMLAnchorElement | null>(null);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const panelId = useId();

  const scheduleOpen = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (open) return;
    openTimer.current = window.setTimeout(() => setOpen(true), 120);
  };

  const scheduleClose = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (!open) return;
    closeTimer.current = window.setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  // Esc closes and returns focus to chevron.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close when focus leaves the disclosure tree (covers tab-out).
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={handleBlur}
      className="relative inline-flex items-center"
    >
      <Link
        ref={triggerLinkRef}
        href="/services"
        className="
          py-2 rounded-sm
          transition-opacity hover:opacity-70
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
        "
      >
        Services
      </Link>
      <button
        ref={triggerBtnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close services menu" : "Open services menu"}
        className="
          inline-flex items-center justify-center
          ml-1 h-5 w-5 rounded-sm
          text-ink-2 transition-colors hover:text-ink
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
        "
      >
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M2 3.5 L5 6.5 L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label="Services"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            // Position the panel below the pill body. Pill body is 78px tall,
            // sitting at top-6 (24px) of the viewport; the panel hangs from
            // the bottom of the body with a small gap, anchored to this
            // disclosure's center via the right offset.
            className="
              absolute left-1/2 top-[calc(100%+24px)] -translate-x-1/2
              w-[min(480px,calc(100vw-48px))]
              z-50
            "
          >
            <div
              className="
                rounded-2xl bg-white
                border border-[rgba(17,17,17,0.07)]
                p-3
              "
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: reduced ? 0 : 0.04 } },
                }}
                className="flex flex-col"
              >
                <motion.li
                  variants={{
                    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/services"
                    onClick={() => setOpen(false)}
                    className="
                      group flex items-center justify-between gap-3
                      px-3 py-2.5 rounded-lg
                      text-[14px] font-medium text-ink
                      transition-colors hover:bg-black/[0.04]
                      focus:outline-none focus-visible:bg-black/[0.04]
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                    "
                  >
                    <span>All services</span>
                    <span
                      aria-hidden="true"
                      className="text-ink-2 transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      &rarr;
                    </span>
                  </Link>
                </motion.li>
                <li
                  aria-hidden="true"
                  className="my-1 h-px bg-[var(--color-border)]"
                />
                {services.map((s) => (
                  <motion.li
                    key={s.slug}
                    variants={{
                      hidden: reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className="
                        group flex items-start gap-3
                        px-3 py-2.5 rounded-lg
                        transition-colors hover:bg-black/[0.04]
                        focus:outline-none focus-visible:bg-black/[0.04]
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                      "
                    >
                      <span className="mt-0.5 inline-block w-[42px] shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-3 font-mono leading-[1.4]">
                        {s.eyebrow.split("—")[0]?.trim()}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium text-ink leading-[1.3]">
                          {s.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-[1.4] text-ink-2">
                          {s.shortDescription}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 text-ink-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink-2"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
