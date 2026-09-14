export const profile = {
  name: "Sahan Chathumina",
  role: "Cybersecurity & Network Engineering Student",
  location: "Sri Lanka",
  github: "https://github.com/Sahan-Chathumina-25",
  email: "chathuminacsahan25@gmail.com",
  linkedin: "https://www.linkedin.com/in/sahan-chathumina-4a5723316/",
  user: "sahan",
  host: "portfolio",
};

export const prompt = () => `${profile.user}@${profile.host}:~$`;

export const projects = [
  {
    slug: "secure-lan-monitor",
    title: "Secure LAN Monitor",
    description:
      "Python + Wireshark/tshark toolkit for discovering hosts, flagging open ports and exporting audit reports for small LANs.",
    tags: ["Python", "Wireshark", "Networking"],
    stack: "Python / tshark / SQLite",
    year: "2025",
  },
  {
    slug: "dns-dhcp-lab",
    title: "DNS & DHCP Home Lab",
    description:
      "BIND9 + ISC DHCP virtual lab with VLANs, subnetting worksheets and failover notes for repeatable network practice.",
    tags: ["BIND9", "DHCP", "VLAN"],
    stack: "Linux / BIND9 / VirtualBox",
    year: "2025",
  },
  {
    slug: "wordpress-hardening",
    title: "WordPress Hardening Guide",
    description:
      "Checklist and starter configs for hardening WordPress: least-privilege users, 2FA, backups and header lockdown.",
    tags: ["WordPress", "Security", "PHP"],
    stack: "WordPress / PHP / Apache",
    year: "2024",
  },
  {
    slug: "linux-dotfiles",
    title: "Linux Dotfiles & Tooling",
    description:
      "Opinionated dotfiles with tmux, Neovim and hardened SSH defaults for fast CTF and lab setup on fresh VMs.",
    tags: ["Linux", "Bash", "Neovim"],
    stack: "Bash / tmux / Neovim",
    year: "2024",
  },
  {
    slug: "portfolio-api",
    title: "Portfolio Contact API",
    description:
      "Minimal Node/Express contact backend with validation and rate limits backing this portfolio contact form.",
    tags: ["Node.js", "Express", "API"],
    stack: "Node / Express / Vite",
    year: "2025",
  },
  {
    slug: "wifi-audit-notes",
    title: "Wi-Fi Audit Notes",
    description:
      "Study notes and scripts for legal Wi-Fi auditing: capture analysis, handshake checks and reporting templates.",
    tags: ["Wi-Fi", "Aircrack", "Reports"],
    stack: "Aircrack-ng / Wireshark",
    year: "2024",
  },
];

export const articles = [
  {
    slug: "subnetting-in-10-minutes",
    title: "Subnetting in 10 Minutes",
    excerpt: "A quick mental model for CIDR, masks and carving VLANs without a calculator.",
    date: "2025-08-10",
  },
  {
    slug: "harden-wordpress-basics",
    title: "Harden WordPress Basics",
    excerpt: "The five settings I change first on every fresh WordPress install.",
    date: "2025-06-22",
  },
  {
    slug: "wireshark-filters-i-use",
    title: "Wireshark Filters I Use Daily",
    excerpt: "Display filters for DHCP, DNS and suspicious LAN chatter during audits.",
    date: "2025-04-15",
  },
];

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];
