import { steps } from "@/components/Landing/data";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="landing-section container-shell">
      <div className="mb-10 max-w-2xl space-y-2">
        <p className="editorial-eyebrow">How it works</p>
        <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
          A transport wallet designed for the moment payment happens.
        </h2>
      </div>

      <div className="grid gap-0 divide-y divide-border/60 border-y border-border/60">
        {steps.map(({ title, description, icon: Icon }, i) => (
          <div
            key={title}
            className="grid grid-cols-[3rem_1fr] gap-6 py-7 sm:grid-cols-[3rem_1fr_1.4fr] sm:items-center"
          >
            <div className="flex size-10 shrink-0 items-center justify-center border border-border/60 text-xs font-semibold text-muted-foreground">
              0{i + 1}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 text-primary" />
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
              </div>
            </div>
            <p className="col-span-2 text-sm leading-6 text-muted-foreground sm:col-span-1">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
