import ServiceFeatureRow from "./ServiceFeatureRow";
import ServiceCard from "./ServiceCard";
import ScrollDebugMarker from "./ScrollDebugMarker";
import BuilderMockup from "./BuilderMockup";
import ChatMockup from "./chat/ChatMockup";
import BrandingMockup from "./branding/BrandingMockup";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full bg-surface border-b border-border py-24 lg:py-32"
    >
      <div className="max-w-[1280px] mx-auto px-8">
        <ScrollDebugMarker label="Section header" />
        <header className="max-w-[640px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
            Services
          </p>
          <h2
            id="services-heading"
            className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.4vw,3.25rem)]"
          >
            What we make,
            <br />
            and how we make it.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.55] text-ink-body">
            A short, confident lead paragraph describing the studio&apos;s
            approach. Replace this placeholder copy with the real positioning
            statement when ready.
          </p>
        </header>

        <div className="mt-20 lg:mt-28 space-y-24 lg:space-y-32">
          <div>
            <ScrollDebugMarker label="Row 01" />
            <ServiceFeatureRow
              imageOnLeft={false}
              index="01"
              title="Website Development & Design"
              body="Placeholder body copy — describe the first capability, philosophy, or proof point in one tight paragraph. Text sits on the left, visual on the right."
              visual={<BuilderMockup />}
            />
          </div>
          <div>
            <ScrollDebugMarker label="Row 02" />
            <ServiceFeatureRow
              imageOnLeft
              index="02"
              title="Feature row two."
              body="Placeholder body copy — describe the second capability, philosophy, or proof point. The visual flips to the left side here."
              visual={<ChatMockup />}
            />
          </div>
          <div>
            <ScrollDebugMarker label="Row 03" />
            <ServiceFeatureRow
              imageOnLeft={false}
              index="03"
              title="Feature row three."
              body="Placeholder body copy — describe the third capability, philosophy, or proof point. Visual returns to the right, closing the zigzag."
              visual={<BrandingMockup />}
            />
          </div>
        </div>

        <div className="mt-32 lg:mt-40">
          <ScrollDebugMarker label="Primary grid" />
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
            What we do
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            <div>
              <ScrollDebugMarker label="Card · Web dev" />
              <ServiceCard
                variant="primary"
                label="Web development"
                description="Custom websites and web apps engineered for performance, accessibility, and maintainability."
              />
            </div>
            <div>
              <ScrollDebugMarker label="Card · AI" />
              <ServiceCard
                variant="primary"
                label="AI"
                description="Practical applied-AI features — assistants, automations, and content tooling — built into your product."
              />
            </div>
            <div>
              <ScrollDebugMarker label="Card · Branding" />
              <ServiceCard
                variant="primary"
                label="Branding"
                description="Identity systems, visual languages, and guidelines that scale from a wordmark to a full product."
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
