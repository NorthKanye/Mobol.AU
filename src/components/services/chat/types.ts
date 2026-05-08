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
      calls: ReadonlyArray<{
        name: string;
        args: string;
        result: string;
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
};
