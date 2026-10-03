# ayush.clanflare.dev - Portfolio

Personal portfolio of **Ayush Anand**, full-stack engineer (freelance projects
and full-time roles). An editorial "ink, paper & signal" site with case-study
pages: poster type, chapters that slide over each other as sheets, and
performance-first motion. Built to convert two audiences: clients (a project
brief) and recruiters (engineering proof, résumé quick look, a hiring door).

**Live:** https://ayush.clanflare.dev

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config`; tokens live in
  `src/app/globals.css`)
- **framer-motion**, loaded lazily (`LazyMotion` + `domMax` in
  `motion-provider.tsx`, strict mode: use `m.*`, never `motion.*`). Drives
  the swipe decks, accordions, command menu, dock and form morphs.
- **A tiny scroll engine** (`src/lib/motion.ts`): one passive scroll listener
  drives every scroll-linked effect (hero recede, manifesto, process rail,
  marquee, progress rings)
- **View Transitions API** (native): a project's screen morphs into the case
  study on navigation
- **Real sites on screen**: recordings of the live sites play in browser and
  phone frames; case studies can launch the actual site in an iframe
- **Lenis** smooth scrolling · no WebGL (transform/opacity only)

## Structure

```
src/
  app/            routes: / , /work/[slug] (+ opengraph-image), api/contact,
                  sitemap, robots, manifest, not-found
  components/     effects + primitives (Section, Reveal, SwipeDeck, …)
  components/sections/   homepage chapters in narrative order
  content/        ALL copy: profile, projects, engineering, services, faq,
                  brief, skills, …
  lib/            scroll engine, chapter scrollspy, SEO graph, hooks
```

Homepage chapters: Hero → Work (01) → Engineering (02) → About (03) →
Services (04) → Process (05) → Track record (06) → Voices → FAQ → Contact
(07). Edit copy in `src/content/*.ts`; components are presentation only.

## Features

- **Phones get a calm variant** (below `md`): type-only hero, project swipe
  deck with tabs, accordions, carousels, tabs, flat decks, an auto-hiding
  chapter dock. Desktop keeps the screening hero and a chapter rail.
- **Contact with two doors**: a project brief (type + timeline chips, live
  summary, inline validation) or a hiring form. Any CTA can pre-fill it via
  `BriefLink` (`?brief=<type|hiring>` or the `brief:open` event).
- **⌘K / Ctrl K command menu** (`command-palette.tsx`).
- **Résumé quick look** (desktop): links to `profile.resumeUrl` open the live
  Drive preview in a side sheet.
- **Share cards**: generated per case study with brand fonts (`lib/og-font.ts`).
- **SEO**: one schema.org graph in `src/lib/seo.ts` (WebSite, Person,
  ProfilePage, CreativeWork + breadcrumbs, FAQPage). Add new profiles to
  `profile.socials` so they land in `sameAs`.

## Design system

Defined in `src/app/globals.css`:

- **Surfaces**: every chapter declares `data-surface="ink" | "paper" |
  "signal"` and components read only the local tokens (`--bg`, `--fg`,
  `--muted`, `--line`, `--accent`, `--raised`). Ink `#0c0b0a`, paper
  `#efebe3`, signal red `#ff3b1f` (bright) / `#c0271a` (surface). Text that
  must be read or typed sits on paper, not on signal red.
- **Type**: Archivo (variable; display is its 125% width, all caps) with
  Instrument Serif italic `<em>` inside any `.display` headline, and
  JetBrains Mono for data labels. Cap large type with `min()`
  (e.g. `text-[min(6vw,6rem)]`), not `min-[1600px]:`.
- **Motion**: masked line rise, media "window" reveal, staggered entrances
  (`[data-reveal]`, one IntersectionObserver in `scroll-reveal.tsx`),
  odometer stats, sheet slide-overs. Content is visible by default;
  `prefers-reduced-motion` disables the intro, transitions, smooth scroll and
  scrubbed effects.
- **Copy**: no em dashes anywhere; use a colon, comma, full stop or `·`
  (en dash only for ranges).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes (form falls back to `mailto:` without it) | Contact form via [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | no (default: profile email) | Where briefs land |
| `CONTACT_FROM_EMAIL` | no (default: `Portfolio <onboarding@resend.dev>`) | Sender |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | no | Search Console HTML-tag verification |

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
  for each file and how to re-record). Changed media always gets a new
  filename, since image and CDN caches are keyed by URL.
- Mobile captures need a `tint` (their top-edge colour) in `projects.ts` for
  the phone frame's status bar.
- Résumé: always the live Google Drive copy (`profile.resumeUrl`), so updating
  the Drive file updates the site.
