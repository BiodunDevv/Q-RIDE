import { marketCards } from "@/components/Landing/data";

export function MarketSection() {
  return (
    <section className="landing-section container-shell">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="space-y-3">
          <p className="editorial-eyebrow">Who it serves</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
            Built for informal and formal transport alike.
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Unlike systems limited to BRT or rail, QRide works on the routes
            people already use every day.
          </p>
        </div>

        <div className="grid gap-0 divide-y divide-border/60 border-y border-border/60">
          {marketCards.map(({ title, meta, icon: Icon }) => (
            <div key={title} className="flex items-center gap-5 py-5">
              <div className="flex size-9 shrink-0 items-center justify-center bg-primary/8 text-primary">
                <Icon className="size-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{meta}</p>
              </div>
              <div className="text-[10px] tracking-[0.18em] text-muted-foreground/60 uppercase">
                QRide
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
