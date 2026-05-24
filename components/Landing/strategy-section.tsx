import { strategies } from "@/components/Landing/data";

export function StrategySection() {
  return (
    <section id="strategy" className="landing-section container-shell">
      <div className="mb-10 max-w-2xl space-y-2">
        <p className="editorial-eyebrow">Adoption and growth</p>
        <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
          Start where trust is easiest, then expand into the city.
        </h2>
      </div>

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
        {strategies.map(({ title, items }, i) => (
          <div key={title} className="bg-card p-6">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Phase {String(i + 1).padStart(2, "0")}
            </p>
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{items}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
