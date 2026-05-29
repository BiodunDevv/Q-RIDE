import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import type { ToastType } from "@/components/Prototype/prototype-data";

type PrototypeToastProps = {
  message: string;
  type: ToastType;
};

export function PrototypeToast({ message, type }: PrototypeToastProps) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;

  return (
    <div
      className={[
        "absolute bottom-20 left-1/2 z-40 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 border px-4 py-3 text-xs font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.34)]",
        type === "success"
          ? "border-green-500/30 bg-green-600"
          : type === "error"
            ? "border-red-500/30 bg-red-600"
            : "border-primary/30 bg-primary",
      ].join(" ")}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
}
