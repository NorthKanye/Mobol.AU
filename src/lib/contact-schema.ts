import { z } from "zod";

export const PROJECT_TYPES = [
  "brand",
  "website",
  "product",
  "other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  brand: "Brand identity",
  website: "Website",
  product: "Digital product",
  other: "Something else",
};

export const BUDGETS = ["<10k", "10-25k", "25-75k", "75k+", "unsure"] as const;
export type Budget = (typeof BUDGETS)[number];

export const BUDGET_LABELS: Record<Budget, string> = {
  "<10k": "Under $10k",
  "10-25k": "$10k – $25k",
  "25-75k": "$25k – $75k",
  "75k+": "$75k+",
  unsure: "Not sure yet",
};

export const NAME_MAX = 80;
export const EMAIL_MAX = 120;
export const COMPANY_MAX = 120;
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(NAME_MAX, `Keep it under ${NAME_MAX} characters`),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email")
    .max(EMAIL_MAX),
  company: optionalString(COMPANY_MAX),
  projectType: z.enum(PROJECT_TYPES, {
    message: "Pick a project type",
  }),
  budget: z.enum(BUDGETS).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, "A few sentences helps us reply meaningfully")
    .max(MESSAGE_MAX, `Please keep it under ${MESSAGE_MAX} characters`),
  consent: z.literal("on", {
    message: "Please agree to be contacted",
  }),
  // Honeypot — bots fill every input. Real users never see this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<
  Record<keyof ContactInput, string[]>
>;

export type ContactState =
  | { status: "idle" }
  | { status: "error"; message: string; errors?: ContactFieldErrors }
  | { status: "success"; message: string };

export const initialContactState: ContactState = { status: "idle" };
