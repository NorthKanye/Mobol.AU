import type { ChatScript } from "./types";

// Suggested questions shown above the input once the scripted demo ends.
export const quickReplies: ReadonlyArray<string> = [
  "Map my first AI workflow",
  "Show me content prompts",
  "Where would humans step in?",
];

// Homepage script: a calm multi-industry loop. Each beat shows one useful
// capability, then moves on before it starts feeling like a sales reel.
export const chatScript: ChatScript = [
  {
    kind: "user",
    text: "Show me AI for normal businesses, not a party trick.",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    text: "Fair. I'll keep it practical: read an image, create campaign assets, answer from trusted info, speak it back, and update the back office.",
    typewriter: true,
    typewriterCharMs: 13,
    thinkingMs: 380,
  },
  { kind: "pause", ms: 420 },

  {
    kind: "user",
    text: "Start with something visual. Real estate maybe?",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    widget: {
      type: "imageAnalysis",
      eyebrow: "MobolRealEstate",
      title: "Image read + renovation concept",
      before: {
        src: "/ai-demo/homepage-industries/realestate-before.png",
        alt: "Before photo of a dated single-storey Perth brick house.",
        label: "Before",
      },
      after: {
        src: "/ai-demo/homepage-industries/realestate-after.png",
        alt: "Renovated concept of the same Perth house with white render, charcoal trim, and native landscaping.",
        label: "After concept",
      },
      findings: [
        "Strong roofline and street frontage, but the cream brick and dark windows date the first impression.",
        "Entry is hidden by planting, so buyers read the facade before they read the home.",
        "Best lift: render, charcoal frames, a warmer entry, and trimmed native landscaping.",
      ],
      recommendation:
        "Useful for agents, builders, and homeowners: AI can explain the opportunity, then mock the improvement before anyone books a shoot.",
      prompt:
        "Keep the same house, camera angle, roofline, driveway, and window placement. Refresh the exterior with soft white render, charcoal frames, timber entry battens, cleaned landscaping, and a realistic Perth coastal renovation finish.",
    },
    thinkingMs: 420,
    widgetEnterDelayMs: 120,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "Okay. What about product brands?",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    text: "For MobolSkincare, it can turn one product direction into stills, ad variants, and a video storyboard.",
    typewriter: true,
    typewriterCharMs: 13,
    thinkingMs: 360,
    widget: {
      type: "generatedAssets",
      eyebrow: "MobolSkincare",
      title: "Generated campaign stills",
      badge: "photo gen",
      prompt:
        "Create quiet skincare campaign photography for a refillable serum system: frosted glass, paper refill pouch, soft morning light, warm plaster, muted sage, no text, no logo.",
      variants: [
        {
          label: "Hero",
          src: "/ai-demo/homepage-industries/skincare-product.png",
          alt: "Generated skincare product hero with frosted serum bottle and refill pouch.",
          note: "Landing page",
        },
        {
          label: "Flatlay",
          src: "/ai-demo/homepage-industries/skincare-flatlay.png",
          alt: "Generated skincare flatlay on linen with a refill pouch and serum bottle.",
          note: "Social ad",
        },
        {
          label: "Cinematic",
          src: "/ai-demo/homepage-industries/skincare-cinematic.png",
          alt: "Generated cinematic skincare bottle campaign frame.",
          note: "Video poster",
        },
      ],
    },
    widgetEnterDelayMs: 150,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "assistant",
    text: "And the same direction becomes a short video prompt, ready for you to generate:",
    typewriter: true,
    typewriterCharMs: 13,
    thinkingMs: 340,
    widget: {
      type: "generatedVideo",
      title: "6 second product reveal",
      posterSrc: "/ai-demo/homepage-industries/skincare-cinematic.png",
      posterAlt: "Generated cinematic skincare bottle campaign frame.",
      placeholderSrc: "/ai-demo/homepage-industries/mobolskincare-reveal.mp4",
      duration: "0:06",
      prompt:
        "Slow macro push-in on a frosted skincare serum bottle in warm morning light. Fine mist drifts across soft plaster, shadows move gently, camera settles on the bottle and refill pouch. No text, no logo.",
      frames: [
        { time: "0:00", label: "Soft light lands on bottle" },
        { time: "0:02", label: "Mist passes across refill pouch" },
        { time: "0:05", label: "Camera settles for final frame" },
      ],
    },
    widgetEnterDelayMs: 150,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "Customers still ask messy questions though.",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    widget: {
      type: "supportThread",
      perExchangeMs: 620,
      exchanges: [
        {
          user: "MobolFood: can you cater 28 people on Friday, with 6 gluten free?",
          ai: "Yes. I found one open kitchen slot and built a quote with 6 gluten-free meals separated on the run sheet.",
        },
        {
          user: "MobolFitness: can I pause my membership for surgery?",
          ai: "You can. I drafted the pause request and flagged it for staff approval before anything changes.",
        },
        {
          user: "MobolCommunity: is the youth workshop open to parents too?",
          ai: "Parents can attend the intro session. The mentor circle is youth-only, so I linked the right registration form.",
        },
      ],
    },
    thinkingMs: 420,
    widgetEnterDelayMs: 120,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "Can it actually do the admin, or just write nice replies?",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    text: "It can touch the systems you allow, with rules around what needs approval.",
    typewriter: true,
    typewriterCharMs: 13,
    thinkingMs: 360,
    widget: {
      type: "toolCall",
      title: "Backend actions",
      subtitle: "Quote, calendar, CRM, and staff handoff",
      perCallMs: 480,
      calls: [
        {
          name: "catering.quoteDraft",
          label: "Draft catering quote",
          args: '{ brand: "MobolFood", guests: 28, gf: 6 }',
          result: '{ quote: "$1,240", status: "drafted", approval: "staff" }',
        },
        {
          name: "calendar.holdSlot",
          label: "Hold calendar slot",
          args: '{ date: "Friday", kitchen: "Perth CBD" }',
          result: '{ held: true, expires: "18:00", owner: "Ops" }',
        },
        {
          name: "crm.createFollowUp",
          label: "Create follow-up",
          args: '{ customer: "Mia", channel: "SMS" }',
          result: '{ task: "confirm dietary list", due: "today" }',
        },
      ],
    },
    widgetEnterDelayMs: 150,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "What about calls? Some people just want to talk.",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    widget: {
      type: "voiceStudio",
      title: "MobolFitness voice sample",
      script:
        "Hi Mia, your 6:15 strength class is confirmed. I've added the intro note for your coach, and you can reply to this message if you need to move the booking.",
      durationSec: 8,
      accents: [
        {
          id: "local-calm",
          label: "Local calm",
          accent: "Australian",
          expression: "Warm reception",
          src: "/ai-demo/audio/mobolfitness-local-calm.mp3",
          tone: "Clear Perth reception voice",
        },
        {
          id: "clear-desk",
          label: "Clear desk",
          accent: "Australian",
          expression: "Front desk",
          src: "/ai-demo/audio/mobolfitness-clear-desk.mp3",
          tone: "Direct, friendly, no character acting",
        },
        {
          id: "measured",
          label: "Measured",
          accent: "British",
          expression: "Calm operator",
          src: "/ai-demo/audio/mobolfitness-measured.mp3",
          tone: "Polished and steady",
        },
        {
          id: "soft-apology",
          label: "Soft apology",
          accent: "Australian",
          expression: "Service recovery",
          src: "/ai-demo/audio/mobolfitness-soft-apology.mp3",
          tone: "Gentle delay or cancellation message",
        },
      ],
    },
    thinkingMs: 420,
    widgetEnterDelayMs: 140,
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "How does a team keep control of it?",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    thinkingSteps: [
      {
        label: "Checking approved knowledge",
        details: ["pricing sheet, policy page, intake form"],
        sources: ["docs.search"],
      },
      {
        label: "Separating safe actions from approval actions",
        details: ["book slot, draft quote, flag sensitive cases"],
        sources: ["permissions"],
      },
      {
        label: "Writing the audit trail",
        details: ["what it answered, what it changed, who approved it"],
      },
    ],
    thinkingStepMs: 380,
    widget: {
      type: "workflowAutomation",
      title: "After one customer chat",
      systems: [
        {
          name: "Knowledge base",
          action: "Answer from approved material",
          detail: "No open-web guessing for policy or pricing",
          status: "done",
        },
        {
          name: "CRM",
          action: "Save lead summary",
          detail: "Need, budget, timing, and next step",
          status: "done",
        },
        {
          name: "Calendar",
          action: "Hold a booking slot",
          detail: "Held until staff approves the quote",
          status: "done",
        },
        {
          name: "Staff queue",
          action: "Send human review",
          detail: "Sensitive or high-value items stay visible",
          status: "running",
        },
      ],
      summary: [
        { label: "Manual steps removed", value: "6" },
        { label: "Human checks kept", value: "2" },
      ],
    },
  },
  { kind: "pause", ms: 520 },

  {
    kind: "user",
    text: "And you'd measure whether it's worth building?",
    preDelayMs: 360,
  },
  {
    kind: "assistant",
    text: "Yes. We measure the boring things that matter before adding more AI.",
    typewriter: true,
    typewriterCharMs: 13,
    thinkingMs: 360,
    widget: {
      type: "impactDashboard",
      metrics: [
        {
          label: "First reply",
          before: "4.2h",
          after: "42 sec",
          sparkline: [8.2, 7.4, 6.0, 4.2, 3.1, 1.4, 0.7, 0.2, 0.05],
        },
        {
          label: "Manual follow-up",
          before: "19/wk",
          after: "6/wk",
          sparkline: [19, 18, 17, 15, 13, 10, 8, 7, 6],
        },
        {
          label: "Clean handoffs",
          before: "41%",
          after: "82%",
          sparkline: [41, 44, 48, 53, 60, 67, 73, 78, 82],
        },
      ],
    },
    widgetEnterDelayMs: 130,
  },
  { kind: "pause", ms: 500 },

  {
    kind: "assistant",
    widget: {
      type: "cta",
      href: "#contact",
      label: "Bring us one process that keeps slipping.",
      eyebrow: "we'll map where AI earns its place",
    },
    thinkingMs: 340,
    widgetEnterDelayMs: 100,
  },
];
