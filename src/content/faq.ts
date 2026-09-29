/**
 * Straight answers for both audiences: clients (cost, time, ownership) and
 * recruiters (roles, stack). Commitments are limited to the ones Ayush
 * confirmed: 24-hour replies, a fixed quote before work, code ownership and
 * support after launch.
 */
export const faq: { q: string; a: string }[] = [
  {
    q: "How much does a project cost?",
    a: "It depends on scope, so there's no one-size price list. Tell me what you're building and you'll get a fixed quote, agreed before any work starts. No hourly surprises.",
  },
  {
    q: "How long will it take?",
    a: "That depends on scope too: a focused landing page ships far sooner than a product with auth, payments and an admin suite. Your quote comes with a timeline, so you know when each part lands.",
  },
  {
    q: "Do you design, or only develop?",
    a: "Both. I design the UX and UI and build it end to end; every project on this page was designed and built by me. If you already have designs, I'll build them faithfully.",
  },
  {
    q: "Who owns the code, and what happens after launch?",
    a: "You do. You get the full source code, with no lock-in, and I stay on after launch for fixes and support.",
  },
  {
    q: "Are you open to full-time roles?",
    a: "Yes. Alongside freelance work I'm open to full-time engineering roles. My résumé is always the live, up-to-date copy, and I reply to every message within 24 hours.",
  },
  {
    q: "What's your stack?",
    a: "Mostly TypeScript: Next.js and React on the front, Node or Bun with PostgreSQL or MongoDB behind it, and RAG pipelines when AI is involved. I choose tools for the access pattern, not by habit.",
  },
];
