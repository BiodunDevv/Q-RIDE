import { Bell, CreditCard, Headphones, TriangleAlert, WalletCards } from "lucide-react";

import type { Notification } from "@/components/Prototype/prototype-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap = {
  payment: WalletCards,
  warning: TriangleAlert,
  card: CreditCard,
  support: Headphones,
  driver: Bell,
} satisfies Record<Notification["type"], typeof Bell>;

export function NotificationCenter({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length ? (
          notifications.slice(0, 5).map((notification) => {
            const Icon = iconMap[notification.type];

            return (
              <div
                key={notification.id}
                className="grid grid-cols-[32px_1fr] gap-3 border border-border bg-background p-3"
              >
                <div className="flex size-8 items-center justify-center bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs leading-5 text-muted-foreground">
            Alerts for payments, cards, disputes, and driver settlements will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
