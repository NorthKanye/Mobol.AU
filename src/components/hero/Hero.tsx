import HeroText from "./HeroText";
import HeroScatter from "./HeroScatter";
import Lanyard from "../lanyard/Lanyard";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden min-h-[820px] lg:min-h-[88vh] xl:min-h-[860px]"
      aria-label="Hero"
    >
      {/* Lanyard — strap drops out of the threading slot in the nav's tab
          (PillNav.tsx) and the whole composition swings gently as a coupled
          pendulum. Two nested wrappers split responsibilities:

          (1) Outer — handles position via translateX. The nav now uses an
              SVG silhouette in a 1200×122 wrapper. The slot inside the
              tab is at SVG x=952..988 (center x=970). With the wrapper
              centered (max-w-[1200px], mx-auto via header's flex), the
              slot's viewport x = vc - 600 + 970 = vc + 370.

          (2) Inner — `animate-lanyard-strap` rotates the entire strap+
              badge unit around `transform-origin: 50% 4px` (the slot's
              vertical midline). The badge has its own `animate-lanyard-
              badge` wrapper inside Lanyard.tsx that swings with greater
              amplitude and a phase lag, so the badge feels heavier than
              the strap — coupled-pendulum physics rather than a rigid
              stick rotating as one.

          top-[120px] places the strap top right at the slot's vertical
          position (header top-6 = 24, slot top in SVG y=96 → viewport
          y = 24 + 96 = 120). The tab path (white fill in the nav SVG)
          covers the strap from y=120 down to y=140 (tab bottom = 24+116),
          so the strap reads as threaded through the slot and emerging
          at the tab's bottom edge. */}
      <div
        className="hidden lg:block absolute top-[120px] left-1/2 z-10 pointer-events-none"
        style={{ transform: "translateX(calc(-50% + 310px))" }}
      >
        <div className="animate-lanyard-strap relative">
          {/* Strap-exit shadow — the tab edge casting onto the strap as it
              emerges from the slot. Sits above the strap SVG so it
              darkens the strap surface, not the tab. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[1]"
            style={{
              top: 0,
              width: "calc(var(--s, 1) * 28px)",
              height: "calc(var(--s, 1) * 14px)",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))",
            }}
          />
          <Lanyard />
        </div>
      </div>

      {/* Inner container scopes the text column. Bigger left padding at
          desktop sizes pushes the headline toward the page center, so the
          left text column and the right-hanging lanyard meet closer
          together — eliminating the dead middle gap. */}
      <div className="relative mx-auto max-w-[1280px] pl-8 lg:pl-20 xl:pl-32 2xl:pl-44 pr-8 pt-36 pb-32">
        <div className="relative z-20">
          <HeroText />
        </div>
      </div>

      {/* Decorative scatter cards (positioned absolutely inside the section) */}
      <HeroScatter />
    </section>
  );
}
