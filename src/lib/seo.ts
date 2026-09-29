import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { recognition } from "@/content/recognition";
import { skillGroups } from "@/content/skills";
import type { Project } from "@/content/projects";

/**
 * Structured data (schema.org JSON-LD) as ONE connected graph: the site, the
 * person and every case study reference each other by `@id`, so search
 * engines read them as a single entity ("Ayush Anand") with a home, a job,
 * a school, profiles elsewhere and a body of work. That entity signal is
 * what helps a name query resolve to this site.
 */
const base = profile.portfolio;

export const PERSON_ID = `${base}/#person`;
export const WEBSITE_ID = `${base}/#website`;

export const SEO_TITLE = `${profile.name} | Full-Stack Engineer & Freelance Web Developer`;
export const SEO_DESCRIPTION =
  "Ayush Anand is a full-stack engineer at ClanFlare in Delhi, building production web apps, AI features and premium websites. Open to freelance and full-time roles.";

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.lastName,
  url: base,
  image: `${base}/opengraph-image`,
  email: `mailto:${profile.email}`,
  jobTitle: "Full-Stack Engineer",
  description: profile.intro,
  worksFor: {
    "@type": "Organization",
    name: "ClanFlare Solutions",
    url: "https://clanflare.dev",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  knowsAbout: skillGroups.flatMap((g) => g.items).slice(0, 24),
  award: recognition.map((r) => r.title),
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

/** Site-wide: who the site is by (every page). */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: base,
      // The "site name" Google shows above results.
      name: profile.name,
      alternateName: [`${profile.name} Portfolio`, "ayush.clanflare.dev"],
      description: SEO_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    person,
  ],
};

/** Home page: a profile page whose subject is the person. */
export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${base}/#profilepage`,
  url: base,
  name: SEO_TITLE,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
};

/** A case study: a creative work by the person, with a breadcrumb trail. */
export function caseStudyJsonLd(project: Project) {
  const url = `${base}/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.title,
        headline: project.title,
        description: project.summary,
        image: `${url}/opengraph-image`,
        dateCreated: project.year,
        keywords: project.tags.join(", "),
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        ...(project.live ? { sameAs: project.live.url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: base },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };
}

/** Serialise for a <script type="application/ld+json"> (escapes `<`). */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
