export interface ArticleSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface Article {
  readonly title: string;
  readonly slug: string;
  readonly category: string;
  readonly excerpt: string;
  readonly readingTime: string;
  /** ISO date (YYYY-MM-DD). Sample posts use illustrative dates and are labelled SAMPLE in the UI. */
  readonly date: string;
  readonly tags: readonly string[];
  readonly featured: boolean;
  /** Always true for the seeded posts — they are illustrative examples, not published work. */
  readonly sample: boolean;
  readonly content: readonly ArticleSection[];
}

export const articleCategories: readonly string[] = [
  "All",
  "Networking",
  "Cybersecurity",
  "Development",
  "Notes",
];

export const articles: readonly Article[] = [
  {
    title: "How I Plan a VLAN Layout Before Touching the CLI",
    slug: "planning-a-vlan-layout",
    category: "Networking",
    excerpt:
      "The paper-first checklist I use for small VLAN designs: inventory, addressing, trunk map, and test cases.",
    readingTime: "6 min read",
    date: "2025-08-10",
    tags: ["VLAN", "Lab", "Design"],
    featured: true,
    sample: true,
    content: [
      {
        heading: "Start with the inventory, not the switch",
        paragraphs: [
          "Every design I do starts as a table: device, role, department, required reachability. If a printer only needs the print server, that constraint belongs in the plan before any configuration exists.",
          "This habit saves the most time. Drawing the table forces me to ask who should talk to whom, which is the entire security model of a segmented network.",
        ],
      },
      {
        heading: "Addressing that leaves room to grow",
        paragraphs: [
          "I size each VLAN with headroom — a /24 for user segments even when only thirty hosts exist today, and small, documented /30s or /31s for point-to-point links.",
          "Every subnet gets a one-line justification. Future-me, or anyone reviewing the lab, can see why each block is the size it is.",
        ],
      },
      {
        heading: "Test cases before deployment",
        paragraphs: [
          "The last section of my plan is a list of pings and connection attempts that should succeed, and — just as important — ones that should fail.",
          "A segmentation design is only done when the deny cases are verified, not assumed.",
        ],
      },
    ],
  },
  {
    title: "What Enabling 2FA Everywhere Taught Me",
    slug: "enabling-2fa-everywhere",
    category: "Cybersecurity",
    excerpt:
      "Lessons from auditing my own accounts: recovery codes, authenticator backups, and the accounts I almost missed.",
    readingTime: "4 min read",
    date: "2025-07-02",
    tags: ["2FA", "Hygiene", "Personal Security"],
    featured: false,
    sample: true,
    content: [
      {
        heading: "The accounts you forget matter most",
        paragraphs: [
          "The audit surfaced old forum and shopping accounts reusing passwords from years ago. They felt unimportant, but each one was a password-reset path into my email.",
          "Importance is not about what the account holds — it is about what it connects to.",
        ],
      },
      {
        heading: "Recovery codes are part of the setup",
        paragraphs: [
          "Enabling 2FA without storing recovery codes just trades one lockout risk for another. I now treat printed recovery codes as part of finishing the setup, not an optional extra.",
        ],
      },
    ],
  },
  {
    title: "Strict TypeScript Habits That Survived Contact With Real Code",
    slug: "strict-typescript-habits",
    category: "Development",
    excerpt:
      "Narrowing over casting, discriminated unions over flag soup, and treating every API response as untrusted.",
    readingTime: "5 min read",
    date: "2025-06-14",
    tags: ["TypeScript", "Next.js", "Forms"],
    featured: true,
    sample: true,
    content: [
      {
        heading: "Validate at the boundary",
        paragraphs: [
          "Data from forms, APIs, and query strings is untrusted until proven otherwise. A Zod schema at the boundary turns runtime surprises into compile-time-shaped errors.",
          "This portfolio's contact form follows that pattern: React Hook Form for UX, Zod for truth.",
        ],
      },
      {
        heading: "Model states, not flags",
        paragraphs: [
          "Idle, loading, success, error — one discriminated union instead of four booleans that can combine into impossible states. Fewer states to test, fewer states to break.",
        ],
      },
    ],
  },
  {
    title: "Lab Notebook: My First OSPF Adjacency That Would Not Form",
    slug: "ospf-adjacency-notes",
    category: "Notes",
    excerpt:
      "A troubleshooting walkthrough: timers, area IDs, and the passive-interface line hiding in plain sight.",
    readingTime: "7 min read",
    date: "2025-05-20",
    tags: ["OSPF", "Troubleshooting", "Lab"],
    featured: false,
    sample: true,
    content: [
      {
        heading: "Symptoms first, theories second",
        paragraphs: [
          "The adjacency stuck in EXSTART. Before changing anything, I captured the symptom precisely: which state, on which interface, with what neighbor output.",
          "Writing the symptom down kept me from fixating on the first theory that felt right.",
        ],
      },
      {
        heading: "The checklist that found it",
        paragraphs: [
          "Area ID match, hello/dead timers match, MTU match, network statements, passive interfaces, authentication. Walking the list in order found a passive-interface statement I had added and forgotten.",
          "Boring checklists beat clever guesses. Every time, so far.",
        ],
      },
    ],
  },
];

export function getFeaturedArticles(): readonly Article[] {
  return articles.filter((a) => a.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 2): readonly Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return articles
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 0 : 1;
      const bScore = b.category === current.category ? 0 : 1;
      return aScore - bScore;
    })
    .slice(0, limit);
}
