import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { navLinks } from "@/components/Landing/data";

export function LandingFooter() {
  return (
    <footer className="bg-primary">
      <div className="container-shell py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image src="/logoWhite.svg" alt="QRide" width={24} height={24} className="size-6" />
            <span className="text-base font-extrabold text-primary-foreground">QRide</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright + CTA */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-primary-foreground/50">
              © {new Date().getFullYear()} QRide
            </span>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-80"
            >
              Join waitlist <ArrowRight className="size-3" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
