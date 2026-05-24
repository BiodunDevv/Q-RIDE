import Image from "next/image";

const storyImages = [
  {
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&auto=format&fit=crop&q=70",
    alt: "Person tapping a contactless payment card on a reader",
    title: "Contactless payment",
    copy: "QRide brings the same tap-to-pay experience to campus routes, park-and-rides, and informal transport that bank apps can't reliably reach.",
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=70",
    alt: "Mobile payment and NFC technology in use",
    title: "NFC in motion",
  },
  {
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=70",
    alt: "Commuters on a bus during daily travel",
    title: "Everyday commuters",
  },
];

export function ImageIntelligenceSection() {
  return (
    <section className="landing-section container-shell">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="editorial-eyebrow">In the field</p>
        <h2 className="text-3xl font-medium tracking-[-0.04em] text-foreground">
          Built for real transport, not controlled conditions.
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          QRide is designed around how commuters, students, and drivers actually
          move — crowded terminals, informal routes, and moments where a slow
          payment app is the last thing anyone needs.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="premium-card overflow-hidden p-2">
          <div className="relative h-[320px] overflow-hidden rounded-[0.9rem] md:h-[420px]">
            <Image
              src={storyImages[0].src}
              alt={storyImages[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 text-white">
              <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">
                {storyImages[0].title}
              </p>
              <p className="mt-2 max-w-sm text-lg leading-7 font-medium">
                {storyImages[0].copy}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {storyImages.slice(1).map((image) => (
            <div key={image.title} className="premium-card overflow-hidden p-2">
              <div className="relative h-[198px] overflow-hidden rounded-[0.9rem]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">
                    {image.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
