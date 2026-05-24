import { operations, revenueModel } from "@/components/Landing/data";

export function OperationsSection() {
  return (
    <section className="landing-section container-shell">
      <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="premium-card p-6 md:p-8">
          <p className="editorial-eyebrow">Operations and technology</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-medium text-foreground">
            NFC gives QRide the reliability that live bank transfers cannot promise.
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {operations.map(([title, copy]) => (
              <div key={title} className="bg-card p-4">
                <p className="text-base font-medium text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card p-6 md:p-8">
          <p className="editorial-eyebrow">Revenue model</p>
          <div className="mt-5 space-y-5">
            {revenueModel.map(([title, copy]) => (
              <div
                key={title}
                className="border-b border-border/70 pb-5 last:border-b-0 last:pb-0"
              >
                <p className="text-lg font-medium text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
