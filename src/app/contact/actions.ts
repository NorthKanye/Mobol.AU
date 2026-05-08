"use server";

import {
  contactSchema,
  type ContactFieldErrors,
  type ContactState,
} from "@/lib/contact-schema";

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors as ContactFieldErrors,
    };
  }

  // Honeypot tripped — silently drop without leaking the rejection.
  if (parsed.data.website) {
    return {
      status: "success",
      message: "Thanks — we'll be in touch.",
    };
  }

  // Placeholder delivery: log the validated payload server-side.
  // Swap this for an email/CRM call when ready.
  console.log("[contact]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return {
    status: "success",
    message: "Thanks — we'll be in touch within 2 business days.",
  };
}
