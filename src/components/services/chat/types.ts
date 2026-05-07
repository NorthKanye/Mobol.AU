export type ChatRole = "user" | "assistant";

export type Phase =
  | "idle"
  | "playing"
  | "paused"
  | "done"
  | "responding";

export type ChatWidget =
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
  | { type: "cta"; href: string; label: string; eyebrow?: string };

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
    }
  | { kind: "pause"; ms: number };

export type ChatScript = ReadonlyArray<ChatStep>;

export type RenderedMessage = {
  id: string;
  role: ChatRole;
  text: string;
  fullText: string;
  widget?: ChatWidget;
  source: "script" | "user";
  status: "revealing" | "complete";
  stepIndex?: number;
};
