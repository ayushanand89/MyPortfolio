/* ---------------------------------------------------------------------------
   Project + case-study content model.
   Flagship projects carry a `blocks` array that the case-study page renders.
   Screenshots are referenced by path under /public/work/<slug>/ — drop the real
   exported images there; until then ImageBlock renders a labelled placeholder.
--------------------------------------------------------------------------- */

export type Stat = { value: string; label: string };

export type CaseStudyBlock =
  | { type: "section"; eyebrow?: string; title: string; body?: string }
  | { type: "text"; body: string }
  | { type: "image"; src?: string; alt: string; caption?: string }
  | { type: "stats"; items: Stat[] }
  | {
      type: "features";
      eyebrow?: string;
      title?: string;
      items: { title: string; body: string }[];
    }
  | { type: "stack"; items: { name: string; why: string }[] }
  | { type: "quote"; text: string };

export type ProjectLinks = {
  demo?: string;
  github?: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  year: string;
  role?: string;
  association?: string;
  category: "flagship" | "secondary";
  tags: string[];
  image?: string;
  links: ProjectLinks;
  hasCaseStudy: boolean;
  // case-study-only fields
  cover?: { eyebrow: string; title: string; subtitle: string };
  stats?: Stat[];
  blocks?: CaseStudyBlock[];
};

