"use client";

import type { CSSProperties, PointerEvent } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

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
const AUTO_SCROLL_SPEED = 34;
const DRAG_CLICK_THRESHOLD = 6;

type Card = (typeof cards)[number];

type HeroCardProps = {
  card: Card;
  index: number;
  onSelect: (card: Card) => void;
  shouldSuppressClick: () => boolean;
};

function normalizeOffset(offset: number, setWidth: number) {
  if (!setWidth) return offset;

  let nextOffset = offset;

  while (nextOffset <= -setWidth) {
    nextOffset += setWidth;
  }

  while (nextOffset > 0) {
    nextOffset -= setWidth;
  }

  return nextOffset;
}

function HeroCard({
  card,
  index,
  onSelect,
  shouldSuppressClick,
}: HeroCardProps) {
  return (
    <button
      onClick={() => {
        if (!shouldSuppressClick()) {
          onSelect(card);
        }
      }}
      className="group relative w-[280px] min-w-[280px] shrink-0 cursor-pointer select-none text-left focus:outline-none sm:w-[340px] sm:min-w-[340px]"
      aria-label={`View ${card.name} details`}
    >
      <div className="aspect-[311/200] w-full overflow-hidden bg-transparent shadow-[0_18px_40px_rgba(17,24,39,0.16)]">
        <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:-translate-y-1">
          <Image
            src={card.src}
            alt={card.alt}
            width={600}
            height={378}
            className="absolute top-0 left-0 h-auto max-w-none"
            style={card.artworkStyle as CSSProperties}
            priority={index < 3}
            draggable={false}
            sizes="(max-width: 640px) 280px, 340px"
          />
        </div>
      </div>
      <div className="mt-5 px-1">
        <p className="text-sm font-medium text-foreground">{card.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tap to learn more
        </p>
      </div>
    </button>
  );
}

function CardArtwork({ card }: { card: Card }) {
  return (
    <div className="aspect-[311/200] w-full overflow-hidden bg-transparent">
      <div className="relative h-full w-full">
        <Image
          src={card.src}
          alt={card.alt}
          width={600}
          height={378}
          className="absolute top-0 left-0 h-auto max-w-none"
          style={card.artworkStyle as CSSProperties}
          draggable={false}
          sizes="(max-width: 640px) 100vw, 448px"
        />
      </div>
    </div>
  );
}

function CardDialog({
  selected,
  onOpenChange,
  onClose,
}: {
  selected: Card | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!selected} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md gap-0 overflow-hidden p-0"
      >
        {selected ? (
          <>
            <CardArtwork card={selected} />
            <div className="px-6 py-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selected.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex gap-3">
                <Button asChild size="sm" className="flex-1">
                  <a href="#waitlist" onClick={onClose}>
                    Join waitlist
                    <ArrowRight className="size-3.5" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CardDrawer({
  selected,
  onOpenChange,
  onClose,
}: {
  selected: Card | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  return (
    <Drawer open={!!selected} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[86vh]">
        {selected ? (
          <>
            <div className="px-5 pt-5">
              <CardArtwork card={selected} />
            </div>
            <DrawerHeader className="px-5 pt-5 pb-2 text-left">
              <DrawerTitle className="text-base font-semibold">
                {selected.name}
              </DrawerTitle>
              <DrawerDescription className="mt-2 text-sm leading-6">
                {selected.description}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="px-5 pt-3 pb-5">
              <Button asChild size="sm">
                <a href="#waitlist" onClick={onClose}>
                  Join waitlist
                  <ArrowRight className="size-3.5" />
                </a>
              </Button>
              <DrawerClose asChild>
                <Button size="sm" variant="outline">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export function HeroSection() {
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const pointerCapturedRef = useRef(false);
  const [selected, setSelected] = useState<Card | null>(null);

  const applyOffset = useCallback((nextOffset: number) => {
    const normalizedOffset = normalizeOffset(nextOffset, setWidthRef.current);
    offsetRef.current = normalizedOffset;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${normalizedOffset}px, 0, 0)`;
    }
  }, []);

  useLayoutEffect(() => {
    const updateTrackWidth = () => {
      if (!trackRef.current) return;

      setWidthRef.current = trackRef.current.scrollWidth / 2;
      applyOffset(offsetRef.current);
    };

    updateTrackWidth();
    window.addEventListener("resize", updateTrackWidth);

    return () => window.removeEventListener("resize", updateTrackWidth);
  }, [applyOffset]);

  useEffect(() => {
    const tick = (time: number) => {
      const previousTime = lastFrameTimeRef.current ?? time;
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
      lastFrameTimeRef.current = time;

      if (!draggingRef.current && !selected) {
        applyOffset(offsetRef.current - AUTO_SCROLL_SPEED * deltaSeconds);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [applyOffset, selected]);

  const shouldSuppressClick = useCallback(() => suppressClickRef.current, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    suppressClickRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    dragDistanceRef.current = 0;
    pointerCapturedRef.current = false;
    lastFrameTimeRef.current = performance.now();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const deltaX = event.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.max(
      dragDistanceRef.current,
      Math.abs(deltaX),
    );

    if (
      !pointerCapturedRef.current &&
      dragDistanceRef.current > DRAG_CLICK_THRESHOLD
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerCapturedRef.current = true;
    }

    applyOffset(dragStartOffsetRef.current + deltaX);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    lastFrameTimeRef.current = performance.now();

    if (dragDistanceRef.current > DRAG_CLICK_THRESHOLD) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (
      pointerCapturedRef.current &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerCapturedRef.current = false;
  };

  const closeCardDetails = () => setSelected(null);
  const handleDetailsOpenChange = (open: boolean) => {
    if (!open) setSelected(null);
  };

  return (
    <section className="qride-hero-grid qride-noise relative overflow-hidden">
      <div className="container-shell flex flex-col items-center pt-20 pb-10 text-center sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14">
        <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/6 px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-primary uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Now accepting waitlist signups
        </div>

        <h1 className="mb-5 max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span>Tap, ride, and pay </span>
          <span className="text-primary">in seconds.</span>
        </h1>

        <p className="mb-8 max-w-xl text-base leading-7 text-muted-foreground">
          QRide is an NFC-based transport wallet for students, commuters, and
          drivers. Load funds once and tap to pay across buses, shuttles, and
          taxis
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href="#waitlist">
              Join the waitlist
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/prototype">View prototype</a>
          </Button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden pb-16 sm:pb-20">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div
          className="cursor-grab overflow-visible touch-pan-y active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-6 will-change-transform"
          >
            {track.map((card, i) => (
              <HeroCard
                key={`${card.src}-${i}`}
                card={card}
                index={i}
                onSelect={setSelected}
                shouldSuppressClick={shouldSuppressClick}
              />
            ))}
          </div>
        </div>
      </div>

      {isMobile ? (
        <CardDrawer
          selected={selected}
          onOpenChange={handleDetailsOpenChange}
          onClose={closeCardDetails}
        />
      ) : (
        <CardDialog
          selected={selected}
          onOpenChange={handleDetailsOpenChange}
          onClose={closeCardDetails}
        />
      )}
    </section>
  );
}
