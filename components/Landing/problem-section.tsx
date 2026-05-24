import { AlertCircle } from "lucide-react";

import { problems } from "@/components/Landing/data";

export function ProblemSection() {
  return (
    <section className="landing-section container-shell">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="space-y-3">
          <p className="editorial-eyebrow">The problem</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
            Fare payment still breaks when commuters need speed most.
          </h2>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Transport payment in Nigeria still depends on cash or live bank
            transfers. QRide removes the delay from the vehicle, the park, and
            the shared ride.
          </p>
        </div>

        <div className="space-y-0">
          {problems.map((problem) => (
            <div
              key={problem}
              className="flex items-start gap-3.5 border-b border-border/50 py-4 first:pt-0 last:border-b-0"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <p className="text-sm font-medium text-foreground">{problem}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