export const projects: Project[] = [
  {
    slug: "sukh-sadam",
    title: "Sukh Sadam",
    tagline: "A full-stack recovery platform for gambling addiction.",
    summary:
      "A two-sided product — a patient app for recovery and a counselor workspace for care — sharing one security-first data model. Bookings, payments, recovery tools, and an anonymous community, designed and built end to end.",
    year: "2026",
    role: "Designed & built end to end",
    category: "flagship",
    tags: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Razorpay", "Tailwind"],
    image: "/work/sukh-sadam/cover.jpg",
    links: {},
    hasCaseStudy: true,
    cover: {
      eyebrow: "Case study — designed & built end to end",
      title: "Sukh Sadam",
      subtitle:
        "A full-stack recovery platform for gambling addiction. Bookings · payments · recovery tools · an anonymous community.",
    },
    stats: [
      { value: "30+", label: "App routes" },
      { value: "17", label: "PostgreSQL tables" },
      { value: "2 sides", label: "Patient + counselor" },
      { value: "RLS", label: "On every table" },
    ],
    blocks: [
      {
        type: "section",
        eyebrow: "The problem",
        title: "Recovery is hard. Doing it alone is harder.",
        body: "Gambling addiction is isolating and stigmatised — people need a private way to find help, track progress, and reach someone at 2am. So I built one, end to end.",
      },
      {
        type: "section",
        eyebrow: "The product",
        title: "One platform, two sides.",
        body: "A patient app for recovery, and a counselor workspace for care — sharing one secure data model.",
      },
      {
        type: "image",
        src: "/work/sukh-sadam/landing.jpg",
        alt: "Sukh Sadam landing page",
        caption: "Landing — verified counselors, private recovery tools, a community that's been there.",
      },
      {
        type: "features",
        eyebrow: "Patient app",
        title: "Recovery, one day at a time.",
        items: [
          {
            title: "A daily home base",
            body: "Current streak, an honest \"did you slip?\" check-in, mood, and your next session.",
          },
          {
            title: "Progress you can see",
            body: "Sobriety streaks, mood trends over time, and milestone badges that make the work visible.",
          },
          {
            title: "Find the right counselor",
            body: "Verified specialists, filterable by city, language and specialty, with live ratings computed from real reviews.",
          },
          {
            title: "Book in two taps",
            body: "Real-time availability paid from a prepaid session wallet — credits deducted atomically, so a slot can never be oversold.",
          },
          {
            title: "A community that's been there",
            body: "Post openly or fully anonymous — author identity is stripped at the database, not just hidden in the UI.",
          },
          {
            title: "A journal that's just yours",
            body: "Private and visible only to you — a safe place to write through the hard days. Plus an SOS mode for the hardest moments.",
          },
        ],
      },
      {
        type: "image",
        src: "/work/sukh-sadam/dashboard.jpg",
        alt: "Patient recovery dashboard",
        caption: "Patient home — streak, daily check-in, mood, and next session at a glance.",
      },
      {
        type: "features",
        eyebrow: "Counselor side",
        title: "A workspace for counselors.",
        items: [
          {
            title: "Everything at a glance",
            body: "Today's schedule, weekly load, total sessions, live rating and recent reviews.",
          },
          {
            title: "Scoped to their clients",
            body: "A patient's intake, streaks and moods — and only for clients who booked them. Scoping is enforced by the database itself.",
          },
        ],
      },
      {
        type: "features",
        eyebrow: "Under the hood",
        title: "Correctness lives in the database.",
        items: [
          {
            title: "Authorization → Row-Level Security",
            body: "Every query is constrained to the caller's own data in Postgres. Identity comes from the verified session, never the client.",
          },
          {
            title: "Payments → atomic + signed",
            body: "Razorpay signatures verified server-side; session credits deducted in one atomic statement, so concurrency can't oversell.",
          },
          {
            title: "Privacy → enforced at serialization",
            body: "Anonymous posts have their author nulled in a database view — the real name never crosses the wire.",
          },
          {
            title: "Consistency → one source of truth",
            body: "Streaks and ratings are computed once and reused, so no two screens disagree.",
          },
        ],
      },
      {
        type: "stack",
        items: [
          {
            name: "Next.js 16 · React 19",
            why: "App Router + Server Components keep data access and secrets on the server.",
          },
          {
            name: "Supabase · PostgreSQL",
            why: "Authorization (RLS), auth, and money (transactions) in one trustworthy place.",
          },
          {
            name: "Razorpay",
            why: "India-first UPI payments with server-verifiable signatures.",
          },
          {
            name: "TypeScript · Tailwind · Resend",
            why: "Explicit contracts end-to-end, a consistent design system, and transactional email.",
          },
        ],
      },
    ],
  },
  {
    slug: "enterprise-ai-chatbot",
    title: "Enterprise AI Persona Chatbot",
    tagline: "A production RAG agent that talks like a real creator.",
    summary:
      "A persona AI with a versioned personality, a knowledge base built from a creator's entire video library, and live alerts that can overrule the model. Built for a client — names, branding and screenshots anonymized; the engineering is real.",
    year: "2026",
    role: "Designed & built end to end",
    association: "Associated with ClanFlare",
    category: "flagship",
    tags: ["Next.js", "n8n", "RAG", "Pinecone", "Cohere", "Upstash", "Redis"],
    image: "/work/enterprise-ai-chatbot/cover.jpg",
    links: {},
    hasCaseStudy: true,
    cover: {
      eyebrow: "Case study — built for a client · anonymized",
      title: "An AI that talks like a real creator.",
      subtitle:
        "A production RAG agent with a versioned personality, a knowledge base from his whole video library, and live alerts that can overrule the model.",
    },
    stats: [
      { value: "95%+", label: "Persona adherence" },
      { value: "~20%", label: "Lower latency" },
      { value: "2,000+", label: "Users" },
      { value: "50+ hrs", label: "Media indexed" },
    ],
    blocks: [
      {
        type: "section",
        eyebrow: "The goal",
        title: "Not a FAQ bot with his face on it.",
        body: "His audience should talk to it like it's him — and not be able to tell the difference.",
      },
      {
        type: "features",
        eyebrow: "The shape of it",
        title: "One product, two minds.",
        items: [
          {
            title: "A thin interface",
            body: "A Next.js chat UI — render the answer, embed the source clip, stay out of the way.",
          },
          {
            title: "A separate brain",
            body: "An n8n agent that retrieves, wears the persona, calls the model, and enforces alerts — the whole agent lives behind one webhook.",
          },
          {
            title: "Purpose-built memory",
            body: "Two vector stores + Redis, each chosen for a specific access pattern, not by reflex.",
          },
        ],
      },
      {
        type: "image",
        src: "/work/enterprise-ai-chatbot/chat.jpg",
        alt: "Chat interface answering in the creator's voice",
        caption: "Answers in his voice — short, blunt, Hinglish — and it cites the exact clip it's drawing from.",
      },
      {
        type: "section",
        eyebrow: "Live alerts",
        title: "Where a human sets the truth.",
        body: "An admin posts a market alert; the agent treats it as reality and overrules its own take. Stale-but-confident is the enemy — a fresh, human-posted alert beats the model's own opinion.",
      },
      {
        type: "image",
        src: "/work/enterprise-ai-chatbot/architecture.jpg",
        alt: "System architecture diagram",
        caption: "Interface separated from intelligence: Next.js → n8n agent → OpenRouter, with a two-tier retrieval layer.",
      },
      {
        type: "features",
        eyebrow: "Persona engineering",
        title: "A system prompt, eleven times over.",
        items: [
          {
            title: "Brevity over essays",
            body: "2–4 sentences, no lists. Real traders are blunt.",
          },
          {
            title: "A noise filter",
            body: "Off-topic questions get an in-character brush-off, not a tutorial.",
          },
          {
            title: "Tone modulation",
            body: "Patient teacher for learners; firm only with shortcut-seekers — tuned to 95% adherence.",
          },
        ],
      },
      {
        type: "features",
        eyebrow: "Decisions, not defaults",
        title: "Why it's built this way.",
        items: [
          {
            title: "Two-tier retrieval",
            body: "Upstash Vector for the knowledge base; Pinecone + Cohere for time-sensitive alerts. HyDE query rewriting cut latency ~20%.",
          },
          {
            title: "Alert override",
            body: "A fresh, human-posted alert beats the model's own opinion, with an expiry so it can't go stale.",
          },
          {
            title: "Redis sessions",
            body: "Per-user state, isolated — 2,000+ conversations that never cross wires, with sub-millisecond reads.",
          },
        ],
      },
      {
        type: "stack",
        items: [
          {
            name: "Next.js 16 · React 19",
            why: "Server components keep secrets and data access on the server.",
          },
          {
            name: "n8n · OpenRouter",
            why: "Visual orchestration; model-agnostic LLM access you can swap without a deploy.",
          },
          {
            name: "Upstash Vector · Pinecone · Cohere",
            why: "Two-tier RAG, each path tuned for its job.",
          },
          {
            name: "Upstash Redis",
            why: "Hot, ephemeral, per-user state.",
          },
        ],
      },
    ],
  },
  {
    slug: "barethreads",
    title: "BareThreads",
    tagline: "A full-stack fashion e-commerce platform — built end to end.",
    summary:
      "A polished storefront for shoppers and an admin suite for the team, sharing one secure serverless REST API. Filterable catalog, guest→user carts, PayPal checkout, Google sign-in, and an admin dashboard — designed and engineered end to end.",
    year: "2024",
    role: "Designed & built end to end",
    category: "flagship",
    tags: ["React 19", "Redux Toolkit", "Express", "MongoDB", "PayPal", "Vercel"],
    image: "/work/barethreads/cover.jpg",
    links: {
      demo: "https://barethreads.vercel.app",
      github: "https://github.com/ayushanand89/BareThreads",
    },
    hasCaseStudy: true,
    cover: {
      eyebrow: "Case study — designed & built end to end",
      title: "BareThreads",
      subtitle:
        "A full-stack fashion e-commerce platform — a React storefront and admin suite on a secure, serverless Express/MongoDB API.",
    },
    stats: [
      { value: "2 sides", label: "Storefront + admin" },
      { value: "40+", label: "Products" },
      { value: "9", label: "Redux slices" },
      { value: "REST", label: "API · two origins" },
    ],
    blocks: [
      {
        type: "section",
        eyebrow: "The problem",
        title: "Anyone can list products. Few feel like a brand.",
        body: "I set out to build a real online store — premium on the surface, secure and correct underneath. So I designed and engineered the whole thing, end to end.",
      },
      {
        type: "section",
        eyebrow: "The product",
        title: "One platform, two sides.",
        body: "A polished storefront for shoppers and an admin suite for the team — sharing one secure REST API.",
      },
      {
        type: "image",
        src: "/work/barethreads/storefront.jpg",
        alt: "BareThreads storefront collection page",
        caption:
          "Shop the edit — a filterable catalog by category, gender, size, colour, brand and price, with live sort and removable filter chips.",
      },
      {
        type: "features",
        eyebrow: "Storefront",
        title: "Built to convert.",
        items: [
          {
            title: "Product pages that sell",
            body: "Cursor-following magnifier zoom, a thumbnail gallery, size & colour pickers, discount pricing and “complete the look”.",
          },
          {
            title: "Cart to checkout",
            body: "Build a cart as a guest, then merge it on sign-in. Stock-validated quantities and PayPal checkout through to order confirmation.",
          },
          {
            title: "Ratings & reviews",
            body: "Customers rate and review; product averages are computed server-side with an aggregation, so every screen agrees.",
          },
          {
            title: "Sign in, your way",
            body: "Email & password or Continue with Google — both verified server-side, issuing the same secure session.",
          },
        ],
      },
      {
        type: "image",
        src: "/work/barethreads/product.jpg",
        alt: "BareThreads product detail page",
        caption:
          "A product page with magnifier zoom, gallery, size/colour pickers and a server-computed rating.",
      },
      {
        type: "features",
        eyebrow: "Admin suite",
        title: "Run the store.",
        items: [
          {
            title: "Full CRUD, role-gated",
            body: "Manage products, orders and users behind admin-only routes — every write field-whitelisted on the server.",
          },
          {
            title: "At a glance",
            body: "Revenue, total orders and product counts, with recent-order status from Processing through to Delivered.",
          },
        ],
      },
      {
        type: "image",
        src: "/work/barethreads/admin.jpg",
        alt: "BareThreads admin dashboard",
        caption:
          "The admin dashboard — products, orders and users, all behind role-gated, admin-only routes.",
      },
      {
        type: "features",
        eyebrow: "Under the hood",
        title: "Secure & serverless.",
        items: [
          {
            title: "Serverless-safe data layer",
            body: "A cached Mongoose connection is awaited inside each request, so the API connects reliably on Vercel's serverless runtime — fixing the cold-start failures that kill fire-and-forget connects.",
          },
          {
            title: "Auth, two ways",
            body: "JWT in cross-site httpOnly cookies, plus Google sign-in verified server-side from an ID token — both issue the same session.",
          },
          {
            title: "Authorization at the controller",
            body: "Ownership checks scope every order and checkout to its owner; admin routes are gated. IDOR holes closed, writes field-whitelisted.",
          },
          {
            title: "Correct commerce",
            body: "Guest→user cart merge, server-computed ratings, discount pricing and stock validation — behind a consistent JSON error contract.",
          },
        ],
      },
      {
        type: "stack",
        items: [
          {
            name: "React 19 · Vite · Redux Toolkit",
            why: "A fast SPA with predictable state across 9 slices and clean async data flows.",
          },
          {
            name: "Tailwind v4 · Framer Motion",
            why: "A token-based design system with parallax, scroll-reveal motion and 3D product cards.",
          },
          {
            name: "Express 5 · MongoDB (Mongoose)",
            why: "A REST API with a resilient, serverless-safe data layer and a global error handler.",
          },
          {
            name: "JWT · Google OAuth · PayPal · Cloudinary · Vercel",
            why: "Secure auth, payments, media and serverless hosting across two deployments.",
          },
        ],
      },
    ],
  },
  {
    slug: "talksphere",
    title: "TalkSphere",
    tagline: "Real-time chat and peer-to-peer video calling.",
    summary:
      "Seamless messaging, group chats and secure peer-to-peer video built with Socket.IO and WebRTC, with TanStack Query and Zustand on the client.",
    year: "2024",
    category: "secondary",
    tags: ["React", "Socket.IO", "WebRTC", "Express", "MongoDB"],
    image: "/projects/TalkSphere.png",
    links: {
      demo: "https://talksphere-lck2.onrender.com/",
      github: "https://github.com/ayushanand89/TalkSphere",
    },
    hasCaseStudy: false,
  },
];

export const flagshipProjects = projects.filter((p) => p.category === "flagship");
export const secondaryProjects = projects.filter((p) => p.category === "secondary");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * All images associated with a project — the cover first, then every image
 * used in its case study. Powers the hover carousel on project cards.
 */
export function projectImages(p: Project): string[] {
  const fromBlocks = (p.blocks ?? [])
    .filter(
      (b): b is Extract<CaseStudyBlock, { type: "image" }> => b.type === "image",
    )
    .map((b) => b.src);
  return [p.image, ...fromBlocks].filter((s): s is string => Boolean(s));
}

export const caseStudySlugs = projects
  .filter((p) => p.hasCaseStudy)
  .map((p) => p.slug);
