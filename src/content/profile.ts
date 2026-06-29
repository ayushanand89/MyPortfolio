export const profile = {
  name: "Ayush Anand",
  firstName: "Ayush",
  lastName: "Anand",
  role: "Software Developer",
  // Editorial hero statement
  headline: "I build products end to end.",
  intro:
    "Full-stack developer focused on the parts that have to be right — normalized Postgres schemas, race-proof payments, security at the data layer, and AI agents that actually sound human. Currently building a Community-as-a-Service platform at ClanFlare.",
  location: "Delhi, India",
  email: "ayushanand0108@gmail.com",
  phone: "+91 93153 35517",
  phoneHref: "tel:+919315335517",
  resumeUrl:
    "https://drive.google.com/file/d/1HYQ31FpLT8X-f8RsEx66P_WQXo8pVfv5/view",
  available: true,
  socials: {
    github: "https://github.com/ayushanand89",
    linkedin: "https://www.linkedin.com/in/ayush-anand-a91919266/",
  },
} as const;

export type Profile = typeof profile;
