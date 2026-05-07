import HeroText from "./HeroText";
import HeroScatter from "./HeroScatter";
import Lanyard from "@/components/lanyard/Lanyard";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden min-h-[820px] lg:min-h-[88vh] xl:min-h-[860px]"
      aria-label="Hero"
    >
      {/* Lanyard hangs from the nav's threading slot. The alignment shell
          mirrors PillNav's nav-wrapper geometry (`max-w-[1200px] mx-auto px-6`)
          and positions the lanyard at the same `910/1200` ratio the slot
          uses, so strap and slot share one anchor and never drift apart at
          any viewport width. As the hero scrolls out, the lanyard rides
          along — no fixed layer, no scroll-linked translate. The strap-leak
          above viewport y=24 (during the lanyard's transit through the gap
          above the nav pill) is masked by <NavGapMask/> in <PillNav/>. */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute top-[120px] inset-x-0 px-6 z-10 pointer-events-none"
      >
        <div className="relative mx-auto max-w-[1200px]">
          <div
            className="absolute top-0"
            style={{
              // 892 + 18 = 910 — slot left edge plus half slot width, i.e.
              // the slot's center, expressed as the same fraction of the
              // 1200-unit nav-wrapper that the slot uses.
              left: "calc(910 / 1200 * 100%)",
              transform: "translateX(-50%)",
            }}
          >
            <Lanyard />
          </div>
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
