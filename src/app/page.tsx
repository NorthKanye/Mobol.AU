import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Anchor stubs so nav/hero links scroll to a target instead of failing
          silently. Replace with real sections as the site is built out. */}
      <section id="who" aria-hidden="true" className="h-px" />
      <section id="what" aria-hidden="true" className="h-px" />
      <section id="services" aria-hidden="true" className="h-px" />
      <section id="work" aria-hidden="true" className="h-px" />
    </>
  );
}
