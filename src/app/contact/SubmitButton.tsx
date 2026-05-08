"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="
        inline-flex items-center justify-center gap-2
        h-[48px] px-7
        rounded-full
        bg-ink text-surface
        text-[14px] font-medium
        transition-transform
        enabled:hover:scale-[1.02] enabled:active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink
      "
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="inline-block w-3.5 h-3.5 rounded-full border-2 border-surface/40 border-t-surface animate-spin"
          />
          Sending…
        </>
      ) : (
        "Send message"
      )}
    </button>
  );
}
