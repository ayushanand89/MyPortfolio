export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  url?: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Developer",
    company: "ClanFlare Solutions",
    location: "Remote",
    period: "Jan 2025 — Present",
    summary:
      "Building the core of an early-stage “Community-as-a-Service” platform — video hosting, subscriptions, and real-time community in Next.js, TypeScript and Bun.",
    highlights: [
      "Architected core platform features (video hosting, subscriptions, real-time community) in Next.js, TypeScript and Bun.",
      "Designed normalized PostgreSQL/Prisma schemas and indexed hot queries, cutting key-endpoint latency ~40%.",
      "Developed REST APIs with Bun and Hono serving 10,000+ daily requests with low overhead.",
      "Orchestrated AWS S3 / GCP media pipelines and Auth.js / OAuth flows with Zustand + TanStack Query.",
      "Applied SSR/SSG in Next.js to improve SEO and initial page-load performance.",
    ],
  },
];
