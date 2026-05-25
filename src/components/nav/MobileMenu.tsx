"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { services } from "@/lib/services";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Mobile nav sheet — native <dialog> opened with showModal() so the browser
 * handles modal semantics (focus trap, ESC, scroll lock, background inert).
 *
 * Visual: full-bleed white surface, no floating card, no slide animation.
 * The dialog IS the white panel — there's no inner card chrome.
 *
 * Close conditions:
 * - X button click
 * - Backdrop click (target === dialog element)
 * - ESC (native dialog cancel)
 * - Route change (usePathname effect)
 * - Any <Link> inside the menu (calls onClose in onClick)
 *
 * Focus: the X button has autoFocus so the wordmark doesn't pick up the
 * focus ring on open (which read as a misplaced pill outline). The wordmark
 * gets tabIndex={-1} as belt-and-braces.
 */
export default function MobileMenu({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const pathname = usePathname();

  // Open / close the native dialog in lockstep with the `open` prop.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      // Move focus to the close button explicitly (autoFocus alone is unreliable
      // when the dialog opens via showModal after the element is already mounted).
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Close on route change — covers Next App Router client navigations.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Reset accordion when the menu closes.
  useEffect(() => {
    if (!open) setServicesExpanded(false);
  }, [open]);

  // Sync React state when the UA closes the dialog (ESC, cancel).
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => {
      if (open) onClose();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [open, onClose]);

  // Backdrop click — when the user clicks outside the inner panel, the click
  // target is the dialog element itself (not a child).
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-labelledby="mobile-menu-title"
      onClick={handleDialogClick}
    >
      {/* Inner panel — flex column filling the dialog. Stop click propagation
          so taps inside don't register as backdrop clicks. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col h-full w-full px-6 pt-6 pb-8"
      >
        {/* Top bar: wordmark + close */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            tabIndex={-1}
            className="text-[22px] font-semibold tracking-[-0.02em] text-ink leading-none rounded-sm focus:outline-none"
          >
            mobol
          </Link>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              inline-flex h-12 w-12 -mr-2 items-center justify-center
              rounded-full text-ink
              transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 5 L15 15 M15 5 L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <h2 id="mobile-menu-title" className="sr-only">
          Menu
        </h2>

        {/* Nav stack */}
        <nav className="mt-10 flex-1" aria-label="Mobile primary">
          <ul className="flex flex-col">
            <MenuLink href="/#who" onClose={onClose}>
              About
            </MenuLink>

            <li>
              <button
                type="button"
                onClick={() => setServicesExpanded((v) => !v)}
                aria-expanded={servicesExpanded}
                aria-controls="mobile-services-list"
                className="
                  w-full flex items-center justify-between
                  py-5
                  text-[24px] font-medium tracking-[-0.01em] text-ink
                  border-b border-[var(--color-border)]
                  transition-colors active:opacity-80
                  focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                "
              >
                <span>Services</span>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center text-ink-2 transition-transform duration-200"
                  style={{ transform: servicesExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 2 L10 7 L5 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {servicesExpanded && (
                <ul id="mobile-services-list" className="pb-1">
                  <li>
                    <Link
                      href="/services"
                      onClick={onClose}
                      className="
                        flex items-baseline justify-between gap-3
                        py-3 pl-4
                        text-[16px] font-medium text-ink
                        border-b border-[var(--color-border)]
                        transition-opacity active:opacity-70
                        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                      "
                    >
                      <span>All services</span>
                      <span aria-hidden="true" className="text-ink-2">&rarr;</span>
                    </Link>
                  </li>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={s.href}
                        onClick={onClose}
                        className="
                          flex items-baseline justify-between gap-3
                          py-3 pl-4
                          text-[16px] text-ink-body
                          border-b border-[var(--color-border)]
                          transition-opacity active:opacity-70
                          focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                        "
                      >
                        <span>{s.label}</span>
                        <span
                          aria-hidden="true"
                          className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3"
                        >
                          {s.eyebrow.split("—")[0]?.trim()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <MenuLink href="/#work" onClose={onClose}>
              Work
            </MenuLink>
            <MenuLink href="/contact" onClose={onClose}>
              Contact
            </MenuLink>
          </ul>
        </nav>

        {/* Pinned CTA */}
        <Link
          href="/contact"
          onClick={onClose}
          className="
            mt-8 inline-flex w-full items-center justify-center
            h-[56px] rounded-full
            bg-ink text-surface
            text-[16px] font-medium
            transition-transform hover:scale-[1.01] active:scale-[0.99]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
          "
        >
          Start a project
        </Link>
      </div>
    </dialog>
  );
}

function MenuLink({
  href,
  onClose,
  children,
}: {
  href: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="
          block py-5
          text-[24px] font-medium tracking-[-0.01em] text-ink
          border-b border-[var(--color-border)]
          transition-opacity active:opacity-70
          focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
        "
      >
        {children}
      </Link>
    </li>
  );
}
