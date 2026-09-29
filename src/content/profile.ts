export const profile = {
  name: "Ayush Anand",
  firstName: "Ayush",
  lastName: "Anand",
  role: "Full-Stack Developer",
  // Editorial hero statement
  headline: "I build premium websites & full-stack products.",
  // Short hero lede - the long intro lives in metadata and the About chapter.
  lede: "Freelance full-stack developer. Websites, web apps and dashboards for startups, creators and businesses, from idea to launch.",
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
  availabilityLabel: "Open for freelance projects",
  currently: "Software Developer @ ClanFlare",
  // About chapter - first-person manifesto (scroll-scrubbed word by word) and
  // the hairline fact-chip row beneath it.
  about: {
    manifesto:
      "I'm Ayush. I design and build digital products end to end, obsessing over the details most people never notice, because that is exactly what makes software feel effortless.",
    /** Words lit in accent as the manifesto scrubs (punctuation-stripped, lowercase). */
    highlights: ["ayush", "end", "effortless"],
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
