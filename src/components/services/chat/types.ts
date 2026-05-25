export type ChatRole = "user" | "assistant";

export type Phase =
  | "idle"
  | "playing"
  | "paused"
  | "done"
  | "responding";

export type ChatWidget =
  // Legacy widgets — kept for backwards compat; not referenced by the v2 script.
  | { type: "voice"; durationSec: number; label?: string }
  | { type: "images"; count: 3 | 4; tones?: Array<[string, string]> }
  | {
      type: "chart";
      chart: "bars" | "line";
      values: number[];
      label?: string;
    }
  | { type: "phone"; name?: string; durationSec: number }
  | { type: "agentTasks"; items: string[]; perItemMs?: number }
  | { type: "cta"; href: string; label: string; eyebrow?: string }
  // v2 capability-sprint widgets:
  | {
      type: "liveStat";
      label: string;
      from: number;
      to: number;
      durationMs?: number;
      suffix?: string;
    }
  | {
      type: "supportThread";
      exchanges: ReadonlyArray<{ user: string; ai: string }>;
      perExchangeMs?: number;
    }
  | {
      type: "liveCall";
      caller: string;
      subtitle?: string;
      durationSec: number;
      transcript: ReadonlyArray<{
        speaker: "caller" | "ai";
        text: string;
      }>;
      perLineMs?: number;
    }
  | {
      type: "toolCall";
      title?: string;
      subtitle?: string;
      calls: ReadonlyArray<{
        name: string;
        args: string;
        result: string;
        label?: string;
      }>;
      perCallMs?: number;
    }
  | {
      type: "agentFeed";
      items: ReadonlyArray<{ time: string; text: string; tag?: string }>;
      perItemMs?: number;
    }
  | {
      type: "impactDashboard";
      metrics: ReadonlyArray<{
        label: string;
        before: string;
        after: string;
        sparkline: ReadonlyArray<number>;
      }>;
    }
  | {
      type: "brandPack";
      tiles: ReadonlyArray<{
        kind: "logo" | "moodboard" | "video" | "product";
        tone?: [string, string];
        label?: string;
      }>;
    }
  | {
      type: "ragAnswer";
      question: string;
      answer: ReadonlyArray<string>;
      confidence?: string;
      sources: ReadonlyArray<{
        label: string;
        detail: string;
        match: string;
      }>;
    }
  | {
      type: "imageAnalysis";
      eyebrow?: string;
      title: string;
      before: {
        src: string;
        alt: string;
        label: string;
      };
      after: {
        src: string;
        alt: string;
        label: string;
      };
      findings: ReadonlyArray<string>;
      recommendation: string;
      prompt: string;
    }
  | {
      type: "voiceStudio";
      title: string;
      script: string;
      durationSec: number;
      accents: ReadonlyArray<{
        id: string;
        label: string;
        accent: string;
        expression: string;
        src: string;
        ready?: boolean;
        tone: string;
      }>;
    }
  | {
      type: "generatedAssets";
      eyebrow?: string;
      title?: string;
      badge?: string;
      prompt: string;
      variants: ReadonlyArray<{
        label: string;
        src: string;
        alt: string;
        note: string;
      }>;
    }
  | {
      type: "generatedVideo";
      title: string;
      posterSrc: string;
      posterAlt: string;
      placeholderSrc: string;
      duration: string;
      prompt?: string;
      frames: ReadonlyArray<{
        time: string;
        label: string;
      }>;
    }
  | {
      type: "workflowAutomation";
      title: string;
      systems: ReadonlyArray<{
        name: string;
        action: string;
        detail: string;
        status: "queued" | "running" | "done";
      }>;
      summary: ReadonlyArray<{
        label: string;
        value: string;
      }>;
    };

export type ThinkingStepData = {
  label: string;
  details?: string[];
  sources?: string[];
};

export type ChatStep =
  | { kind: "user"; text: string; preDelayMs?: number }
  | {
      kind: "assistant";
      text?: string;
      typewriter?: boolean;
      typewriterCharMs?: number;
      widget?: ChatWidget;
      preDelayMs?: number;
      thinkingMs?: number;
      thinkingSteps?: ThinkingStepData[];
      thinkingStepMs?: number;
      // Delay (ms) before the widget animates in, so the bubble lands first.
      // Defaults to 140ms in ChatMessage; bump to 200-260 for heavy widgets.
      widgetEnterDelayMs?: number;
    }
  | { kind: "pause"; ms: number };

export type ChatScript = ReadonlyArray<ChatStep>;

export type ThinkingState = {
  steps: ThinkingStepData[];
  // -1 = pre-reveal; 0..N-1 = step at this index is active; N = all complete
  activeIndex: number;
  // false during/after reveal until user clicks; true while user has expanded
  expanded: boolean;
  // true once reveal sequence has finished (used to swap to collapsed bar)
  revealComplete: boolean;
};

export type RenderedMessage = {
  id: string;
  role: ChatRole;
  text: string;
  fullText: string;
  widget?: ChatWidget;
  source: "script" | "user";
  status: "revealing" | "complete";
  stepIndex?: number;
  thinking?: ThinkingState;
  widgetEnterDelayMs?: number;
};
