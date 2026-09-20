export interface EducationItem {
  readonly id: string;
  readonly title: string;
  readonly institution: string;
  readonly detail: string;
}

/**
 * Education history. No dates are shown — only verified items are listed,
 * with no invented timelines, grades, or credentials.
 */
export const education: readonly EducationItem[] = [
  {
    id: "bsc-ethical-hacking",
    title: "BSc (Hons) Ethical Hacking & Network Security",
    institution: "NIBM",
    detail:
      "Undergraduate focus on offensive and defensive security, network design, and security fundamentals.",
  },
  {
    id: "hnd-network-engineering",
    title: "HND in Network Engineering",
    institution: "NIBM",
    detail:
      "Hands-on grounding in routing, switching, addressing, and enterprise network operations.",
  },
  {
    id: "diploma-english",
    title: "Diploma in English — English in Seven Boxes",
    institution: "English in Seven Boxes",
    detail:
      "Structured English communication skills supporting clear technical writing and documentation.",
  },
  {
    id: "cert-full-stack",
    title: "Certificate — Full Stack Development",
    institution: "Certification programme",
    detail:
      "End-to-end web development: interfaces, APIs, data modelling, and deployment basics.",
  },
  {
    id: "cert-ui-ux",
    title: "Certificate — UI/UX Design",
    institution: "Certification programme",
    detail:
      "User-centred design foundations: layout, usability, and prototyping for the creative side of my work.",
  },
];

export interface SkillCategory {
  readonly title: string;
  readonly skills: readonly string[];
}

/** Skill areas I actively study and practise — no proficiency claims, no years-of-experience. */
export const skillCategories: readonly SkillCategory[] = [
  {
    title: "Networking",
    skills: ["TCP/IP & Subnetting", "VLANs & Switching", "Routing (OSPF)", "Wi-Fi Fundamentals", "Packet Analysis"],
  },
  {
    title: "Cybersecurity",
    skills: ["Security Fundamentals", "Password Hygiene", "2FA & Hardening", "Threat Modelling", "Ethical Hacking Study"],
  },
  {
    title: "Software",
    skills: ["TypeScript", "Next.js & React", "Node.js", "Python Scripting", "REST APIs"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git & GitHub", "Linux CLI", "Packet Tracer", "Wireshark", "VS Code"],
  },
  {
    title: "Creative",
    skills: ["UI Layout", "Technical Illustration", "Figma", "Writing & Docs", "Visual Explainers"],
  },
];
