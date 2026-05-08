"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "#who", label: "who we are" },
  { href: "#what", label: "what we do" },
  { href: "#work", label: "work" },
  { href: "/contact", label: "contact" },
];

// Body — clean rounded pill at top, identical for both home and non-home.
const bodyPath =
  "M 39 0 L 1161 0 A 39 39 0 0 1 1161 78 L 39 78 A 39 39 0 0 1 39 0 Z";
// Tab — only rendered on home. Lives in a separate <path> wrapped in
// `.tab-retract` so it can slide up independently as the hero scrolls past.
const tabPath =
  "M 977 78 A 16 16 0 0 0 961 94 L 961 100 A 16 16 0 0 1 945 116 L 875 116 A 16 16 0 0 1 859 100 L 859 94 A 16 16 0 0 0 843 78 Z";

export default function PillNav() {
  // The downward TAB (and its threading slot, plus the scroll-linked retract
  // animation driven by TabRetractEffect) only makes visual sense on the home
  // page, where the lanyard ribbon hangs from it. On every other route
  // (e.g. /contact) there's no lanyard, so the tab would read as an orphan
  // bump — collapse the nav to a clean rounded pill instead.
  const pathname = usePathname();
  const showTab = pathname === "/";

  const wrapperHeight = showTab ? "h-[122px]" : "h-[78px]";
  const viewBox = showTab ? "0 0 1200 122" : "0 0 1200 78";

  return (
    <>
      {/* Nav-gap mask — covers the 24px transparent strip above the pill so
          the strap can't be seen leaking into it during the lanyard's
          scroll-out transit. Only needed on home, where the lanyard exists.
          z-45 sits above the lanyard (z-10 in Hero) and below the nav (z-50). */}
      {showTab && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 h-6 z-[45] pointer-events-none"
          style={{ background: "var(--color-bg)" }}
        />
      )}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-6 pointer-events-none">
        {/* nav-wrapper — fixed-aspect frame that contains both the SVG-drawn
            nav silhouette and the actual interactive content. On home,
            overflow-hidden caps the retracting tab and slot so they cannot
            leak above the wrapper. Off-home, no tab/slot, no need for the
            clip — and the wrapper shrinks to the body's 78px height. */}
        <div
          className={`pointer-events-auto relative w-full max-w-[1200px] ${wrapperHeight} ${
            showTab ? "overflow-hidden" : ""
          }`}
        >
          {/* Nav silhouette. Body is always drawn. The tab is a separate
              <g className="tab-retract"> on home only — slides up via the
              `--tab-pull` CSS variable written by TabRetractEffect. Both
              paths are #ffffff and meet flush at y=78 between x=843 and
              x=977 so visually they're indistinguishable from a single
              union path while at scroll y=0. */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            <path
              d={bodyPath}
              fill="#ffffff"
              style={{
                filter:
                  "drop-shadow(0 1px 2px rgba(17,17,17,0.04)) drop-shadow(0 6px 14px rgba(17,17,17,0.06))",
              }}
            />
            {showTab && (
              <g className="tab-retract">
                <path d={tabPath} fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Threading slot — the small horizontal handle inside the tab,
              representing where the lanyard ribbon threads through the
              plastic clip. Only renders on home (where the tab itself is
              shown), and hidden below sm so it disappears in lockstep with
              the lanyard on mobile (no orphaned grey rect). Fades out as it
              retracts into the body region. */}
          {showTab && (
            <span
              aria-hidden="true"
              className="tab-retract absolute rounded-[4px] z-[2] hidden sm:block"
              style={{
                left: "calc(892 / 1200 * 100%)",
                top: "calc(96 / 122 * 100%)",
                width: "calc(36 / 1200 * 100%)",
                height: "calc(5 / 122 * 100%)",
                background: "#cfcfcf",
                // Inset shadow sells the slot as a real cutout: top edge dark
                // from the strap pressing down through it, bottom edge a hair
                // brighter from the white tab beneath catching ambient light.
                boxShadow:
                  "inset 0 1px 1.5px rgba(0,0,0,0.45), inset 0 -0.5px 0 rgba(255,255,255,0.6)",
                // Fade the slot out as it retracts into the body region — a
                // grey stripe on the white pill body would otherwise read as
                // a visual artifact. Linear from 1 (untouched) at tab-pull≤18
                // to 0 at tab-pull≥78 (slot fully inside the body region).
                opacity: "calc(1 - (var(--tab-pull, 0px) - 18px) / 60px)",
              }}
            />
          )}

          {/* Navigation content — sits on top of the SVG in the nav-body
              region (top 78px). Padding mirrors the user's spec: pl-10 for
              logo breathing room, pr-3 to butt the CTA against the right
              rounded edge. */}
          <nav
            className="relative z-10 h-[78px] flex items-center justify-between pl-10 pr-3"
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

            <ul className="hidden md:flex items-center justify-center gap-16 text-[15px] text-ink">
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

            <Link
              href="/contact"
              className="
                inline-flex items-center justify-center
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
          </nav>
        </div>
      </header>
    </>
  );
}
