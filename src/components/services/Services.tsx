import ServiceFeatureRow from "./ServiceFeatureRow";
import ServiceCard from "./ServiceCard";
import BuilderMockup from "./BuilderMockup";
import ChatMockup from "./chat/ChatMockup";
import BrandingMockup from "./branding/BrandingMockup";
import SocialMediaMockup from "./SocialMediaMockup";
import ReputationMockup from "./ReputationMockup";
import SeoMockup from "./SeoMockup";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full bg-surface py-24 lg:py-32"
    >
      <div className="max-w-[1280px] mx-auto px-8">
        <header className="max-w-[640px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
            Services
          </p>
          <h2
            id="services-heading"
            className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(2rem,3.4vw,3.25rem)]"
          >
            What we do,
            <br />
            and how we do it.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.55] text-ink-body">
            Six services from one team in Perth. Web development and design,
            AI integration, search and SEO, brand identity, social media, and
            reputation management. Pick one, or piece them together for what
            your project needs.
          </p>
        </header>

        <div className="mt-20 lg:mt-28 space-y-24 lg:space-y-32">
          <div>
            <ServiceFeatureRow
              imageOnLeft={false}
              title="Website Development & Design"
              body="Websites built end-to-end, in Perth and across Australia. WordPress, Shopify, or custom React, depending on the project. Design and development go together, so the build matches the brief, and the site stays easy to update."
              visual={<BuilderMockup />}
              href="/services/web-development"
              linkLabel="Explore web development"
            />
          </div>
          <div>
            <ServiceFeatureRow
              imageOnLeft
              title="AI Integration & Automation"
              body="AI that earns its place inside your business. Branded chat assistants, knowledge retrieval, backend tool calling, voice, generated image and video, CRM follow-up, reporting, workflow automation. We pick what fits your team, and skip the rest."
              visual={<ChatMockup />}
              href="/services/ai-integration"
              linkLabel="Explore AI integration"
            />
          </div>
          <div>
            <ServiceFeatureRow
              imageOnLeft={false}
              title="Search & SEO"
              body="Technical SEO, content strategy, and ranking work. We cover site architecture, Core Web Vitals, and content that earns its links. The goal: the right people find you when they search for what you do."
              visual={<SeoMockup />}
              href="/services/seo"
              linkLabel="Explore search & SEO"
            />
          </div>
        </div>

        <div className="mt-32 lg:mt-40">
          <header className="max-w-[640px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
              Also on offer
            </p>
            <h3 className="mt-5 text-ink font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.75rem,3vw,2.75rem)]">
              Three more services,
              <br />
              standalone or combined.
            </h3>
            <p className="mt-6 text-[15px] leading-[1.55] text-ink-body">
              Brand identity, social media, and reputation management. Take
              any one on its own, or layer it with the work above.
            </p>
          </header>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            <div>
              <ServiceCard
                variant="primary"
                label="Social Media"
                description="Account operations across Instagram, TikTok, X, and LinkedIn. Username claims, verification, reinstatements, and post removals."
                visual={<SocialMediaMockup />}
                href="/services/social-media"
                linkLabel="Explore social media"
              />
            </div>
            <div>
              <ServiceCard
                variant="primary"
                label="Brand Identity"
                description="Marks, wordmarks, palettes, and the system that holds them together. One coherent visual language across every surface."
                visual={<BrandingMockup />}
              />
            </div>
            <div>
              <ServiceCard
                variant="primary"
                label="Reputation Management"
                description="Negative review response, removal requests where eligible, and PR placements. On-brand response playbooks across Google, Trustpilot, and the App Store."
                visual={<ReputationMockup />}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
