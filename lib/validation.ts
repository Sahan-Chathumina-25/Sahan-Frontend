import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (min 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  subject: z
    .string()
    .trim()
    .min(3, "Please enter a subject (min 3 characters).")
    .max(120, "Subject must be 120 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Please write a message of at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Minimal sanitization: strip control chars + angle brackets to neutralise HTML injection. */
export function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>"']/g, "")
    .trim();
}

export function sanitizeContact(input: ContactInput): ContactInput {
  return {
    name: sanitizeText(input.name),
    email: sanitizeText(input.email),
    subject: sanitizeText(input.subject),
    message: sanitizeText(input.message),
  };
}
