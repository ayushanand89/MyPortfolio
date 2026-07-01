"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { smoothScrollToHash } from "@/lib/scroll";
import { Magnetic } from "@/components/motion-fx";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight the nav link for the section currently in view.
  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive("");
      return;
    }
    const ids = links.map((l) => l.href.replace("/#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const handleAnchor = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    // Smooth in-page scroll when we're already on home (works with or without Lenis).
    if (href.startsWith("/#") && pathname === "/") {
      const hash = href.slice(1);
      if (document.querySelector(hash)) {
        e.preventDefault();
        smoothScrollToHash(hash, lenis);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out-strong",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          {profile.name}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) => {
              const isActive = active === link.href.replace("/#", "");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "link-underline relative text-sm transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <span className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-accent" />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Magnetic strength={0.4}>
            <Link
              href="/#contact"
              onClick={(e) => handleAnchor(e, "/#contact")}
              className="inline-flex rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out-strong hover:opacity-90 active:scale-[0.98]"
            >
              Work with me
            </Link>
          </Magnetic>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4 sm:px-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className="block py-3 text-lg text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/#contact"
                onClick={(e) => handleAnchor(e, "/#contact")}
                className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
              >
                Work with me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
