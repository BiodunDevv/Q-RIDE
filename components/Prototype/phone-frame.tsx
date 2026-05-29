"use client";

import type { ReactNode } from "react";

import { Iphone } from "@/components/Prototype/iphone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  showFrameOnMobile = false,
}: {
  children: ReactNode;
  showFrameOnMobile?: boolean;
}) {
  const isMobile = useIsMobile();
  const shouldFrame = !isMobile || showFrameOnMobile;

  const surface = (
    <PhoneSurface framed={shouldFrame}>
      {children}
    </PhoneSurface>
  );

  if (isMobile && showFrameOnMobile) {
    return (
      <Iphone
        className="mx-auto w-full max-w-[350px] drop-shadow-[0_18px_34px_rgba(0,0,0,0.2)]"
        screenClassName="bg-[#111]"
      >
        {surface}
      </Iphone>
    );
  }

  if (isMobile) {
    return (
      <div className="mx-auto flex h-[calc(100svh-9rem)] min-h-[560px] w-full max-w-none flex-col overflow-hidden border border-white/12 bg-[#111]">
        {surface}
      </div>
    );
  }

  return (
    <Iphone
      className="mx-auto w-full max-w-[390px] drop-shadow-[0_24px_42px_rgba(0,0,0,0.22)]"
      screenClassName="bg-[#111]"
    >
      {surface}
    </Iphone>
  );
}

function PhoneSurface({
  children,
  framed,
}: {
  children: ReactNode;
  framed: boolean;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden bg-[#111]">
      <div
        className={cn(
          "flex items-center justify-between bg-[#080808] px-6 text-xs font-semibold text-white",
          framed ? "pt-14 pb-3" : "py-2"
        )}
      >
        <span>9:41</span>
        <span className="bg-primary px-3 py-1 text-[10px] font-black tracking-[0.12em] text-primary-foreground">
          QRIDE
        </span>
        <span>LTE 100%</span>
      </div>
      <ScrollArea className="min-h-0 flex-1">{children}</ScrollArea>
    </div>
  );
}
