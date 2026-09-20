# S A H A N — Portfolio

Personal portfolio of **Sahan Chathumina** — Network Engineer, Cybersecurity Enthusiast, and
Developer. A dark, engineering-styled site built with Next.js 14 (App Router), strict TypeScript,
Tailwind CSS, and Framer Motion.

## Features

- **5 pages**: Home (`/`), About (`/about`), Projects (`/projects`), Articles (`/articles` +
  `/articles/[slug]`), Contact (`/contact`), plus `POST /api/contact`
- **Global shell**: navbar with active state + fullscreen mobile menu, page transitions,
  scroll-progress bar, desktop-only custom cursor, minimal loader, animated network-pulse
  background (respects `prefers-reduced-motion`), live Asia/Colombo clock, footer
- **Home**: hero with interactive SVG network topology, honest quick-stats, skills preview,
  featured projects, latest articles, contact CTA
- **About**: profile, education timeline (verified items only, no invented dates), technical
  focus, creative side, current journey + interactive packet-journey topology
- **Projects**: category filter, featured section, detail modal (ESC/backdrop/close, focus
  trap, mobile-friendly), live GitHub repo list with graceful fallback
- **Articles**: featured, live search + category filter with animated filtering, per-article
  pages with table of contents + related posts. Seeded posts are labelled **SAMPLE**.
- **Contact**: social cards, React Hook Form + Zod validation, rate-limited API with
  sanitization, animated success/error modal, Resend delivery with dev-mode simulation
- **SEO/a11y**: semantic HTML, JSON-LD Person, OG/Twitter/canonical metadata, robots +
  sitemap, skip link, focus rings, labelled forms, keyboard-operable modals

## Stack

Next.js 14 · React 18 · TypeScript (strict) · Tailwind CSS 3 · Framer Motion · Lucide icons ·
Zod · React Hook Form · Prisma (SQLite dev, Postgres-compatible) · Resend

## Project structure

```text
app/                  # Routes: page/layout + about, projects, articles(+[slug]), contact, api/contact
components/
  animations/         # Central variants (fadeUp/fadeIn/scaleIn/stagger) + Reveal
  layout/             # Navbar, Footer, PageTransition, ScrollProgress, CustomCursor,
                      # AppLoader, BackgroundGrid, LiveClock
  hero/               # NetworkVisualization (interactive SVG topology)
  home/               # ProjectsPreview (client modal wrapper)
  projects/           # ProjectCard, ProjectModal
  articles/           # ArticleCard (+ SampleBadge)
  about/              # Timeline, SkillCard, JourneyTopology
  contact/            # ContactForm, FormModal
  ui/                 # SectionHeading, Card
config/site.ts        # Nav, socials, URLs — edit placeholders here
data/                 # projects.ts, articles.ts, education.ts
lib/                  # utils, validation (Zod), email (Resend), rate-limit, db (Prisma hook),
                      # github, use-focus-trap
prisma/schema.prisma  # ContactMessage model (SQLite dev)
public/images/        # Static art (portrait.svg)
```

## Getting started

Prerequisites: Node.js 18.18+ and npm.

```powershell
npm install
npm run dev      # http://localhost:3000
```

## Environment

Copy `.env.example` to `.env` and fill in:

| Variable               | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `RESEND_API_KEY`       | Resend API key for contact-form delivery           |
| `CONTACT_TO_EMAIL`     | Inbox receiving contact messages                   |
| `CONTACT_FROM_EMAIL`   | Verified sender (defaults to Resend onboarding)    |
| `GITHUB_USERNAME`      | GitHub user for social links + repo list           |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata + sitemap          |

Without `RESEND_API_KEY`/`CONTACT_TO_EMAIL`, the contact API simulates delivery (logged
server-side) so the form flow still works locally. Never commit `.env`.

## Database (optional)

```powershell
$env:DATABASE_URL="file:./dev.db"
npm run prisma:migrate   # creates SQLite DB from prisma/schema.prisma
```

For Postgres, change `provider` to `"postgresql"` in `prisma/schema.prisma`, point
`DATABASE_URL` at your instance, and extend `persistContactMessage()` in `lib/db.ts`
with a real Prisma write.

## Checks & build

```powershell
npm run lint        # next lint
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm start           # serve the production build
```

## Deploy

Deploy to a Node host (Vercel, VPS, Docker) — the contact API needs a server runtime, so
plain static hosting (e.g. GitHub Pages export) is not suitable without replacing the API
with an external form endpoint.

## Placeholders you must fill

1. `.env` — `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `GITHUB_USERNAME`, `NEXT_PUBLIC_SITE_URL`
2. `config/site.ts` — LinkedIn/Facebook URLs (currently `"#"` placeholders rendered disabled),
   contact email, production URL
3. `data/` — replace sample articles (`sample: true`) with real posts; add project repo/demo
   URLs only when they genuinely exist
4. Identity rule: never label the author Senior/Expert/Architect/CTO; no fake stats, clients,
   years, or awards anywhere in content
