"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type {
  ChatScript,
  ChatStep,
  ChatWidget,
  Phase,
  RenderedMessage,
} from "./types";

const MAX_MESSAGES = 50;

const CTA_RESPONSES: Array<{
  text: string;
  cta: Extract<ChatWidget, { type: "cta" }>;
}> = [
  {
    text: "Good first move: bring one process that keeps slipping. We map the questions, the systems it can safely touch, and the point where a person should step in.",
    cta: {
      type: "cta",
      href: "#contact",
      label: "Map where AI earns its place.",
      eyebrow: "plain-English scoping",
    },
  },
  {
    text: "For most teams, the first useful version is small: trusted answers, one or two backend actions, and a clear handoff when the work needs judgement.",
    cta: {
      type: "cta",
      href: "#contact",
      label: "Show us the workflow.",
      eyebrow: "systems before theatre",
    },
  },
  {
    text: "We would start with the boring, valuable bits: repeated questions, missed calls, manual follow-ups, and reporting nobody has time to keep tidy.",
    cta: {
      type: "cta",
      href: "#contact",
      label: "Plan the first AI release.",
      eyebrow: "talk to a human",
    },
  },
];

type State = {
  phase: Phase;
  stepIndex: number;
  messages: RenderedMessage[];
  showTypingDots: boolean;
  userSubmitCount: number;
  reducedMotion: boolean;
};

type Action =
  | { type: "EnterViewport" }
  | { type: "ExitViewport" }
  | { type: "ReducedMotionDetected"; messages: RenderedMessage[] }
  | { type: "AddScriptMessage"; message: RenderedMessage }
  | { type: "PatchMessage"; id: string; patch: Partial<RenderedMessage> }
  | { type: "CompleteMessage"; id: string }
  | { type: "SetTyping"; show: boolean }
  | { type: "AdvanceStep" }
  | { type: "FinishScript" }
  | { type: "AppendUserMessage"; id: string; text: string }
  | {
      type: "AppendCtaResponse";
      id: string;
      text: string;
      widget: ChatWidget;
    }
  | { type: "FinishResponding" }
  | { type: "ToggleThinking"; id: string };

function prune(messages: RenderedMessage[]): RenderedMessage[] {
  if (messages.length <= MAX_MESSAGES) return messages;
  return messages.slice(messages.length - MAX_MESSAGES);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "EnterViewport": {
      if (state.phase === "idle" || state.phase === "paused") {
        return { ...state, phase: "playing" };
      }
      return state;
    }
    case "ExitViewport": {
      if (state.phase === "playing") return { ...state, phase: "paused" };
      return state;
    }
    case "ReducedMotionDetected": {
      return {
        ...state,
        phase: "done",
        messages: action.messages,
        showTypingDots: false,
        reducedMotion: true,
      };
    }
    case "AddScriptMessage":
      return {
        ...state,
        messages: prune([...state.messages, action.message]),
      };
    case "PatchMessage":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m,
        ),
      };
    case "CompleteMessage":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id
            ? { ...m, status: "complete", text: m.fullText }
            : m,
        ),
      };
    case "SetTyping":
      return { ...state, showTypingDots: action.show };
    case "AdvanceStep":
      return { ...state, stepIndex: state.stepIndex + 1 };
    case "FinishScript":
      return { ...state, phase: "done", showTypingDots: false };
    case "AppendUserMessage":
      return {
        ...state,
        phase: "responding",
        userSubmitCount: state.userSubmitCount + 1,
        messages: prune([
          ...state.messages,
          {
            id: action.id,
            role: "user",
            text: action.text,
            fullText: action.text,
            source: "user",
            status: "complete",
          },
        ]),
      };
    case "AppendCtaResponse":
      return {
        ...state,
        showTypingDots: false,
        messages: prune([
          ...state.messages,
          {
            id: action.id,
            role: "assistant",
            text: action.text,
            fullText: action.text,
            widget: action.widget,
            source: "user",
            status: "complete",
          },
        ]),
      };
    case "FinishResponding":
      return { ...state, phase: "done", showTypingDots: false };
    case "ToggleThinking":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id && m.thinking
            ? { ...m, thinking: { ...m.thinking, expanded: !m.thinking.expanded } }
            : m,
        ),
      };
    default:
      return state;
  }
}

function makeId(prefix: string, n: number) {
  return `${prefix}-${n}`;
}

