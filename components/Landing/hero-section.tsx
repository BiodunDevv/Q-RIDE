"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const cards = [
  {
    src: "/card1.svg",
    alt: "QRide Transport Wallet card",
    name: "Transport Wallet",
    artworkStyle: {
      width: "149%",
      transform: "translate(-14.25%, -10.25%)",
    },
    description:
      "Your all-in-one NFC transport wallet. Load funds once and tap to pay across buses, taxis, and shuttles — no cash, no network needed.",
  },
  {
    src: "/card2.svg",
    alt: "QRide Commuter card",
    name: "Commuter Card",
    artworkStyle: {
      width: "100%",
      transform: "translate(0, 0)",
    },
    description:
      "Built for daily riders. Seamlessly handle fares across multiple routes and operators with a single tap on your NFC card.",
  },
  {
    src: "/card3.svg",
    alt: "QRide Campus Shuttle card",
    name: "Campus Shuttle",
    artworkStyle: {
      width: "134%",
      transform: "translate(-4.8%, -10.25%)",
    },
    description:
      "Designed for students. Tap in and out of campus shuttles instantly — fares deducted from your QRide balance in seconds.",
  },
  {
    src: "/card4.svg",
    alt: "QRide Driver card",
    name: "Driver Card",
    artworkStyle: {
      width: "100%",
      transform: "translate(0, 0)",
    },
    description:
      "For transport operators. Accept NFC payments directly from riders and receive fare value instantly — even in low-signal areas.",
  },
 
];

const track = [...cards, ...cards];

type Card = (typeof cards)[number];

type HeroCardProps = {
  card: Card;
  index: number;
  onSelect: (card: Card) => void;
};

function HeroCard({ card, index, onSelect }: HeroCardProps) {
  return (
    <button
      onClick={() => onSelect(card)}
      className="group relative w-[280px] min-w-[280px] shrink-0 cursor-pointer text-left focus:outline-none sm:w-[340px] sm:min-w-[340px]"
      aria-label={`View ${card.name} details`}
    >
      <div className="aspect-[311/200] w-full overflow-hidden bg-transparent shadow-[0_18px_40px_rgba(17,24,39,0.16)]">
        <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:-translate-y-1">
          <Image
            src={card.src}
            alt={card.alt}
            width={600}
            height={378}
            className="absolute left-0 top-0 h-auto max-w-none"
            style={card.artworkStyle as CSSProperties}
            priority={index < 3}
            sizes="(max-width: 640px) 280px, 340px"
          />
        </div>
      </div>
      <div className="mt-5 px-1">
        <p className="text-sm font-medium text-foreground">{card.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Tap to learn more</p>
      </div>
    </button>
  );
}

export function HeroSection() {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <section className="qride-hero-grid qride-noise relative overflow-hidden">
      <div className="container-shell flex flex-col items-center pt-20 pb-10 text-center sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14">

        {/* Live badge */}
        <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/6 px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-primary uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Now accepting waitlist signups
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span>Tap, ride, and pay </span>
          <span className="text-primary">in seconds.</span>
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-xl text-base leading-7 text-muted-foreground">
          QRide is an NFC-based transport wallet for students, commuters, and
          drivers. Load funds once and tap to pay across buses, shuttles, and taxis
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href="#waitlist">
              Join the waitlist
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
      </div>

      {/* ── Card marquee ──────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden pb-16 sm:pb-20">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="hero-card-track flex gap-6 will-change-transform">
          {track.map((card, i) => (
            <HeroCard
              key={`${card.src}-${i}`}
              card={card}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* ── Card detail dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className={[
            "p-0 overflow-hidden gap-0",
            /* mobile: anchored to bottom, full width, slide up */
            "fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0 w-full max-w-full rounded-t-2xl",
            /* desktop: centred modal */
            "sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-none",
          ].join(" ")}
        >
          {selected && (
            <>
              {/* drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="h-1 w-10 rounded-full bg-border" />
              </div>

              {/* card image */}
              <Image
                src={selected.src}
                alt={selected.alt}
                width={600}
                height={378}
                className="block w-full"
                style={{ aspectRatio: "600/378" }}
              />

              {/* content */}
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold sm:text-lg">
                    {selected.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex gap-3">
                  <Button asChild size="sm" className="flex-1">
                    <a href="#waitlist" onClick={() => setSelected(null)}>
                      Join waitlist
                      <ArrowRight className="size-3.5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
