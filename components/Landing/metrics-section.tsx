import { metrics } from "@/components/Landing/data";

export function MetricsSection() {
  return (
    <section id="metrics" className="landing-section container-shell">
      <div className="mb-10 max-w-2xl space-y-2">
        <p className="editorial-eyebrow">Growth measurement</p>
        <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
          Adoption, usage, revenue, and reach — all tracked.
        </h2>
      </div>

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ title, meta }) => (
          <div key={title} className="bg-card p-5">
            <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              {meta}
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
