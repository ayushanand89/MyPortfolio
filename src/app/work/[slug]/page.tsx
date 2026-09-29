import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  caseStudySlugs,
  flagshipProjects,
  getProject,
} from "@/content/projects";
import {
  CaseStudyBody,
  CaseStudyHero,
  NextProject,
} from "@/components/case-study";
import { CaseStudyCta } from "@/components/case-study-cta";
import { ReadingProgress } from "@/components/reading-progress";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.hasCaseStudy) {
    notFound();
  }

  // Sequential next flagship, wrapping around.
  const total = flagshipProjects.length;
  const currentIndex = flagshipProjects.findIndex((p) => p.slug === slug);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % total : 0;
  const next = flagshipProjects[nextIndex];

  return (
    <main id="main">
      <ReadingProgress />
      <div data-surface="paper">
        <CaseStudyHero project={project} index={Math.max(0, currentIndex)} total={total} />
        {project.blocks && (
          <CaseStudyBody blocks={project.blocks} project={project} />
        )}
      </div>
      <CaseStudyCta project={project} />
      {next && next.slug !== slug && (
        <NextProject project={next} index={nextIndex} total={total} />
      )}
    </main>
  );
}
