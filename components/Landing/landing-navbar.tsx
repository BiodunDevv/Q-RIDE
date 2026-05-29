"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/Landing/data";
import { Logo } from "@/components/Landing/logo";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 10);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "border-b border-border/50 bg-background/92 shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-8">
        <Logo />

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild size="sm" variant="ghost">
            <a href="/prototype">View prototype</a>
          </Button>
          <Button asChild size="sm">
            <a href="#waitlist">
              Join waitlist
              <ArrowRight className="size-3.5" />
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-9 items-center justify-center text-foreground transition-colors hover:bg-muted/60 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border/40 bg-background/96 backdrop-blur-md md:hidden">
          <div className="container-shell space-y-1 py-4">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                {label}
              </a>
            ))}
            <div className="pt-3">
              <Button asChild className="w-full" size="sm">
                <a href="#waitlist" onClick={() => setMobileOpen(false)}>
                  Join waitlist
                  <ArrowRight className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
