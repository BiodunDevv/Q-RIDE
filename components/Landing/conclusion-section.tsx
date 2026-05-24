"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ConclusionSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section id="waitlist" className="landing-section container-shell">
      <div className="overflow-hidden bg-foreground p-8 text-background shadow-[0_24px_60px_rgba(17,24,39,0.16)] md:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="editorial-eyebrow text-background/50">
            Early access
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-background sm:text-4xl">
            QRide is launching soon.
          </h2>
          <p className="mt-4 text-sm leading-7 text-background/65">
            Join the waitlist and be the first to get your NFC transport card
            when QRide launches on your campus or route.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2.5 text-sm font-medium text-background/80">
              <CheckCircle2 className="size-4 text-primary" />
              You&apos;re on the list — we&apos;ll reach out when we launch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 flex-1 border border-background/15 bg-background/8 px-4 text-sm text-background placeholder:text-background/35 outline-none focus:border-primary/60 sm:max-w-xs"
              />
              <Button
                type="submit"
                className="h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                Join waitlist
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-[11px] text-background/35">
            No spam. No pressure. Just an early seat when we go live.
          </p>
        </div>
      </div>
    </section>
  );
}
