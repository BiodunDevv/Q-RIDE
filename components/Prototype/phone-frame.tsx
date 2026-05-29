import type { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-[760px] max-h-[88vh] w-full max-w-[390px] flex-col overflow-hidden border border-white/12 bg-[#111] shadow-[0_28px_70px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between bg-[#080808] px-6 py-2 text-xs font-semibold text-white">
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
