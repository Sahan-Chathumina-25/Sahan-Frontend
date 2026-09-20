import Link from "next/link";
import { Facebook, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { LiveClock } from "@/components/layout/LiveClock";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Facebook: Facebook,
};

export function SocialLinks({ className }: { readonly className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {siteConfig.socials.map((social) => {
        const Icon = icons[social.label] ?? Github;
        if (social.placeholder) {
          return (
            <span
              key={social.label}
              title={`${social.label} — coming soon`}
              aria-label={`${social.label} (coming soon)`}
              aria-disabled="true"
              className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-white/10 text-paper-dim/40"
            >
              <Icon size={18} />
            </span>
          );
        }
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-paper-dim transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Icon size={18} />
          </a>
        );
      })}
      <a
        href="/contact"
        aria-label="Email via contact form"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-paper-dim transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Mail size={18} />
      </a>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.4em] text-paper">
            {siteConfig.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper-dim">
            {siteConfig.tagline}. Technology-focused student working across networks, security,
            and software.
          </p>
          <SocialLinks className="mt-4" />
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-widest text-paper-dim">Navigate</p>
          <ul className="mt-3 space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-paper-dim transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-paper-dim">Local time</p>
          <LiveClock className="mt-3 block font-mono text-sm text-paper" />
          <p className="mt-1 text-xs text-paper-dim/70">Asia/Colombo · UTC+5:30</p>
          <p className="mt-4 text-xs text-paper-dim/70">
            © {year} {siteConfig.fullName}. Built with Next.js + TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
