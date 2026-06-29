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
  "Ayush Anand is a full-stack software developer building products end to end — security-first data layers, race-proof payments, and production AI agents. Currently at ClanFlare.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ayushanand.dev"),
  title: {
    default: "Ayush Anand — Software Developer",
    template: "%s — Ayush Anand",
  },
  description,
  keywords: [
    "Ayush Anand",
    "Software Developer",
    "Full-stack Developer",
    "Next.js",
    "TypeScript",
    "RAG",
    "PostgreSQL",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: "Ayush Anand — Software Developer",
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Anand — Software Developer",
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
          defaultTheme="dark"
          enableSystem
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
