# ayush.clanflare.dev — Portfolio

Personal portfolio of **Ayush Anand** — full-stack & freelance web developer.
An editorial "ink, paper & signal" site with case-study pages: poster type,
chapters that slide over each other as sheets, and performance-first motion.

**Live:** https://ayush.clanflare.dev

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config — no `tailwind.config`; tokens live in
  `src/app/globals.css`)
- **A tiny scroll engine** (`src/lib/motion.ts`) — one passive scroll
  listener drives every scroll-linked effect (hero recede, manifesto, process
  rail, marquee); no animation library ships to the browser (framer-motion
  remains only for dormant components)
- **View Transitions API** (native, no React experimental APIs) — a project's
  screen morphs into the case study's live embed on navigation
- **Real sites on screen** — recordings of the live sites play in browser and
  phone frames; case studies can launch the actual site in an iframe
- **Lenis** smooth scrolling
- No WebGL — every effect is transform/opacity on the compositor

## Structure

```
src/
  app/            routes: / , /work/[slug] , api/contact , sitemap , robots
  components/     effects + primitives (Section, Reveal, MediaFrame, …)
  components/sections/   homepage chapters in narrative order
  content/        ALL copy — profile, projects, services, skills, …
```

The homepage reads as numbered chapters: Hero → Selected work (01) → About
(02) → Services (03) → Process (04) → Track record (05) → Voices → Contact
(06). Edit copy in `src/content/*.ts` — components are presentation only.

## Design system

Defined in `src/app/globals.css`:

- **Surfaces**: every chapter declares `data-surface="ink" | "paper" |
  "signal"` and components only read the local tokens (`--bg`, `--fg`,
  `--muted`, `--line`, `--accent`, `--raised`). Ink `#0c0b0a`, paper `#efebe3`,
  signal red `#ff3b1f` (bright) / `#c0271a` (surface).
- **Type**: Archivo (variable; display is its 125% width, all caps) with
  Instrument Serif italic interjections — `<em>` inside any `.display`
  headline — and JetBrains Mono for data labels.
- **Motion**: one vocabulary — masked line rise, media "window" reveal,
  staggered entrances (`[data-reveal]`, one IntersectionObserver in
  `scroll-reveal.tsx`), count-ups, and sheet slide-overs between chapters.
  Content is visible by default; `prefers-reduced-motion` disables the intro,
  transitions, smooth scroll and all scrubbed effects.
- **Intro**: plays once per browser session on the first homepage load
  (pure CSS, gated by the pre-paint script in `layout.tsx`).

## Environment variables

The contact form posts to `/api/contact`, which relays via
[Resend](https://resend.com)'s REST API:

| Variable | Required | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | yes (form falls back to `mailto:` without it) | — |
| `CONTACT_TO_EMAIL` | no | profile email |
| `CONTACT_FROM_EMAIL` | no | `Portfolio <onboarding@resend.dev>` |

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Assets

- Project recordings and screenshots: `public/work/<slug>/` (see its README
  for what each file is and how to re-record)
- Résumé: the buttons link to the live Google Drive copy (`profile.resumeUrl`),
  so updating the Drive file updates the site
