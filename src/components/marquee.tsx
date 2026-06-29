"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const items = [
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "Supabase",
  "Bun",
  "Hono",
  "RAG",
  "Pinecone",
  "Cohere",
  "Redis",
  "n8n",
  "Razorpay",
  "Prisma",
  "WebSockets",
];

export function Marquee() {
  const sequence = [...items, ...items];
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(
    useTransform(velocity, [-2500, 0, 2500], [7, 0, -7], { clamp: true }),
    { stiffness: 200, damping: 40 },
  );

  return (
    <div className="relative overflow-hidden border-y border-border py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div style={reduce ? undefined : { skewX: skew }}>
        <div className="marquee-track">
          {sequence.map((item, i) => (
            <span
              key={i}
              className="flex items-center whitespace-nowrap font-display text-2xl text-faint sm:text-3xl"
            >
              {item}
              <span className="mx-8 text-accent/50">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
