"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useNavHide } from "./NavHideContext";
import ServicesDropdown from "./ServicesDropdown";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

// Track whether the viewport is below the md breakpoint (768px). Used to
// gate the nav-hide behavior — on mobile we never hide the pill because
// there's no peek-on-cursor to bring it back.
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// Plain (non-disclosure) desktop links. Services renders separately as a
// ServicesDropdown component so the catalog stays the source of truth.
const links = [
  { href: "/#who", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

// Soft elevation on white. Only applied on the home route, where the
// lanyard hangs beneath the pill and needs the pill to read as physically
// above the page. Off-home routes go flat so the pill stops perceptually
// popping against a same-white body.
const PILL_SHADOW =
  "0 1px 2px rgba(17,17,17,0.03), 0 4px 10px rgba(17,17,17,0.03)";
const PILL_STROKE = "rgba(17,17,17,0.07)";

export default function PillNav() {
  // `isHome` gates the two side effects that only make visual sense when the
  // lanyard is mounted in <Hero/>: (a) the NavGapMask covering the 24px strip
  // above the pill (where the strap transits on scroll), and (b) the soft
  // PILL_SHADOW that seats the pill above the hanging lanyard.
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { hidden, peeking, scrollHidden } = useNavHide();
  const isMobile = useIsMobile();
  // Mobile never hides — desktop still hides on scroll / chat-expand and
  // peeks on cursor near top.
  const effectivelyHidden = !isMobile && (hidden || scrollHidden) && !peeking;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Nav-gap mask — covers the 24px transparent strip above the pill so
          the strap can't be seen leaking into it during the lanyard's
          scroll transit. Only needed on home, where the lanyard exists.
          z-45 sits above the lanyard (z-10 in Hero) and below the nav (z-50). */}
      {isHome && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 h-6 z-[45] pointer-events-none"
          style={{ background: "var(--color-surface)" }}
        />
      )}
      <header
        data-pill-nav=""
        aria-hidden={effectivelyHidden || undefined}
        inert={effectivelyHidden || undefined}
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-6 pointer-events-none"
      >
        {/* nav-wrapper — 78px frame holding the rounded body and interactive
            content. NOT overflow-hidden: the body's drop-shadow needs to
            extend past the wrapper's rectangular bounds without being
            clipped to a visible square. */}
        <div
          className="pointer-events-auto relative w-full max-w-[1200px] h-[78px]"
        >
          {/* Body — rounded-full white pill at every breakpoint. */}
          <div
            className="absolute inset-x-0 top-0 h-[78px] rounded-full bg-white pointer-events-none"
            style={{
              border: `1px solid ${PILL_STROKE}`,
              boxShadow: isHome ? PILL_SHADOW : undefined,
            }}
            aria-hidden="true"
          />

          {/* Navigation content — sits on top of the body div. On mobile we
              use symmetric px-4 so the logo and hamburger sit equidistant
              from the rounded edges (visually centred); desktop keeps pl-10
              pr-3 for logo breathing room and CTA tucked against the pill's
              right curve. */}
          <nav
            className="relative z-10 h-[78px] flex items-center justify-between px-4 md:pl-10 md:pr-3"
            aria-label="Primary"
          >
            <Link
              href="/"
              className="
                text-[22px] font-semibold tracking-[-0.02em] text-ink leading-none
                rounded-sm
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
              "
            >
              mobol
            </Link>

            <ul className="hidden md:flex items-center justify-center gap-12 text-[15px] text-ink">
              <li>
                <ServicesDropdown />
              </li>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="
                      py-2 rounded-sm
                      transition-opacity hover:opacity-70
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                    "
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA — visible md+ only */}
            <Link
              href="/contact"
              className="
                hidden md:inline-flex items-center justify-center
                h-[50px] px-7
                rounded-full
                bg-ink text-surface
                text-[15px] font-normal
                transition-transform hover:scale-[1.02] active:scale-[0.99]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
              "
            >
              Start a project
            </Link>

            {/* Mobile hamburger — visible < md only */}
            <div className="md:hidden">
              <HamburgerButton
                open={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
              />
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu — native <dialog>, mounted alongside the nav so its
          focus + scroll-lock semantics are independent of the pill itself. */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
