export type ProjectCategory =
  | "Networking"
  | "Cybersecurity"
  | "Web"
  | "Full-Stack"
  | "Automation"
  | "Creative";

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly category: ProjectCategory;
  readonly description: string;
  readonly technologies: readonly string[];
  /** Optional image path under /public/images. Omit to render a gradient placeholder. */
  readonly image?: string;
  /** Optional repo URL. Omit (or leave undefined) when there is no public repo — UI shows "Code coming soon". */
  readonly github?: string;
  /** Optional live URL. Only set for real, deployed URLs — never placeholder links. */
  readonly demo?: string;
  readonly featured: boolean;
  readonly problem: string;
  readonly solution: string;
}

export const projectCategories: readonly ["All", ...ProjectCategory[]] = [
  "All",
  "Networking",
  "Cybersecurity",
  "Web",
  "Full-Stack",
  "Automation",
  "Creative",
];

export const projects: readonly Project[] = [
  {
    id: "campus-vlan-lab",
    title: "Campus VLAN Segmentation Lab",
    category: "Networking",
    description:
      "A segmented campus network design with VLANs, inter-VLAN routing, and ACLs, built and validated in a virtual lab.",
    technologies: ["Cisco IOS", "VLAN", "OSPF", "ACL", "Packet Tracer"],
    featured: true,
    problem:
      "Flat networks let any host reach any other host, so a single compromised device can move laterally across labs, offices, and servers.",
    solution:
      "Designed VLANs per department with a router-on-a-stick plus Layer-3 switch, OSPF between distribution nodes, and ACLs limiting server-VLAN access to required ports only. Documented addressing, test cases, and verification steps.",
  },
  {
    id: "wireless-site-survey",
    title: "Home-Lab Wireless Survey Notes",
    category: "Networking",
    description:
      "Methodical notes from surveying my home lab: signal mapping, channel overlap, and AP placement experiments.",
    technologies: ["Wi-Fi 6", "Site Survey", "Wireshark", "Documentation"],
    featured: false,
    problem:
      "Dead spots and channel interference made video calls and lab work unreliable in parts of the house.",
    solution:
      "Mapped RSSI per room, moved overlapping APs to non-adjacent channels, and recorded before/after measurements so the process is repeatable.",
  },
  {
    id: "password-hygiene-audit",
    title: "Personal Password-Hygiene Audit",
    category: "Cybersecurity",
    description:
      "A structured self-audit: unique passphrases, password manager rollout, and 2FA coverage across personal accounts.",
    technologies: ["Password Manager", "2FA", "Threat Modelling", "Checklists"],
    featured: false,
    problem:
      "Reused passwords and missing second factors are the most common way personal accounts get taken over.",
    solution:
      "Migrated every account to unique generated passwords, enabled app-based 2FA where supported, and wrote a repeatable checklist others can follow.",
  },
  {
    id: "portfolio-website",
    title: "This Portfolio Website",
    category: "Web",
    description:
      "This site — Next.js App Router, strict TypeScript, Tailwind, and motion design with a validated contact API.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zod"],
    featured: true,
    problem:
      "I needed a single place to present networking labs, security notes, and software work with an honest, verifiable identity.",
    solution:
      "Built a five-page portfolio with reusable components, a rate-limited contact API, security headers, and SEO basics — no inflated claims, no fake metrics.",
  },
  {
    id: "lab-inventory-tracker",
    title: "Home-Lab Inventory Tracker",
    category: "Full-Stack",
    description:
      "A small CRUD app tracking lab devices, firmware versions, and IP assignments for my home network.",
    technologies: ["Next.js", "SQLite", "Prisma", "React Hook Form"],
    featured: true,
    problem:
      "Lab devices, IPs, and firmware versions lived in scattered notes, so troubleshooting started with archaeology.",
    solution:
      "One inventory with search, per-device notes, and IP tracking. Prisma schema is SQLite locally and Postgres-compatible for deployment.",
  },
  {
    id: "config-backup-scripts",
    title: "Config Backup Scripts",
    category: "Automation",
    description:
      "Scheduled scripts that pull running configs from lab devices and store timestamped, diffable copies.",
    technologies: ["Python", "Netmiko", "Cron", "Git"],
    featured: false,
    problem:
      "Manual backups were forgotten, so a misconfiguration meant rebuilding from memory.",
    solution:
      "Nightly pulls over SSH with Netmiko, timestamped files committed to a local Git repo for instant diffs and rollback reference.",
  },
  {
    id: "network-poster-series",
    title: "Subnetting Visual Explainer",
    category: "Creative",
    description:
      "A visual explainer series breaking subnetting into diagrams I wish I had when starting out.",
    technologies: ["Figma", "Technical Illustration", "Typography"],
    featured: false,
    problem:
      "Subnetting tutorials are often walls of binary math that lose beginners before the intuition lands.",
    solution:
      "A step-by-step visual series: address blocks as physical space, masks as boundaries, one worked example per poster.",
  },
];

export function getFeaturedProjects(): readonly Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
