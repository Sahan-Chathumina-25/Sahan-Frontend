import { NextResponse } from "next/server";
import { z } from "zod";
import { contactSchema, sanitizeContact } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";
import { persistContactMessage } from "@/lib/db";

export const runtime = "nodejs";

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request): Promise<NextResponse> {
  // Rate limit: 5 requests / 10 min per IP.
  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: `Too many messages — please try again in ${limit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  // Parse + validate. Never trust the body shape.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  let parsed: z.infer<typeof contactSchema>;
  try {
    parsed = contactSchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed.",
          fields: err.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const clean = sanitizeContact(parsed);

  try {
    await persistContactMessage(clean);
    const result = await sendContactEmail(clean);
    return NextResponse.json({ ok: true, simulated: result.simulated });
  } catch {
    // Generic message only — no internals or secrets leak to the client.
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }
}
