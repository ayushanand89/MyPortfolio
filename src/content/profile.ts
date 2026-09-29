export const profile = {
  name: "Ayush Anand",
  firstName: "Ayush",
  lastName: "Anand",
  role: "Full-Stack Developer",
  // Editorial hero statement
  headline: "I build premium websites & full-stack products.",
  // Short hero lede - the long intro lives in metadata and the About chapter.
  lede: "Full-stack engineer shipping production web apps, AI features and interfaces people enjoy using, from idea to launch. Open to freelance projects and full-time roles.",
  intro:
    "Freelance full-stack developer. I design and build premium websites, web apps and dashboards for startups, creators and businesses, from idea to launch. Also a Software Developer at ClanFlare, where I build a Community-as-a-Service platform.",
  location: "Delhi, India",
  email: "ayushanand0108@gmail.com",
  phone: "+91 93153 35517",
  phoneHref: "tel:+919315335517",
  portfolio: "https://ayush.clanflare.dev",
  resumeUrl:
    "https://drive.google.com/file/d/1HYQ31FpLT8X-f8RsEx66P_WQXo8pVfv5/view",
  available: true,
  availabilityLabel: "Open to projects & full-time roles",
  currently: "Software Developer @ ClanFlare",
  // Hero proof line - each point is documented in Work / Track record.
  proof: [
    "3 products shipped end to end",
    "2,000+ users on my AI build",
    "Top 0.15% · TCS CodeVita",
  ],
  // About chapter - first-person manifesto (scroll-scrubbed word by word) and
  // the hairline fact-chip row beneath it.
  about: {
    manifesto:
      "I'm Ayush Anand. I design and build digital products end to end, obsessing over the details most people never notice, because that is exactly what makes software feel effortless.",
    /** Words lit in accent as the manifesto scrubs (punctuation-stripped, lowercase). */
    highlights: ["ayush", "anand", "end", "effortless"],
    facts: [
      { label: "Based in", value: "Delhi, India · IST" },
      { label: "Currently", value: "Software Developer @ ClanFlare" },
      { label: "Recognition", value: "TCS CodeVita · AIR 713" },
      { label: "Education", value: "B.Tech Computer Engineering, ’25" },
    ],
  },
  socials: {
    github: "https://github.com/ayushanand89",
    linkedin: "https://www.linkedin.com/in/ayush-anand-a91919266/",
  },
} as const;

export type Profile = typeof profile;
