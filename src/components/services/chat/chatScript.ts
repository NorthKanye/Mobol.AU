import type { ChatScript } from "./types";

// Suggested questions shown above the input once the script ends.
export const quickReplies: ReadonlyArray<string> = [
  "Build this for my studio",
  "What does it cost?",
  "Show me the timeline",
];

// v2 — Capability Sprint. ~35s, 8 widgets in sequence, minimal dialogue.
// Every widget pulls weight as evidence; the AI narrates only the connective
// tissue. Hero thinking-steps moment lands right before the impact dashboard
// where it reads as the AI actually computing the data.
export const chatScript: ChatScript = [
  {
    kind: "user",
    text: "What can mobol's AI ship?",
    preDelayMs: 600,
  },
  {
    kind: "assistant",
    text: "All of it. Watch.",
    typewriter: true,
    typewriterCharMs: 38,
    thinkingMs: 600,
  },
  { kind: "pause", ms: 250 },

  // ── 1. Opening hook ──────────────────────────────────────────────────────
  {
    kind: "assistant",
    widget: {
      type: "liveStat",
      label: "Customer questions answered this week",
      from: 0,
      to: 1247,
      durationMs: 1800,
    },
    thinkingMs: 250,
  },
  { kind: "pause", ms: 700 },

  // ── 2. Support agent ─────────────────────────────────────────────────────
  {
    kind: "assistant",
    widget: {
      type: "supportThread",
      perExchangeMs: 950,
      exchanges: [
        {
          user: "Where's my order?",
          ai: "Shipped Tuesday — tracking sent to your email.",
        },
        {
          user: "Can I swap to the refill bundle?",
          ai: "Done. You'll see the credit within an hour.",
        },
        {
          user: "Is the toner safe with retinol?",
          ai: "Yep — alternate nights for the first two weeks.",
        },
      ],
    },
    thinkingMs: 250,
  },
  { kind: "pause", ms: 600 },

  // ── 3. Voice / phone ─────────────────────────────────────────────────────
  {
    kind: "assistant",
    widget: {
      type: "liveCall",
      caller: "Sarah K · inbound",
      subtitle: "Sales · qualifying lead",
      durationSec: 47,
      perLineMs: 1100,
      transcript: [
        { speaker: "caller", text: "Do you ship to the UK?" },
        { speaker: "ai", text: "Yes — 3-5 days, free over £40." },
        { speaker: "caller", text: "Can I add a sample?" },
      ],
    },
    thinkingMs: 350,
  },
  { kind: "pause", ms: 700 },

  // ── 4. Tool calling ──────────────────────────────────────────────────────
  {
    kind: "user",
    text: "Behind the scenes?",
    preDelayMs: 600,
  },
  {
    kind: "assistant",
    widget: {
      type: "toolCall",
      perCallMs: 850,
      calls: [
        {
          name: "lookup_order",
          args: '"R-9924"',
          result: '{ shipped_at: "Nov 4", carrier: "DPD" }',
        },
        {
          name: "check_inventory",
          args: '"toner-200ml"',
          result: "{ in_stock: 412, eta: null }",
        },
        {
          name: "create_credit",
          args: "{ user: 78213, amount: 24 }",
          result: "ok",
        },
      ],
    },
    thinkingMs: 250,
  },
  { kind: "pause", ms: 500 },

  // ── 5. Workflows ─────────────────────────────────────────────────────────
  {
    kind: "assistant",
    widget: {
      type: "agentFeed",
      perItemMs: 380,
      items: [
        { time: "12:47", text: "Synced calendar with Acuity", tag: "ops" },
        { time: "12:43", text: "Drafted weekly client report", tag: "ops" },
        { time: "12:38", text: "Triaged 8 tickets, escalated 1", tag: "support" },
        { time: "12:21", text: "Posted IG carousel · 3 variants", tag: "social" },
      ],
    },
    thinkingMs: 250,
  },
  { kind: "pause", ms: 700 },

  // ── 6. Analytics + hero thinking-steps ───────────────────────────────────
  {
    kind: "assistant",
    text: "And the receipts.",
    typewriter: true,
    typewriterCharMs: 36,
    thinkingMs: 350,
  },
  { kind: "pause", ms: 200 },
  {
    kind: "assistant",
    thinkingSteps: [
      {
        label: "Pulled this month's tickets",
        details: ["customer-support.csv · 1,247 rows"],
        sources: ["api/tickets"],
      },
      {
        label: "Compared vs. pre-AI baseline",
        details: ["delta vs. last quarter"],
        sources: ["warehouse.events"],
      },
      {
        label: "Computing impact metrics",
        details: ["3 transformations"],
      },
    ],
    thinkingStepMs: 580,
    widget: {
      type: "impactDashboard",
      metrics: [
        {
          label: "Support response",
          before: "8h",
          after: "12 min",
          sparkline: [9, 8, 7, 5, 4, 3, 2.5, 2, 1.5, 1, 0.8, 0.5],
        },
        {
          label: "Resolution rate",
          before: "62%",
          after: "94%",
          sparkline: [62, 64, 66, 71, 75, 80, 84, 87, 90, 92, 93, 94],
        },
        {
          label: "Cost per ticket",
          before: "$4.20",
          after: "$0.18",
          sparkline: [4.2, 4.0, 3.5, 2.8, 2.0, 1.4, 0.9, 0.5, 0.3, 0.2, 0.18, 0.18],
        },
      ],
    },
  },
  { kind: "pause", ms: 800 },

  // ── 7. Visuals ───────────────────────────────────────────────────────────
  {
    kind: "assistant",
    text: "Visuals on demand. In your brand.",
    typewriter: true,
    typewriterCharMs: 32,
    thinkingMs: 300,
  },
  {
    kind: "assistant",
    widget: {
      type: "brandPack",
      tiles: [
        { kind: "logo", label: "logo · v3" },
        { kind: "moodboard", label: "moodboard" },
        { kind: "product", label: "product · 12" },
        { kind: "video", label: "video · 0:08" },
      ],
    },
    thinkingMs: 250,
  },
  { kind: "pause", ms: 1100 },

  // ── 8. CTA ───────────────────────────────────────────────────────────────
  {
    kind: "assistant",
    widget: {
      type: "cta",
      href: "#contact",
      label: "Build this for your studio.",
      eyebrow: "free 20-min scoping call",
    },
    thinkingMs: 400,
  },
];
