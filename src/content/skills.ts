export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["C++", "TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Redux",
      "Zustand",
      "TanStack Query",
    ],
  },
  {
    label: "Backend & Cloud",
    items: [
      "Node.js",
      "Bun",
      "Hono",
      "REST APIs",
      "WebSockets",
      "AWS S3",
      "GCP",
      "Vercel",
      "Razorpay",
    ],
  },
  {
    label: "Data & AI",
    items: [
      "PostgreSQL",
      "Supabase (RLS)",
      "MongoDB",
      "Redis",
      "Prisma",
      "Upstash Vector",
      "Pinecone",
      "Cohere",
      "RAG Pipelines",
      "Embeddings",
      "n8n",
    ],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "Docker", "Postman", "Cloudinary", "Linux"],
  },
];
