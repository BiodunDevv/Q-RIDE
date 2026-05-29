import { Check, Radio, X } from "lucide-react";

type NFCRippleProps = {
  active?: boolean;
  success?: boolean;
  fail?: boolean;
};

export function NFCRipple({ active, success, fail }: NFCRippleProps) {
  const Icon = success ? Check : fail ? X : Radio;

  return (
    <div className="relative size-28 shrink-0">
      {active && !success && !fail
        ? [0, 1, 2].map((item) => (
            <div
              key={item}
              className="prototype-ripple absolute inset-0 border-2 border-primary"
              style={{ animationDelay: `${item * 0.5}s` }}
            />
          ))
        : null}
      <div
        className={[
          "absolute inset-4 flex items-center justify-center rounded-full text-white transition-colors",
          success
            ? "bg-green-600"
            : fail
              ? "bg-destructive"
              : active
                ? "bg-primary"
                : "bg-foreground",
        ].join(" ")}
      >
        <Icon className="size-7" strokeWidth={success || fail ? 3 : 1.8} />
      </div>
    </div>
  );
}
