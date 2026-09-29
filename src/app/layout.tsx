import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Intro } from "@/components/intro";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RouteTransitions } from "@/components/transition-link";
import { CursorLabel } from "@/components/cursor-label";
import { Grain } from "@/components/grain";
import { Nav } from "@/components/nav";
import { ChapterDock, ChapterRail } from "@/components/chapter-nav";
import { MotionProvider } from "@/components/motion-provider";
import { CommandPalette } from "@/components/command-palette";
import { ResumeQuickLook } from "@/components/resume-quicklook";
import { ConsoleSignature } from "@/components/console-signature";
import { Footer } from "@/components/footer";
import { profile } from "@/content/profile";

// Archivo carries the whole voice: body at its normal width, and the
// poster headlines pushed to the widest cut of its `wdth` axis.
const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

// Instrument Serif - the italic interjections inside the caps headlines.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Ayush Anand, full-stack & freelance web developer. I design and build premium websites, web apps, dashboards and full-stack products for startups, creators and businesses. Open to freelance projects and full-time roles.";

const title = "Ayush Anand | Full-Stack & Freelance Web Developer";

export const metadata: Metadata = {
  metadataBase: new URL("https://ayush.clanflare.dev"),
  title: {
    default: title,
    template: "%s | Ayush Anand",
  },
  description,
  keywords: [
    "Ayush Anand",
    "Full-Stack Developer",
    "Freelance Web Developer",
    "Portfolio Website Developer",
    "React Developer",
    "Next.js Developer",
    "Website Designer and Developer",
    "Full-Stack Web Apps",
    "Hire web developer",
  ],
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://ayush.clanflare.dev",
    title,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
};

// Person structured data - the highest-leverage SEO markup for a personal
// brand site (name/role/profiles surface in rich results).
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.portfolio,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: "ClanFlare Solutions" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

// Runs before first paint. When motion is allowed:
//  • `data-reveal-js` hides [data-reveal] blocks until ScrollReveal marks them
//    in view - with a failsafe that un-hides everything if the observer never
//    boots (it flips the value to "ready"), so a JS failure can't blank the
//    page.
//  • `data-intro="play"` shows the curtain on the first homepage load of a
//    browser session only; reloads and later visits land straight on the hero.
// State lives in data attributes (not classes) so React never rewrites it.
// No-JS and reduced-motion users get neither: everything is simply visible.
const prePaint = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;d.dataset.revealJs="1";setTimeout(function(){if(d.dataset.revealJs!=="ready")delete d.dataset.revealJs},4500);var seen=true;try{seen=sessionStorage.getItem("aa:intro")==="1";sessionStorage.setItem("aa:intro","1")}catch(e){}if(!seen&&location.pathname==="/"){d.dataset.intro="play";setTimeout(function(){delete d.dataset.intro},4200)}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-paper px-4 py-2 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Intro />
        <SmoothScroll>
          <MotionProvider>
            <RouteTransitions />
            <ScrollReveal />
            <CursorLabel />
            <Grain />
            <Nav />
            <ChapterRail />
            <ChapterDock />
            <CommandPalette />
            <ResumeQuickLook />
            <ConsoleSignature />
            {/* Pages scroll up and away over the sticky footer beneath. */}
            <div className="relative z-[1] bg-ink">
              {children}
              <div id="page-end" aria-hidden className="h-px" />
            </div>
            <Footer />
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
