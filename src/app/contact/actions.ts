"use server";

import { Resend } from "resend";
import {
  BUDGET_LABELS,
  contactSchema,
  PROJECT_TYPE_LABELS,
  type ContactInput,
  type ContactFieldErrors,
  type ContactState,
} from "@/lib/contact-schema";

const DELIVERY_ERROR_MESSAGE =
  "We couldn't send that right now. Please email hello@mobol.com.au directly.";

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    return null;
  }

  return { apiKey, from, to };
}

function optional(value: string | undefined) {
  const clean = value?.trim();
  return clean ? clean : "Not provided";
}

function subjectName(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 80);
}

function contactEmailText(input: ContactInput, receivedAt: string) {
  const budget = input.budget ? BUDGET_LABELS[input.budget] : "Not provided";

  return [
    "New Mobol contact form submission",
    "",
    `Received: ${receivedAt}`,
    "",
    "Contact",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${optional(input.phone)}`,
    `Company: ${optional(input.company)}`,
    "",
    "Project",
    `Type: ${PROJECT_TYPE_LABELS[input.projectType]}`,
    `Budget: ${budget}`,
    "",
    "Message",
    input.message,
    "",
    "Consent: Contact consent accepted",
  ].join("\n");
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot first — bots that fill the hidden "website" field get a
  // silent "success" so they can't tell the field is a trap. Done before
  // Zod so a non-empty honeypot value never produces a Zod error that
  // would leak the field's existence in the response.
  if (formData.get("website")) {
    return {
      status: "success",
      message: "Thanks — we'll be in touch.",
    };
  }

  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Almost there — a few things to fix above.",
      errors: parsed.error.flatten().fieldErrors as ContactFieldErrors,
    };
  }

  const emailConfig = getEmailConfig();
  if (!emailConfig) {
    console.error("[contact] missing email delivery configuration");
    return {
      status: "error",
      message: DELIVERY_ERROR_MESSAGE,
    };
  }

  const receivedAt = new Date().toISOString();
  const resend = new Resend(emailConfig.apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: parsed.data.email,
      subject: `New Mobol enquiry from ${subjectName(parsed.data.name)}`,
      text: contactEmailText(parsed.data, receivedAt),
    });

    if (error) {
      console.error("[contact] email delivery failed", error);
      return {
        status: "error",
        message: DELIVERY_ERROR_MESSAGE,
      };
    }

    console.info("[contact] email sent", { id: data?.id, receivedAt });
  } catch (error) {
    console.error("[contact] email delivery threw", error);
    return {
      status: "error",
      message: DELIVERY_ERROR_MESSAGE,
    };
  }

  return {
    status: "success",
    message: "Thanks — we'll be in touch within 2 business days.",
  };
}
