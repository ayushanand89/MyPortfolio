import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/content/projects";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.portfolio;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...caseStudySlugs.map((slug) => ({
      url: `${base}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
