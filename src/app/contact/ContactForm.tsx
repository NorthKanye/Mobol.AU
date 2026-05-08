"use client";

import { useActionState, useId } from "react";
import { submitContact } from "./actions";
import SubmitButton from "./SubmitButton";
import {
  BUDGETS,
  BUDGET_LABELS,
  COMPANY_MAX,
  EMAIL_MAX,
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  initialContactState,
  type ContactFieldErrors,
} from "@/lib/contact-schema";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-[12px] text-[#a83232]">
      {errors[0]}
    </p>
  );
}

const labelClass = "text-[12px] tracking-[0.18em] uppercase text-ink-2";
const inputBase =
  "w-full bg-surface border border-border rounded-xl px-4 h-[46px] text-[15px] text-ink placeholder:text-ink-3 transition-colors hover:border-ink/30 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 aria-[invalid=true]:border-[#a83232] aria-[invalid=true]:ring-[#a83232]/15";
const textareaBase =
  "w-full bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-ink-3 transition-colors hover:border-ink/30 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 aria-[invalid=true]:border-[#a83232] aria-[invalid=true]:ring-[#a83232]/15 resize-y min-h-[140px]";

export default function ContactForm() {
  const [state, formAction] = useActionState(
    submitContact,
    initialContactState,
  );
  const formId = useId();
  const errors: ContactFieldErrors =
    state.status === "error" ? state.errors ?? {} : {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-5 py-6"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-surface"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4.5 10.5l3.5 3.5 7.5-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="text-[28px] font-bold tracking-tighter-display text-ink leading-tight">
          Message received.
        </h3>
        <p className="text-[15px] leading-[1.55] text-ink-body max-w-[440px]">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Honeypot — visually and semantically hidden but real <input> in
          the DOM so naive bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
        defaultValue=""
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            maxLength={NAME_MAX}
            autoComplete="name"
            placeholder="Jane Cooper"
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name ? `${formId}-name-error` : undefined
            }
            className={`${inputBase} mt-2`}
          />
          <FieldError id={`${formId}-name-error`} errors={errors.name} />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            maxLength={EMAIL_MAX}
            autoComplete="email"
            placeholder="jane@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? `${formId}-email-error` : undefined
            }
            className={`${inputBase} mt-2`}
          />
          <FieldError id={`${formId}-email-error`} errors={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-company`} className={labelClass}>
          Company <span className="lowercase text-ink-3">(optional)</span>
        </label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          maxLength={COMPANY_MAX}
          autoComplete="organization"
          placeholder="Acme Co."
          aria-invalid={!!errors.company}
          aria-describedby={
            errors.company ? `${formId}-company-error` : undefined
          }
          className={`${inputBase} mt-2`}
        />
        <FieldError id={`${formId}-company-error`} errors={errors.company} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${formId}-projectType`} className={labelClass}>
            Project type
          </label>
          <select
            id={`${formId}-projectType`}
            name="projectType"
            required
            defaultValue=""
            aria-invalid={!!errors.projectType}
            aria-describedby={
              errors.projectType ? `${formId}-projectType-error` : undefined
            }
            className={`${inputBase} mt-2 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 4.5l3 3 3-3%22 stroke=%22%235c5c5c%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-10`}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {PROJECT_TYPES.map((value) => (
              <option key={value} value={value}>
                {PROJECT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
          <FieldError
            id={`${formId}-projectType-error`}
            errors={errors.projectType}
          />
        </div>

        <div>
          <label htmlFor={`${formId}-budget`} className={labelClass}>
            Budget <span className="lowercase text-ink-3">(optional)</span>
          </label>
          <select
            id={`${formId}-budget`}
            name="budget"
            defaultValue=""
            aria-invalid={!!errors.budget}
            aria-describedby={
              errors.budget ? `${formId}-budget-error` : undefined
            }
            className={`${inputBase} mt-2 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 4.5l3 3 3-3%22 stroke=%22%235c5c5c%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-10`}
          >
            <option value="">Prefer not to say</option>
            {BUDGETS.map((value) => (
              <option key={value} value={value}>
                {BUDGET_LABELS[value]}
              </option>
            ))}
          </select>
          <FieldError id={`${formId}-budget-error`} errors={errors.budget} />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelClass}>
          Project details
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          rows={5}
          placeholder="Tell us about your goals, audience, and timeline."
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? `${formId}-message-error` : undefined
          }
          className={`${textareaBase} mt-2`}
        />
        <FieldError id={`${formId}-message-error`} errors={errors.message} />
      </div>

      <label className="flex items-start gap-3 mt-1 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          aria-describedby={
            errors.consent ? `${formId}-consent-error` : undefined
          }
          aria-invalid={!!errors.consent}
          className="mt-1 h-4 w-4 rounded border-border text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        <span className="text-[13px] leading-[1.55] text-ink-body">
          I agree to be contacted about my enquiry. We'll never share your
          details.
        </span>
      </label>
      <FieldError id={`${formId}-consent-error`} errors={errors.consent} />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
        <p
          role="status"
          aria-live="polite"
          className={`text-[13px] min-h-[1.25rem] ${
            state.status === "error" ? "text-[#a83232]" : "text-ink-2"
          }`}
        >
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
