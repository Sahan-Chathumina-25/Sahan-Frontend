"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { FormModal, type FormStatus } from "@/components/contact/FormModal";
import { cn } from "@/lib/utils";

interface ApiResponse {
  ok?: boolean;
  simulated?: boolean;
  error?: string;
}

function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.ok === undefined || typeof v.ok === "boolean") &&
    (v.simulated === undefined || typeof v.simulated === "boolean") &&
    (v.error === undefined || typeof v.error === "string")
  );
}

const inputClasses = (invalid: boolean) =>
  cn(
    "w-full rounded-md border bg-ink-950/70 px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-dim/40 outline-none transition-colors",
    invalid
      ? "border-red-400/60 focus:border-red-400"
      : "border-white/10 focus:border-primary/60"
  );

// Static-export note: GitHub Pages serves only static files, so `/api/contact`
// (Resend + rate-limit, see `app/api/contact/route.ts`) does not exist in the
// deployed demo. When built with `NEXT_PUBLIC_STATIC_EXPORT=true` (set in
// `.github/workflows/deploy.yml`), the form renders disabled with an
// explanatory note instead of silently failing. Local `npm run dev` (flag
// unset) keeps the full working behavior.
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ status: "idle" });
  const [modal, setModal] = useState<
    Extract<FormStatus, { status: "success" } | { status: "error" }> | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    // Defensive: the submit button is disabled on static export, but guard
    // against programmatic submits too.
    if (isStaticExport) return;
    setStatus({ status: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body: unknown = await res.json().catch(() => null);
      const parsed: ApiResponse = isApiResponse(body) ? body : {};
      if (!res.ok || !parsed.ok) {
        const message =
          parsed.error ?? `Request failed with status ${res.status}. Please try again.`;
        setStatus({ status: "error", error: message });
        setModal({ status: "error", error: message });
        return;
      }
      setStatus({ status: "success", simulated: parsed.simulated ?? false });
      setModal({ status: "success", simulated: parsed.simulated ?? false });
      reset();
    } catch {
      const message = "Network error — please check your connection and try again.";
      setStatus({ status: "error", error: message });
      setModal({ status: "error", error: message });
    }
  };

  const loading = status.status === "loading";

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur sm:p-8"
        aria-label="Contact form"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-paper">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={inputClasses(Boolean(errors.name))}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-red-300">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-paper">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClasses(Boolean(errors.email))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-paper">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="What is this about?"
            className={inputClasses(Boolean(errors.subject))}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            {...register("subject")}
          />
          {errors.subject && (
            <p id="contact-subject-error" role="alert" className="mt-1.5 text-xs text-red-300">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-paper">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Write your message…"
            className={cn(inputClasses(Boolean(errors.message)), "resize-y")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            {...register("message")}
          />
          {errors.message && (
            <p id="contact-message-error" role="alert" className="mt-1.5 text-xs text-red-300">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || isStaticExport}
          title={
            isStaticExport
              ? "Contact form is unavailable on the static demo"
              : undefined
          }
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending…" : "Send message"}
        </button>
        {isStaticExport && (
          <p role="note" className="mt-4 text-sm text-paper-dim">
            The contact form is unavailable on this static demo — this site is
            served from GitHub Pages with no server for message delivery.
          </p>
        )}
      </form>
      <FormModal result={modal} onClose={() => setModal(null)} />
    </>
  );
}
