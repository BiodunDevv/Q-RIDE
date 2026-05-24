import { flows } from "@/components/Landing/data";

export function SolutionSection() {
  return (
    <section id="solution" className="landing-section container-shell">
      <div className="overflow-hidden bg-foreground p-5 text-background shadow-[0_20px_50px_rgba(17,24,39,0.12)] md:p-8">
        <div className="grid gap-6 md:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <p className="editorial-eyebrow text-background/60">QRide system</p>
            <h2 className="text-3xl font-medium">
              Universal tap-to-pay for campus and public transportation.
            </h2>
            <p className="max-w-lg text-sm leading-7 text-background/75">
              QRide works across taxis, buses, motorcycles, and shuttles. It is
              not tied to one formal transport network, so everyday riders and
              drivers can use it where cash and bank apps slow movement down.
            </p>
            <div className="flex flex-wrap gap-2 text-xs tracking-[0.15em] uppercase text-background/84">
              <span className="bg-background/10 px-3 py-1.5">offline NFC</span>
              <span className="bg-background/10 px-3 py-1.5">
                fare splitting
              </span>
              <span className="bg-background/10 px-3 py-1.5">
                driver credit
              </span>
            </div>
          </div>

          <div className="bg-background/5 p-4 font-mono text-sm">
            {flows.map((row, index) => (
              <div
                key={row}
                className="mb-3 flex items-center gap-3 bg-black/18 px-4 py-3 text-background/78 last:mb-0"
              >
                <span className="text-background/38">0{index + 1}</span>
                <span>{row}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