function buildAllScriptMessages(script: ChatScript): RenderedMessage[] {
  const out: RenderedMessage[] = [];
  script.forEach((step, i) => {
    if (step.kind === "user") {
      out.push({
        id: makeId("script", i),
        role: "user",
        text: step.text,
        fullText: step.text,
        source: "script",
        status: "complete",
        stepIndex: i,
      });
    } else if (step.kind === "assistant") {
      const text = step.text ?? "";
      out.push({
        id: makeId("script", i),
        role: "assistant",
        text,
        fullText: text,
        widget: step.widget,
        source: "script",
        status: "complete",
        stepIndex: i,
        widgetEnterDelayMs: step.widgetEnterDelayMs,
        thinking: step.thinkingSteps
          ? {
              steps: step.thinkingSteps,
              activeIndex: step.thinkingSteps.length,
              expanded: false,
              revealComplete: true,
            }
          : undefined,
      });
    }
  });
  return out;
}

export function useChatScript(script: ChatScript) {
  const initialState: State = {
    phase: "idle",
    stepIndex: 0,
    messages: [],
    showTypingDots: false,
    userSubmitCount: 0,
    reducedMotion: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const userMsgCounter = useRef(0);

  // Detect reduced motion once on mount; if active, materialize all script
  // messages (including thinking-steps in collapsed-complete state) and set
  // phase to 'done' so the input is immediately usable.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      dispatch({
        type: "ReducedMotionDetected",
        messages: buildAllScriptMessages(script),
      });
    }
  }, [script]);

  // The orchestrator: runs one script step per (phase==='playing' + stepIndex)
  // tuple. Cleared on pause via the cleanup. Already-added messages are not
  // re-added on resume because each step's message has a stable id derived
  // from stepIndex; the orchestrator only fires AddScriptMessage if no message
  // for this stepIndex exists yet.
  useEffect(() => {
    if (state.phase !== "playing") return;
    if (state.stepIndex >= script.length) {
      dispatch({ type: "FinishScript" });
      return;
    }

    const step: ChatStep = script[state.stepIndex];
    const stepIndex = state.stepIndex;
    const stepMsgId = makeId("script", stepIndex);
    const alreadyAdded = state.messages.some((m) => m.id === stepMsgId);

    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, Math.max(ms, 0)));
    };

    if (step.kind === "pause") {
      schedule(() => dispatch({ type: "AdvanceStep" }), step.ms);
    } else if (step.kind === "user") {
      schedule(() => {
        if (!alreadyAdded) {
          dispatch({
            type: "AddScriptMessage",
            message: {
              id: stepMsgId,
              role: "user",
              text: step.text,
              fullText: step.text,
              source: "script",
              status: "complete",
              stepIndex,
            },
          });
        }
        schedule(() => dispatch({ type: "AdvanceStep" }), 250);
      }, step.preDelayMs ?? 200);
    } else if (step.kind === "assistant") {
      const preDelay = step.preDelayMs ?? 0;
      const fullText = step.text ?? "";
      const useTypewriter = !!step.typewriter && fullText.length > 0;
      const charMs = step.typewriterCharMs ?? 22;

      // Branch: thinking-steps reveal replaces the dot-pulse phase entirely.
      if (step.thinkingSteps && step.thinkingSteps.length > 0) {
        const stepMs = step.thinkingStepMs ?? 600;
        const stepsCount = step.thinkingSteps.length;
        const stepsTotal = stepsCount * stepMs;
        const collapseMs = 380; // matches chatThinkingCollapse keyframe
        const widgetEnterMs = 200; // beat between collapse and widget reveal

        schedule(() => {
          if (!alreadyAdded) {
            dispatch({
              type: "AddScriptMessage",
              message: {
                id: stepMsgId,
                role: "assistant",
                text: useTypewriter ? "" : fullText,
                fullText,
                widget: step.widget,
                source: "script",
                status: "revealing",
                stepIndex,
                widgetEnterDelayMs: step.widgetEnterDelayMs,
                thinking: {
                  steps: step.thinkingSteps!,
                  activeIndex: 0,
                  expanded: false,
                  revealComplete: false,
                },
              },
            });
            // Advance activeIndex once per stepMs. The reveal renders
            // step `i` as active while activeIndex === i; once activeIndex
            // moves past, that step is "complete." When activeIndex
            // reaches stepsCount, all are complete.
            for (let i = 1; i <= stepsCount; i++) {
              schedule(() => {
                dispatch({
                  type: "PatchMessage",
                  id: stepMsgId,
                  patch: {
                    thinking: {
                      steps: step.thinkingSteps!,
                      activeIndex: i,
                      expanded: false,
                      revealComplete: false,
                    },
                  },
                });
              }, i * stepMs);
            }
            // After all steps complete: brief beat, then trigger collapse.
            schedule(() => {
              dispatch({
                type: "PatchMessage",
                id: stepMsgId,
                patch: {
                  thinking: {
                    steps: step.thinkingSteps!,
                    activeIndex: stepsCount,
                    expanded: false,
                    revealComplete: true,
                  },
                },
              });
            }, stepsTotal + 250);
            // After collapse + widget enter: complete the message and advance.
            schedule(
              () => {
                dispatch({ type: "CompleteMessage", id: stepMsgId });
                schedule(() => dispatch({ type: "AdvanceStep" }), 300);
              },
              stepsTotal + 250 + collapseMs + widgetEnterMs,
            );
          } else {
            // Resuming after pause: just skip ahead. The thinking slice in
            // state is whatever it was when paused; we move on rather than
            // replay.
            schedule(() => dispatch({ type: "AdvanceStep" }), 100);
          }
        }, preDelay);
      } else {
        // Existing dot-pulse / typewriter flow (unchanged).
        const thinkingMs = step.thinkingMs ?? 600;
        schedule(() => {
          if (thinkingMs > 0 && !alreadyAdded) {
            dispatch({ type: "SetTyping", show: true });
          }
          schedule(
            () => {
              dispatch({ type: "SetTyping", show: false });
              if (!alreadyAdded) {
                dispatch({
                  type: "AddScriptMessage",
                  message: {
                    id: stepMsgId,
                    role: "assistant",
                    text: useTypewriter ? "" : fullText,
                    fullText,
                    widget: step.widget,
                    source: "script",
                    status: useTypewriter ? "revealing" : "complete",
                    stepIndex,
                    widgetEnterDelayMs: step.widgetEnterDelayMs,
                  },
                });
                if (useTypewriter) {
                  for (let i = 1; i <= fullText.length; i++) {
                    schedule(() => {
                      dispatch({
                        type: "PatchMessage",
                        id: stepMsgId,
                        patch: { text: fullText.slice(0, i) },
                      });
                      if (i === fullText.length) {
                        dispatch({ type: "CompleteMessage", id: stepMsgId });
                        schedule(() => dispatch({ type: "AdvanceStep" }), 350);
                      }
                    }, i * charMs);
                  }
                } else {
                  schedule(() => dispatch({ type: "AdvanceStep" }), 450);
                }
              } else {
                // Resuming after pause: skip ahead.
                schedule(() => dispatch({ type: "AdvanceStep" }), 100);
              }
            },
            alreadyAdded ? 0 : thinkingMs,
          );
        }, preDelay);
      }
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
    // We deliberately omit state.messages — the orchestrator only re-fires on
    // phase or stepIndex changes; the alreadyAdded check uses a snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.stepIndex, script]);

  const enterViewport = useCallback(() => {
    dispatch({ type: "EnterViewport" });
  }, []);

  const exitViewport = useCallback(() => {
    dispatch({ type: "ExitViewport" });
  }, []);

  const submitUserMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const submitId = ++userMsgCounter.current;
    const userId = makeId("user", submitId);
    const ctaId = makeId("cta-resp", submitId);
    dispatch({ type: "AppendUserMessage", id: userId, text });
    window.setTimeout(() => {
      dispatch({ type: "SetTyping", show: true });
      window.setTimeout(() => {
        const variant = CTA_RESPONSES[(submitId - 1) % CTA_RESPONSES.length];
        dispatch({
          type: "AppendCtaResponse",
          id: ctaId,
          text: variant.text,
          widget: variant.cta,
        });
        dispatch({ type: "FinishResponding" });
      }, 900);
    }, 200);
  }, []);

  const toggleThinking = useCallback((id: string) => {
    dispatch({ type: "ToggleThinking", id });
  }, []);

  return useMemo(
    () => ({
      phase: state.phase,
      messages: state.messages,
      showTypingDots: state.showTypingDots,
      reducedMotion: state.reducedMotion,
      userSubmitCount: state.userSubmitCount,
      enterViewport,
      exitViewport,
      submitUserMessage,
      toggleThinking,
    }),
    [
      state.phase,
      state.messages,
      state.showTypingDots,
      state.reducedMotion,
      state.userSubmitCount,
      enterViewport,
      exitViewport,
      submitUserMessage,
      toggleThinking,
    ],
  );
}
