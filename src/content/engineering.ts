/**
 * "Under the hood": engineering decisions from the real builds, written for
 * the engineers and recruiters reading the page. Every fact here is already
 * documented in the case studies or the experience record; nothing new is
 * claimed. `href` points at the evidence.
 */
export type EngineeringNote = {
  area: string;
  title: string;
  body: string;
  metric: { value: string; label: string };
  source: { label: string; href: string };
};

export const engineering: EngineeringNote[] = [
  {
    area: "Security",
    title: "Authorization lives in the database",
    body: "Row-level security on every Postgres table, and anonymous posts have their author nulled in a database view, so a real name never crosses the wire.",
    metric: { value: "17 / 17", label: "tables behind RLS" },
    source: { label: "Quit Gambling", href: "/work/quit-gambling" },
  },
  {
    area: "Payments",
    title: "Money that can't be double-spent",
    body: "Razorpay signatures are verified server-side and session credits are deducted in one atomic statement, so concurrent bookings can't oversell a slot.",
    metric: { value: "Atomic", label: "credit deduction" },
    source: { label: "Quit Gambling", href: "/work/quit-gambling" },
  },
  {
    area: "AI · Retrieval",
    title: "RAG that stays in character",
    body: "Two-tier retrieval over a creator's whole video library, with HyDE query rewriting to beat semantic dilution, and a versioned persona that holds its voice.",
    metric: { value: "~20%", label: "lower latency · 95%+ adherence" },
    source: { label: "AI Chatbot", href: "/work/enterprise-ai-chatbot" },
  },
  {
    area: "State",
    title: "2,000+ users, no crossed wires",
    body: "One Redis key per user: the app and the agent stay stateless and pass a session id, so every conversation stays isolated with sub-millisecond reads.",
    metric: { value: "2,000+", label: "isolated conversations" },
    source: { label: "AI Chatbot", href: "/work/enterprise-ai-chatbot" },
  },
  {
    area: "Reliability",
    title: "Serverless without cold-start failures",
    body: "A cached database connection awaited inside each request keeps the API reliable on Vercel. Ownership checks close IDOR holes and every write is field-whitelisted.",
    metric: { value: "1 API", label: "storefront + admin, two origins" },
    source: { label: "BareThreads", href: "/work/barethreads" },
  },
  {
    area: "Scale",
    title: "APIs under real traffic",
    body: "At ClanFlare: normalized PostgreSQL / Prisma schemas with indexed hot queries, and REST APIs on Bun and Hono serving production traffic every day.",
    metric: { value: "~40%", label: "lower latency · 10,000+ requests a day" },
    source: { label: "ClanFlare", href: "/#experience" },
  },
];
