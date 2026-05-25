"use client";

// Receives pending from the parent's useActionState() instead of
// useFormStatus() — useFormStatus only tracks <form action={...}> forms,
// and ContactForm uses a manual onSubmit handler to opt out of React 19's
// uncontrolled-field auto-reset.

export default function SubmitButton({ pending = false }: { pending?: boolean }) {
  return (
    <button
      type="submit"
      aria-disabled={pending}
      aria-busy={pending}
      onClick={(e) => {
        if (pending) e.preventDefault();
      }}
      className="
        inline-flex items-center justify-center gap-2
        h-[48px] px-7
        rounded-full
        bg-ink text-surface
        text-[14px] font-medium
        transition-transform
        aria-[disabled=false]:hover:scale-[1.02] aria-[disabled=false]:active:scale-[0.99]
        aria-[disabled=true]:opacity-60 aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:pointer-events-none
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
