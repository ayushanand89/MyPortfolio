import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Backdrop } from "@/components/backdrop";
import { ScrollProgress } from "@/components/scroll-progress";
import { Grain } from "@/components/grain";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { profile } from "@/content/profile";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Backdrop />
          <Grain />
          <ScrollProgress />
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
