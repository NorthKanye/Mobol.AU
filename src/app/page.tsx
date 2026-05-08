import Hero from "@/components/hero/Hero";
import TabRetractEffect from "@/components/lanyard/TabRetractEffect";
import TechMarquee from "@/components/tech/TechMarquee";
import Services from "@/components/services/Services";

export default function Home() {
  return (
    <>
      {/* Non-rendering scroll listener — drives the nav tab's retract via a
          CSS variable on <html>. Home-only because the lanyard only mounts
          inside <Hero/>. The skip link and <PillNav/> live in layout.tsx so
          /contact (and any future route) gets them too. */}
      <TabRetractEffect />
      <Hero />
      <TechMarquee />
      {/* #who has no dedicated section yet — kept as a stub so the
          "who we are" nav link still scrolls to a target until that
          section is built. Currently lands at the top of Services. */}
      <section id="who" aria-hidden="true" className="h-px" />
      <Services />
      {/* Anchor stubs so nav links scroll to a target instead of failing
          silently. Replace with real sections as the site is built out. */}
      <section id="what" aria-hidden="true" className="h-px" />
      <section id="work" aria-hidden="true" className="h-px" />
    </>
  );
}
