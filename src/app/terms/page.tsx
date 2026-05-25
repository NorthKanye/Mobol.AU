import type { Metadata } from "next";
import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms that govern your use of the Mobol website and any free interactions with it.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of service — Mobol",
    description:
      "The terms that govern your use of the Mobol website and any free interactions with it.",
    url: "/terms",
    type: "website",
  },
};

const SECTIONS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "agreement", label: "Agreement" },
  { id: "services", label: "Services" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "ai-features", label: "AI features" },
  { id: "consumer-guarantees", label: "Consumer guarantees" },
  { id: "liability", label: "Liability" },
  { id: "indemnity", label: "Indemnity" },
  { id: "termination", label: "Termination" },
  { id: "disputes", label: "Disputes" },
  { id: "governing-law", label: "Governing law" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of service"
      lastUpdated="12 May 2026"
      sections={SECTIONS}
    >
      <PolicySection id="who-we-are" title="Who we are">
        <p>
          This site is operated by <strong>Mobol</strong>, a registered
          business name of a sole trader based in Western Australia.
          ABN <strong>81 902 687 376</strong>. Contact:{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>.
        </p>
        <p>
          In these terms, &ldquo;Mobol&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; and &ldquo;our&rdquo; mean the operator above.
          &ldquo;You&rdquo; means the person using this website.
        </p>
      </PolicySection>

      <PolicySection id="agreement" title="Agreement">
        <p>
          By accessing or using this website, you agree to these terms of
          service. If you do not agree, please do not use the site. These
          terms apply to your use of the website itself — including any
          enquiry forms, the AI chat assistant, and other interactive
          features. Paid project work is governed by a separate written
          proposal or statement of work, which takes precedence over these
          terms to the extent of any conflict in connection with that work.
        </p>
      </PolicySection>

      <PolicySection id="services" title="Services">
        <p>
          The website describes design, web development, AI, branding, and
          related marketing services that Mobol may offer. Descriptions on
          this site are general and do not form a binding offer. A specific
          engagement only exists once we have agreed scope, fees, and
          timelines in writing.
        </p>
      </PolicySection>

      <PolicySection id="acceptable-use" title="Acceptable use">
        <p>
          When using the site, you agree not to:
        </p>
        <ul>
          <li>
            access, probe, or test the site in ways that disrupt or
            degrade its operation;
          </li>
          <li>
            attempt to reverse engineer, scrape, or harvest content beyond
            ordinary browsing;
          </li>
          <li>
            submit automated, abusive, deceptive, unlawful, or
            rights-infringing content through any form or chat;
          </li>
          <li>
            use the AI chat assistant to generate or solicit content that
            is illegal, harmful, or violates the underlying provider&rsquo;s
            usage policies.
          </li>
        </ul>
      </PolicySection>

      <PolicySection
        id="intellectual-property"
        title="Intellectual property"
      >
        <p>
          The website, including its design, text, graphics, code, and
          arrangement, is owned by Mobol or its licensors and is protected
          by Australian and international copyright laws. You may view and
          temporarily cache the site for personal, non-commercial use. Any
          other use — copying, redistribution, modification, or
          incorporation into another product — requires our prior written
          permission.
        </p>
        <p>
          If you submit content through this website (for example a
          message, a brief, or a chat input), you keep ownership of it. You
          grant Mobol a non-exclusive, royalty-free licence to use that
          content for the limited purpose of responding to your enquiry or
          delivering services you have requested.
        </p>
      </PolicySection>

      <PolicySection id="ai-features" title="AI features">
        <p>
          The chat assistant at <a href="/contact">/contact</a> is powered
          by a third-party large language model (OpenAI) and produces
          replies in real time. Output is generated, not curated, and may
          be incomplete, out of date, or incorrect. AI replies are
          informational only — they are not professional advice and should
          not be relied on for legal, financial, medical, or other
          regulated decisions. Where you need certainty, please ask us
          directly or consult a qualified professional.
        </p>
      </PolicySection>

      <PolicySection
        id="consumer-guarantees"
        title="Consumer guarantees"
      >
        <p>
          Nothing in these terms excludes, restricts, or modifies any
          consumer guarantee, right, or remedy that you have under the
          Australian Consumer Law (Schedule 2 to the{" "}
          <em>Competition and Consumer Act 2010</em> (Cth)) or any other
          law where to do so would contravene that law or cause any part
          of these terms to be void.
        </p>
        <p>
          To the extent the Australian Consumer Law applies, we provide
          services with due care and skill, fit for any purpose you make
          known to us, and within a reasonable time.
        </p>
      </PolicySection>

      <PolicySection id="liability" title="Liability">
        <p>
          To the maximum extent permitted by law, and subject to the
          consumer guarantees set out above:
        </p>
        <ul>
          <li>
            the website and the AI assistant are provided
            &ldquo;as is&rdquo;, without warranties of any kind beyond
            those that cannot be excluded by law;
          </li>
          <li>
            Mobol is not liable for any indirect, incidental, special,
            consequential, or punitive loss, or for any loss of profit,
            revenue, goodwill, data, or opportunity, arising from your use
            of the site;
          </li>
          <li>
            for services that are not of a kind ordinarily acquired for
            personal, domestic, or household use, our liability for breach
            of a consumer guarantee is, at our option and to the extent
            permitted by section 64A of the Australian Consumer Law,
            limited to supplying the services again or the cost of having
            the services supplied again.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="indemnity" title="Indemnity">
        <p>
          You agree to indemnify Mobol against any third-party claim,
          loss, or expense (including reasonable legal fees) that arises
          from your breach of these terms, your misuse of the site, or
          content you submit through the site that infringes the rights of
          another person.
        </p>
      </PolicySection>

      <PolicySection id="termination" title="Termination">
        <p>
          We may suspend or restrict access to the site, in whole or in
          part, at any time without notice. You may stop using the site
          at any time. Sections that by their nature should survive
          termination — including intellectual property, liability,
          indemnity, disputes, and governing law — continue to apply.
        </p>
      </PolicySection>

      <PolicySection id="disputes" title="Disputes">
        <p>
          If a dispute arises in connection with these terms or your use
          of the site, the parties will first attempt to resolve it
          through good-faith discussions. If the dispute is not resolved
          within 30 days, either party may refer it to mediation
          administered by a recognised Australian mediator before
          commencing legal proceedings.
        </p>
        <p>
          These terms do not require mandatory arbitration or class-action
          waiver. Nothing in this section prevents you from seeking urgent
          injunctive relief, or from pursuing your rights under any
          consumer protection law.
        </p>
      </PolicySection>

      <PolicySection id="governing-law" title="Governing law">
        <p>
          These terms are governed by the laws of Western Australia and
          the Commonwealth of Australia as they apply in Western
          Australia. The parties submit to the non-exclusive jurisdiction
          of the courts of Western Australia.
        </p>
      </PolicySection>

      <PolicySection
        id="changes"
        title="Changes to these terms"
      >
        <p>
          We may update these terms from time to time. The
          &ldquo;last updated&rdquo; date at the top of the page reflects
          the most recent revision. Continued use of the site after a
          change takes effect means you accept the updated terms.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
