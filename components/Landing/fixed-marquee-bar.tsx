import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { marqueeItems } from "@/components/Landing/data";

export function FixedMarqueeBar() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-3">
        <div className="marquee-mask pointer-events-auto flex min-w-0 flex-1 items-center overflow-hidden border border-border/50 bg-background/94 px-4 py-2 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur">
          <div className="marquee-track flex min-w-max items-center gap-8 pr-8 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap"
              >
                <span className="font-medium text-foreground/85">{item}</span>
                <Zap className="size-3.5 text-primary" />
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-auto hidden items-center justify-between gap-3 bg-foreground px-3 py-1.5 text-background shadow-[0_14px_30px_rgba(17,24,39,0.18)] md:flex md:justify-start">
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.18em]">
            tap once, fare settled
          </span>
          <Button asChild size="sm" className="h-7 gap-1.5 px-3 text-xs">
            <a href="#waitlist" aria-label="Join QRide waitlist">
              Waitlist
              <ArrowRight className="size-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
