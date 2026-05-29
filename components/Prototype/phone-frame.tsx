"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { DeviceColor, DeviceSize } from "@/components/Prototype/iphone";

import { Iphone } from "@/components/Prototype/iphone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  showFrameOnMobile = false,
  deviceColor = "black",
  deviceSize = "proMax",
}: {
  children: ReactNode;
  showFrameOnMobile?: boolean;
  deviceColor?: DeviceColor;
  deviceSize?: DeviceSize;
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
        color={deviceColor}
        size={deviceSize}
        className="mx-auto h-[100svh] min-h-[560px] max-h-[790px] w-auto max-w-[calc(100vw-0.5rem)] drop-shadow-[0_18px_34px_rgba(0,0,0,0.2)]"
        screenClassName="bg-white shadow-[inset_0_0_18px_rgba(0,0,0,0.22)]"
      >
        {surface}
      </Iphone>
    );
  }

  if (isMobile) {
    return (
      <div className="mx-auto flex h-[85svh] min-h-[580px] w-full max-w-none flex-col overflow-hidden border border-neutral-200 bg-white prototype-phone-ui">
        {surface}
      </div>
    );
  }

  return (
    <Iphone
      color={deviceColor}
      size={deviceSize}
      className="mx-auto h-[min(920px,calc(100vh-6.5rem))] min-h-[660px] w-auto max-w-full drop-shadow-[0_24px_42px_rgba(0,0,0,0.22)]"
      screenClassName="bg-white shadow-[inset_0_0_18px_rgba(0,0,0,0.22)]"
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
  const [time, setTime] = useState(() => getStatusTime());

  useEffect(() => {
    const updateTime = () => setTime(getStatusTime());

    updateTime();
    const interval = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="prototype-phone-ui flex size-full flex-col overflow-hidden bg-white">
      <div
        className={cn(
          "flex items-center justify-between bg-[#080808] px-6 text-xs font-semibold text-white",
          framed ? "pt-14 pb-3" : "py-2"
        )}
      >
        <span>{time}</span>
        <span className="bg-primary px-3 py-1 text-[10px] font-black tracking-[0.12em] text-primary-foreground">
          QRIDE
        </span>
        <span>LTE 100%</span>
      </div>
      <ScrollArea className="min-h-0 flex-1 overflow-x-hidden">{children}</ScrollArea>
    </div>
  );
}

function getStatusTime() {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}
