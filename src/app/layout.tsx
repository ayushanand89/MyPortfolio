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
import { SEO_DESCRIPTION, SEO_TITLE, jsonLd, siteJsonLd } from "@/lib/seo";

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

const title = SEO_TITLE;
const description = SEO_DESCRIPTION;
// Search Console HTML-tag verification (optional; DNS verification of the
// clanflare.dev domain covers this subdomain without it).
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(profile.portfolio),
  title: {
    default: title,
    template: "%s | Ayush Anand",
  },
  description,
  applicationName: profile.name,
  keywords: [
    "Ayush Anand",
    "Ayush Anand developer",
    "Ayush Anand portfolio",
    "Full-Stack Engineer",
    "Full-Stack Developer Delhi",
    "Freelance Web Developer",
    "Next.js Developer",
    "React Developer",
    "Hire web developer",
  ],
  authors: [{ name: profile.name, url: profile.portfolio }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: "ayushanand89",
    url: profile.portfolio,
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
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
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
          dangerouslySetInnerHTML={{ __html: jsonLd(siteJsonLd) }}
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
