import { ImageResponse } from "next/og";
import { caseStudySlugs, flagshipProjects, getProject } from "@/content/projects";
import { brandFonts } from "@/lib/og-font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study by Ayush Anand";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

/**
 * The share card for a case study (LinkedIn, Slack, WhatsApp, X): the
 * project's name, its one-line pitch and its headline numbers, in the site's
 * ink / signal look. Rendered at build time for every case study.
 */
export default async function CaseStudyImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const index = flagshipProjects.findIndex((p) => p.slug === slug);
  const pad = (n: number) => String(n).padStart(2, "0");
  const title = project?.title ?? "Case study";
  const stats = (project?.cardStats ?? project?.stats ?? []).slice(0, 3);
  const titleSize = title.length > 22 ? 76 : 108;
  const statText = stats.map((s) => s.value).join("");
  const topLeft = `${index >= 0 ? `Case study ${pad(index + 1)}/${pad(flagshipProjects.length)}` : "Case study"}${project?.domain ? ` · ${project.domain.split(" · ")[0]}` : ""}`;
  const labelText = [topLeft, "Ayush Anand", ...stats.map((s) => s.label)].join(" ").toUpperCase();
  const { fonts, hasDisplay, hasSerif } = await brandFonts(
    `${title.toUpperCase()}${statText}`,
    project?.tagline ?? "",
    labelText,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0b0a",
          color: "#efebe3",
          padding: "56px 72px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#9d978b",
            borderTop: "1px solid #3a3731",
            paddingTop: 18,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff3b1f" }} />
            {topLeft}
          </span>
          <span>Ayush Anand</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 900,
              fontFamily: hasDisplay ? "Archivo" : undefined,
              lineHeight: 0.92,
              letterSpacing: hasDisplay ? -1 : -3,
              textTransform: "uppercase",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {project?.tagline && (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: hasSerif ? 42 : 34,
                fontFamily: hasSerif ? "Instrument Serif" : undefined,
                fontStyle: hasSerif ? "italic" : "normal",
                color: "#9d978b",
                maxWidth: 1000,
              }}
            >
              {project.tagline}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              gap: 64,
              borderTop: "1px solid #3a3731",
              paddingTop: 22,
              paddingBottom: 30,
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 900,
                    fontFamily: hasDisplay ? "Archivo" : undefined,
                    color: "#ff3b1f",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#9d978b",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", height: 18, background: "#ff3b1f", margin: "0 -72px" }} />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
