import { challengeRows } from "@/components/Landing/data";

export function ChallengesSection() {
  return (
    <section className="landing-section container-shell">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="space-y-3">
          <p className="editorial-eyebrow">Challenges and solutions</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">
            Adoption, trust, and card management treated as product work.
          </h2>
        </div>

        <div className="space-y-0">
          {challengeRows.map(([challenge, solution]) => (
            <div
              key={challenge}
              className="grid gap-1 border-b border-border/50 py-5 first:pt-0 last:border-b-0 sm:grid-cols-[0.38fr_0.62fr] sm:gap-6 sm:items-baseline"
            >
              <p className="text-sm font-semibold text-foreground">{challenge}</p>
              <p className="text-sm leading-6 text-muted-foreground">{solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
