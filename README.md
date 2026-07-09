# ayush.clanflare.dev — Portfolio

Personal portfolio of **Ayush Anand** — full-stack & freelance web developer.
A dark, editorial single-page site with case-study pages, built for
Apple/Linear-level polish with performance-first animation.

**Live:** https://ayush.clanflare.dev

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config — no `tailwind.config`; tokens live in
  `src/app/globals.css`)
- **framer-motion** (continuous/velocity effects) + native CSS
  `animation-timeline: view()` scroll reveals with an IntersectionObserver
  fallback for Safari/Firefox
- **Lenis** smooth scrolling
- **react-three-fiber / drei** — WebGL backdrop blob + cursor-reactive hero
  knot (desktop only; the two canvases never animate at the same time)

## Structure

```
src/
  app/            routes: / , /work/[slug] , api/contact , sitemap , robots
  components/     effects + primitives (Section, Reveal, MediaFrame, …)
  components/sections/   homepage chapters in narrative order
  content/        ALL copy — profile, projects, services, skills, …
  fonts/          self-hosted Cabinet Grotesk (display face)
```

The homepage reads as numbered chapters: Hero → About (01) → Selected work
(02) → Services (03) → Process (04) → Track record (05) → Voices → Contact
(06). Edit copy in `src/content/*.ts` — components are presentation only.

## Design system

Defined in `src/app/globals.css`:

- Palette: near-black `#0e0f0d`, off-white `#ecebe4`, one signature accent
  `--accent: #7cc8a2` (change it to re-skin the whole site).
- Type: Cabinet Grotesk (display), Inter (body), JetBrains Mono (eyebrows).
- Motion: custom easing tokens; **content is visible by default** — reveals
  are progressive enhancement; `prefers-reduced-motion` and
  `prefers-reduced-transparency` are fully honoured.

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

- Case-study screenshots: `public/work/<slug>/` (see its README)
