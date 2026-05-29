import Image from "next/image";

import { HERO_CARDS, type CardStatus } from "@/components/Prototype/prototype-data";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<CardStatus, string> = {
  active: "Active",
  blocked: "Blocked",
  replacement: "Replacement requested",
  issuing: "Issuing",
};

export function CardGallery({
  cardStatus,
}: {
  cardStatus: CardStatus;
}) {
  return (
    <div className="grid gap-3">
      {HERO_CARDS.map((card, index) => (
        <div
          key={card.src}
          className="grid grid-cols-[112px_1fr] items-center gap-3 border border-neutral-200 bg-white p-3"
        >
          <div className="relative aspect-[311/200] overflow-hidden bg-neutral-100">
            <Image
              src={card.src}
              alt={card.name}
              fill
              className="object-contain"
              sizes="112px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">{card.name}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {index === 0 ? "Linked to this passenger wallet" : card.status}
            </p>
            {index === 0 ? (
              <Badge className="mt-2 bg-primary text-primary-foreground">
                {statusLabel[cardStatus]}
              </Badge>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
