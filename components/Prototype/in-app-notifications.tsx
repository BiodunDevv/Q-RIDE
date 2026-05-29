import { Bell, CreditCard, Headphones, TriangleAlert, WalletCards } from "lucide-react";

import type { Notification } from "@/components/Prototype/prototype-data";

const iconMap = {
  payment: WalletCards,
  warning: TriangleAlert,
  card: CreditCard,
  support: Headphones,
  driver: Bell,
} satisfies Record<Notification["type"], typeof Bell>;

export function InAppNotifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="grid gap-3">
      {notifications.length ? (
        notifications.map((notification) => {
          const Icon = iconMap[notification.type];

          return (
            <div
              key={notification.id}
              className="grid grid-cols-[34px_1fr] gap-3 border border-neutral-200 bg-white p-3"
            >
              <div className="flex size-8 items-center justify-center bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-950">
                    {notification.title}
                  </p>
                  <span className="shrink-0 text-[10px] text-neutral-500">
                    {notification.time}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {notification.message}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
          Payment, card, dispute, and settlement alerts will appear here.
        </div>
      )}
    </div>
  );
}
