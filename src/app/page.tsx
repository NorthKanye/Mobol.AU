import PillNav from "@/components/nav/PillNav";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-surface focus:text-sm focus:font-medium focus:shadow-[0_8px_24px_rgba(17,17,17,0.18)]"
      >
        Skip to content
      </a>
      <PillNav />
      <main id="main-content">
        <Hero />
        {/* Anchor stubs so nav/hero links scroll to a target instead of failing silently.
            Replace with real sections as the site is built out. */}
        <section id="who" aria-hidden="true" className="h-px" />
        <section id="what" aria-hidden="true" className="h-px" />
        <section id="services" aria-hidden="true" className="h-px" />
        <section id="work" aria-hidden="true" className="h-px" />
        <section id="contact" aria-hidden="true" className="h-px" />
      </main>
    </>
  );
}
