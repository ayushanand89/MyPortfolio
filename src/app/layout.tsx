import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Backdrop } from "@/components/backdrop";
import { Aurora } from "@/components/aurora";
import { Particles } from "@/components/particles";
import { Intro } from "@/components/intro";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Grain } from "@/components/grain";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { profile } from "@/content/profile";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Cabinet Grotesk (Indian Type Foundry, via Fontshare) — self-hosted for the
// display/headline face. Gives the editorial headlines real character where
// Inter Tight read generic.
const display = localFont({
  src: [
    { path: "../fonts/cabinet-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cabinet-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cabinet-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cabinet-800.woff2", weight: "800", style: "normal" },
    { path: "../fonts/cabinet-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Ayush Anand — full-stack & freelance web developer. I design and build premium websites, web apps, dashboards and full-stack products for startups, creators and businesses. Available for freelance projects.";

const title = "Ayush Anand — Full-Stack & Freelance Web Developer";

export const metadata: Metadata = {
  metadataBase: new URL("https://ayush.clanflare.dev"),
  title: {
    default: title,
    template: "%s — Ayush Anand",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Before first paint: opt browsers WITHOUT native scroll-driven CSS
            animations (Safari, Firefox) into the JS reveal fallback. Runs only
            when the feature is unsupported, IntersectionObserver exists, and the
            user hasn't asked for reduced motion — so no-JS, reduced-motion, and
            Chromium users keep the visible-by-default content untouched, with no
            flash. `ScrollReveal` reads this class and drives the reveals. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var s=window.CSS&&CSS.supports&&CSS.supports("animation-timeline: view()");if(!r&&!s&&"IntersectionObserver" in window){document.documentElement.classList.add("reveal-js")}}catch(e){}})();',
          }}
        />
        <Intro />
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Aurora />
          <Particles />
          <Backdrop />
          <Grain />
          <ScrollProgress />
          <ScrollReveal />
          <SmoothScroll>
            <div className="relative z-10">
              <Nav />
              {children}
              <Footer />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
