import type { Metadata } from "next";
import AiHero from "@/components/services/ai-integration/AiHero";
import ServiceSection from "@/components/services/ServiceSection";
import AiCta from "@/components/services/ai-integration/AiCta";
import ChatMockup from "@/components/services/chat/ChatMockup";
import KnowledgeRetrievalDemo from "@/components/services/ai-integration/demos/KnowledgeRetrievalDemo";
import VoiceDemo from "@/components/services/ai-integration/demos/VoiceDemo";
import BackendAutomationDemo from "@/components/services/ai-integration/demos/BackendAutomationDemo";
import ImageGenDemo from "@/components/services/ai-integration/demos/ImageGenDemo";
import FraudDetectionDemo from "@/components/services/ai-integration/demos/FraudDetectionDemo";

export const metadata: Metadata = {
  title: "AI Integration",
  description:
    "Branded AI chat, voice, knowledge retrieval, backend automation, image generation, and fraud detection by Mobol. AI systems that do real work inside Australian businesses.",
  alternates: { canonical: "/services/ai-integration" },
  openGraph: {
    title: "AI Integration | Mobol",
    description:
      "AI systems that sell, support, and operate inside real businesses, built by Mobol.",
    url: "/services/ai-integration",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integration | Mobol",
    description: "AI integration and automation by Mobol.",
  },
};

const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Integration",
  description:
    "AI chat support, voice, knowledge retrieval, backend automation, image generation, and fraud detection by Mobol.",
  url: "/services/ai-integration",
  provider: {
    "@type": "Organization",
    name: "Mobol",
  },
  serviceType: [
    "AI Integration",
    "AI Chat Support",
    "AI Voice",
    "Retrieval-Augmented Generation",
    "Workflow Automation",
    "Fraud Detection",
  ],
  areaServed: "AU",
}).replace(/</g, "\\u003c");

export default function AiIntegrationPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <AiHero />

        <div className="mt-24 lg:mt-32 space-y-24 lg:space-y-32">
          <ServiceSection
            category="Overview"
            title="One AI layer, shown across real workflows"
            body="A single assistant can read an image, generate campaign assets, answer customer questions, call approved tools, handle voice, keep a human review point, and measure what changed. The mockup shows the shape of that system across normal business workflows."
            bullets={[
              "Reads images and drafts useful next steps",
              "Generates campaign stills and video prompts",
              "Answers customer questions across industries",
              "Calls approved tools with human review points",
            ]}
            demoOnLeft={true}
            demo={<ChatMockup />}
          />

          <ServiceSection
            category="Knowledge"
            title="Answers grounded in your docs"
            body="The assistant answers from your product guides, policies, and past tickets. Not the open internet. Every answer comes back with the sources it used, so you can see exactly where it came from."
            bullets={[
              "Grounded in your documents, not guesses",
              "Every answer cites the sources behind it",
              "A confidence signal on each response",
              "No invented facts, no made-up policy",
            ]}
            demoOnLeft={false}
            demo={<KnowledgeRetrievalDemo />}
          />

          <ServiceSection
            category="Voice"
            title="A voice that sounds human"
            body="Phone lines, voicemail, and callbacks handled by a voice that sounds like a person, not a 2009 phone menu. Pick an accent and a tone, and the same words land the way the moment needs."
            bullets={[
              "Natural delivery built on Google's Gemini voice models",
              "Australian, British, and American accent options",
              "Emotion and expression you can direct",
              "Every clip watermarked as AI (SynthID)",
            ]}
            demoOnLeft={true}
            demo={<VoiceDemo />}
          />

          <ServiceSection
            category="Backend"
            title="AI that does the work"
            body="Answering is only half of it. The assistant calls your real systems, like Shopify, your helpdesk, inventory, and the CRM, to look things up, make changes, and trigger follow-ups. All from one conversation."
            bullets={[
              "Calls Shopify, CRM, and helpdesk tools directly",
              "Runs multi-step workflows end to end",
              "Reporting that updates itself",
              "Manual steps removed, not just sped up",
            ]}
            demoOnLeft={false}
            demo={<BackendAutomationDemo />}
          />

          <ServiceSection
            category="Content"
            title="Campaign visuals from a prompt"
            body="Product shots, social tiles, and ad frames generated from a prompt that already knows your palette, your products, and your style. Iterate in seconds, ship the ones that work."
            bullets={[
              "Prompts locked to your brand and products",
              "Multiple iterations in the time one shoot takes",
              "Output sized for every channel",
              "Art direction stays with you",
            ]}
            demoOnLeft={true}
            demo={<ImageGenDemo />}
          />

          <ServiceSection
            category="Risk"
            title="Fraud caught before it costs you"
            body="AI checks every order the moment it comes in. The stolen cards, the fake accounts, the ones that just don't add up. It blocks them before they ship, and flags the reason in plain English."
            bullets={[
              "Every order checked the instant it lands",
              "Catches stolen cards and fake orders",
              "Flags the reason in plain English",
              "Stops bad orders before they ship",
            ]}
            demoOnLeft={false}
            demo={<FraudDetectionDemo />}
          />
        </div>

        <AiCta />
      </div>
    </div>
  );
}
