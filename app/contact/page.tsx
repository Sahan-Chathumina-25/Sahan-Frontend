import type { Metadata } from "next";
import { Facebook, Github, Linkedin, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sahan Chathumina — networking labs, security study, and collaborative builds.",
  alternates: { canonical: "/contact" },
};

const socialCards = [
  { label: "GitHub", detail: `@${siteConfig.githubUsername}`, href: `https://github.com/${siteConfig.githubUsername}`, Icon: Github, placeholder: false },
  { label: "LinkedIn", detail: "Profile coming soon", href: "#", Icon: Linkedin, placeholder: true },
  { label: "Facebook", detail: "Profile coming soon", href: "#", Icon: Facebook, placeholder: true },
  { label: "Email", detail: "Use the form below", href: "#form", Icon: Mail, placeholder: false },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-paper-dim">
          Questions about a lab, an idea for a build, or just want to say hello — my inbox is
          open. I read everything and reply as soon as study allows.
        </p>
      </Reveal>

      {/* Social cards */}
      <section aria-label="Social profiles" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {socialCards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.06}>
            {card.placeholder || card.href === "#form" ? (
              <div
                className="flex h-full items-center gap-3 rounded-xl border border-white/10 bg-ink-800/60 p-4"
                aria-disabled={card.placeholder}
                title={card.placeholder ? `${card.label} URL not set yet — see config/site.ts` : undefined}
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-paper-dim">
                  <card.Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-paper">{card.label}</span>
                  <span className="block text-xs text-paper-dim/70">{card.detail}</span>
                </span>
              </div>
            ) : (
              <a
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-full items-center gap-3 rounded-xl border border-white/10 bg-ink-800/60 p-4 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-primary">
                  <card.Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-paper">{card.label}</span>
                  <span className="block break-all font-mono text-xs text-paper-dim/80">{card.detail}</span>
                </span>
              </a>
            )}
          </Reveal>
        ))}
      </section>

      {/* Form */}
      <section aria-labelledby="form-heading" id="form" className="mx-auto mt-12 max-w-2xl scroll-mt-24">
        <Reveal>
          <h2 id="form-heading" className="font-display text-2xl font-semibold text-paper">
            Send a message
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-paper-dim">
            Validated, rate-limited, and delivered straight to my inbox. No newsletters, no tracking.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-6">
          <ContactForm />
        </Reveal>
      </section>
    </div>
  );
}
