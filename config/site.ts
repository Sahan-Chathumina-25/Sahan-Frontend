export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** True when the URL is still a placeholder — rendered as disabled. */
  readonly placeholder?: boolean;
}

const githubUsername =
  process.env.GITHUB_USERNAME ?? process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "Sahan-Chathumina-25";

export const siteConfig = {
  name: "S A H A N",
  fullName: "Sahan Chathumina",
  role: "Network Engineer",
  tagline: "Network Engineer | Cybersecurity | Full-Stack Developer",
  description:
    "Portfolio of Sahan Chathumina — a technology-focused student working across network engineering, cybersecurity, and software development.",
  // TODO: replace with your production URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sahan-chathumina-25.github.io",
  locale: "en_US",
  timeZone: "Asia/Colombo",
  // TODO: replace with your real inbox. Never hardcode secrets here.
  contactEmail: process.env.CONTACT_TO_EMAIL ?? "contact@example.com",
  githubUsername,
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Articles", href: "/articles" },
    { label: "Contact", href: "/contact" },
  ] as const,
  socials: [
    { label: "GitHub", href: `https://github.com/${githubUsername}`, placeholder: false },
    // TODO: replace "#" with your real profile URLs in this file.
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "Facebook", href: "#", placeholder: true },
  ] as const satisfies readonly SocialLink[],
};

export type SiteConfig = typeof siteConfig;
