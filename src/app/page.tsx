import Hero from "@/components/hero/Hero";
import TechMarquee from "@/components/tech/TechMarquee";
import HowWeWork from "@/components/values/HowWeWork";
import Services from "@/components/services/Services";
import ClosingCta from "@/components/cta/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <HowWeWork />
      <Services />
      {/* Anchor stubs so nav links scroll to a target instead of failing
          silently. Replace with real sections as the site is built out. */}
      <section id="what" aria-hidden="true" className="h-px" />
      <section id="work" aria-hidden="true" className="h-px" />
      <ClosingCta />
    </>
  );
}
