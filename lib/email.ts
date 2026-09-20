import type { ContactInput } from "@/lib/validation";

export interface EmailResult {
  delivered: boolean;
  simulated: boolean;
}

/**
 * Sends the contact message via Resend when RESEND_API_KEY is configured.
 * Without a key (local dev), it logs and returns a simulated success so the
 * form flow can be exercised without credentials. Never throws secrets.
 */
export async function sendContactEmail(input: ContactInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.log("[contact] email simulated (missing RESEND_API_KEY/CONTACT_TO_EMAIL)", {
      name: input.name,
      subject: input.subject,
    });
    return { delivered: false, simulated: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[Portfolio] ${input.subject}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });

  if (error) {
    console.error("[contact] resend error:", error.message);
    throw new Error("Email delivery failed.");
  }
  return { delivered: true, simulated: false };
}
