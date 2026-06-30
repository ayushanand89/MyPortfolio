export const profile = {
  name: "Ayush Anand",
  firstName: "Ayush",
  lastName: "Anand",
  role: "Full-Stack Developer",
  // Editorial hero statement
  headline: "I build premium websites & full-stack products.",
  intro:
    "Freelance full-stack developer. I design and build premium websites, web apps and dashboards — from idea to launch — for startups, creators and businesses. Also a Software Developer at ClanFlare, where I build a Community-as-a-Service platform.",
  location: "Delhi, India",
  email: "ayushanand0108@gmail.com",
  phone: "+91 93153 35517",
  phoneHref: "tel:+919315335517",
  portfolio: "https://ayush.clanflare.dev",
  resumeUrl:
    "https://drive.google.com/file/d/1HYQ31FpLT8X-f8RsEx66P_WQXo8pVfv5/view",
  available: true,
  // Hero trust badges
  badges: [
    "Freelance projects delivered",
    "Full-stack, end to end",
    "Fast · responsive · scalable",
  ],
  socials: {
    github: "https://github.com/ayushanand89",
    linkedin: "https://www.linkedin.com/in/ayush-anand-a91919266/",
  },
} as const;

export type Profile = typeof profile;
