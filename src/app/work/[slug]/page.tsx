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

  const next =
    flagshipProjects.find((p) => p.slug !== slug) ?? flagshipProjects[0];

  return (
    <main>
      <CaseStudyHero project={project} />
      {project.blocks && <CaseStudyBody blocks={project.blocks} />}
      {next && next.slug !== slug && <NextProject project={next} />}
    </main>
  );
}
