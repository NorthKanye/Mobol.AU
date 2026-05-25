"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavHide } from "@/components/nav/NavHideContext";
import ContactForm from "./ContactForm";
import ChatPanel from "./ChatPanel";

type View = "split" | "form" | "chat";

function FormCardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.5h13M3.5 10h13M3.5 14.5h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatCardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8.5l-3.2 2.9a.4.4 0 0 1-.7-.3V13.5h-1.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5
        h-9 px-3 -ml-1
        rounded-full
        text-[13px] font-medium text-ink-2
        transition-colors hover:text-ink hover:bg-ink/[0.04]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
      "
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.5 11L4.5 7l4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}

interface CardShellProps {
  open: boolean;
  visible: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  controlsId: string;
  eyebrow: string;
  title: string;
  blurb: string;
  Icon: () => ReactNode;
  onOpen: () => void;
  onBack: () => void;
  children: ReactNode;
  ariaLabel: string;
  headingId: string;
  disabled?: boolean;
}

function CardShell({
  open,
  visible,
  triggerRef,
  controlsId,
  eyebrow,
  title,
  blurb,
  Icon,
  onOpen,
  onBack,
  children,
  ariaLabel,
  headingId,
  disabled = false,
}: CardShellProps) {
  return (
    <div
      aria-hidden={!visible}
      aria-disabled={disabled || undefined}
      className={`
        relative h-full min-w-0 min-h-0 overflow-hidden
        rounded-2xl bg-surface border border-black/[0.04]
        ${
          open
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),_0_2px_4px_rgba(17,17,17,0.04),_0_18px_44px_rgba(17,17,17,0.10),_0_42px_84px_rgba(17,17,17,0.06)]"
            : "shadow-[0_1px_1px_rgba(17,17,17,0.03),_0_12px_32px_rgba(17,17,17,0.06),_0_32px_64px_rgba(17,17,17,0.05)]"
        }
        transition-[opacity,transform,box-shadow] duration-300
        ${visible ? (disabled && !open ? "opacity-[0.78]" : "opacity-100") : "opacity-0 pointer-events-none"}
      `}
    >
      {!open ? (
        disabled ? (
          <div
            aria-label={ariaLabel}
            className="
              block w-full h-full text-left
              p-7 sm:p-9
              cursor-default select-none
            "
          >
            <span className="flex items-center gap-3 text-ink-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.04]">
                <Icon />
              </span>
              <span className="text-[11px] tracking-[0.22em] uppercase">
                {eyebrow}
              </span>
            </span>
            <h2 className="mt-7 text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold tracking-tighter-display text-ink leading-[1.05]">
              {title}
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.55] text-ink-body max-w-[400px]">
              {blurb}
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-ink/[0.05] text-ink-2 text-[11px] tracking-[0.22em] uppercase">
              Coming soon
            </span>
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={onOpen}
            aria-expanded={false}
            aria-controls={controlsId}
            aria-label={ariaLabel}
            className="
              group block w-full h-full text-left
              p-7 sm:p-9
              cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink
              transition-transform duration-300
              hover:scale-[1.005]
            "
          >
            <span className="flex items-center gap-3 text-ink-2 transition-colors group-hover:text-ink">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.04] group-hover:bg-ink/[0.08] transition-colors">
                <Icon />
              </span>
              <span className="text-[11px] tracking-[0.22em] uppercase">
                {eyebrow}
              </span>
            </span>
            <h2 className="mt-7 text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold tracking-tighter-display text-ink leading-[1.05]">
              {title}
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.55] text-ink-body max-w-[400px]">
              {blurb}
            </p>
            <span className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
              Open
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M3.5 7h7M7.5 3.5L11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        )
      ) : (
        <div
          id={controlsId}
          role="region"
          aria-labelledby={headingId}
          className="flex h-full flex-col p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <BackButton onClick={onBack} />
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-ink-3">
              <Icon />
              {eyebrow}
            </span>
          </div>
          <h2
            id={headingId}
            tabIndex={-1}
            className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-tighter-display text-ink leading-tight outline-none"
          >
            {title}
          </h2>
          <p className="mt-2 text-[14px] leading-[1.55] text-ink-body max-w-[520px]">
            {blurb}
          </p>
          <div className="mt-6 flex-1 min-h-0 flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function ContactCards() {
  const [view, setView] = useState<View>("split");
  const { setHidden } = useNavHide();
  const formTriggerRef = useRef<HTMLButtonElement | null>(null);
  const chatTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const baseId = useId();
  const formHeadingId = `${baseId}-form-h`;
  const chatHeadingId = `${baseId}-chat-h`;
  const formRegionId = `${baseId}-form-region`;
  const chatRegionId = `${baseId}-chat-region`;

  const open = (next: "form" | "chat") => {
    lastTriggerRef.current =
      next === "form" ? formTriggerRef.current : chatTriggerRef.current;
    setView(next);
  };

  const close = () => {
    setView("split");
  };

  // ESC closes an expanded card.
  useEffect(() => {
    if (view === "split") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  // Hide the floating pill nav while the chat is in focus mode. Form expand
  // keeps the nav visible; the form has its own h2 + structured fields, so
  // the white-on-white merge that motivated this isn't an issue there.
  useEffect(() => {
    setHidden(view === "chat");
    return () => setHidden(false);
  }, [view, setHidden]);

  // Focus management — heading on expand, trigger on collapse.
  useEffect(() => {
    if (view === "form") {
      const h = document.getElementById(formHeadingId);
      h?.focus({ preventScroll: false });
    } else if (view === "chat") {
      const h = document.getElementById(chatHeadingId);
      h?.focus({ preventScroll: false });
    } else if (lastTriggerRef.current) {
      const trigger = lastTriggerRef.current;
      // Defer until after the trigger button has rendered.
      requestAnimationFrame(() => trigger?.focus());
      lastTriggerRef.current = null;
    }
  }, [view, formHeadingId, chatHeadingId]);

  // Drive the expand via inline grid styles — Tailwind v4 won't see
  // dynamically-built class strings.
  const desktopColumns =
    view === "form"
      ? "minmax(0,1fr) minmax(0,0fr)"
      : view === "chat"
        ? "minmax(0,0fr) minmax(0,1fr)"
        : "minmax(0,1fr) minmax(0,1fr)";
  const mobileRows =
    view === "form"
      ? "minmax(0,1fr) minmax(0,0fr)"
      : view === "chat"
        ? "minmax(0,0fr) minmax(0,1fr)"
        : "minmax(0,1fr) minmax(0,1fr)";

  const expanded = view !== "split";

  return (
    <>
      {/* Page-level heading — collapses to zero height on expand so the
          opened card fills the viewport without forcing the user to scroll.
          The grid-row 1fr→0fr trick animates intrinsic height smoothly. */}
      <div
        className="contact-shell-header"
        data-collapsed={expanded ? "true" : "false"}
        aria-hidden={expanded}
      >
        <div className="max-w-[640px]">
          <p className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-5">
            Contact
          </p>
          <h1 className="text-ink font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.25rem,4vw,3.5rem)]">
            Let&apos;s start
            <br />a conversation.
          </h1>
          <p className="mt-6 text-[15px] leading-[1.6] text-ink-body max-w-[520px]">
            Share a project brief and we&apos;ll get back to you within two
            business days. A live AI assistant is on the way.
          </p>
        </div>
      </div>

      <div
        className="min-h-[640px] sm:min-h-[560px] lg:min-h-[600px] transition-[min-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <div
          role="region"
          aria-label="Get in touch"
          style={
            {
              ["--cards-cols" as string]: desktopColumns,
              ["--cards-rows" as string]: mobileRows,
            } as React.CSSProperties
          }
          className="contact-cards grid h-full gap-4 sm:gap-5 lg:gap-6"
        >
          <CardShell
            open={view === "form"}
            visible={view !== "chat"}
            triggerRef={formTriggerRef}
            controlsId={formRegionId}
            headingId={formHeadingId}
            eyebrow="Form"
            title="Tell us about your project."
            blurb="Share the brief, the timeline, the budget — the more you give us, the sharper our reply."
            Icon={FormCardIcon}
            onOpen={() => open("form")}
            onBack={close}
            ariaLabel="Open contact form"
          >
            <ContactForm />
          </CardShell>

          <CardShell
            open={view === "chat"}
            visible={view !== "form"}
            disabled
            triggerRef={chatTriggerRef}
            controlsId={chatRegionId}
            headingId={chatHeadingId}
            eyebrow="AI chat"
            title="Talk to our AI assistant."
            blurb="A streaming assistant for quick questions about our work, pricing, and process. We're training it now — use the form for the moment."
            Icon={ChatCardIcon}
            onOpen={() => open("chat")}
            onBack={close}
            ariaLabel="AI chat — coming soon"
          >
            <ChatPanel active={view === "chat"} />
          </CardShell>
        </div>
      </div>
    </>
  );
}
