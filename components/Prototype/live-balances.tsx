import { Building2, CarFront, UserRound } from "lucide-react";

import {
  formatMoney,
  type DriverState,
  type UserState,
} from "@/components/Prototype/prototype-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LiveBalancesProps = {
  user: UserState;
  driver: DriverState;
  qrideEarned: number;
};

export function LiveBalances({ user, driver, qrideEarned }: LiveBalancesProps) {
  const stats = [
    {
      label: "User wallet",
      value: user.balance,
      icon: UserRound,
      className: "text-primary",
    },
    {
      label: "Driver wallet",
      value: driver.balance,
      icon: CarFront,
      className: "text-foreground",
    },
    {
      label: "QRide earned",
      value: qrideEarned,
      icon: Building2,
      className: "text-green-600",
    },
  ];

  return (
    <aside className="grid gap-3 lg:w-[280px]">
      <Card>
        <CardHeader>
          <CardTitle>Live balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map(({ label, value, icon: Icon, className }) => (
            <div key={label} className="border border-border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Icon className="size-4" />
                {label}
              </div>
              <p className={`text-2xl font-semibold ${className}`}>
                {formatMoney(value)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-5 text-muted-foreground">
          <p>Passenger NFC: enter fare, activate reader, simulate tap.</p>
          <p>Manual payment: use code MSAIBR-442 or 442.</p>
          <p>Failure case: try paying more than the passenger wallet.</p>
          <p>Driver charge: switch to Driver, set fare, simulate passenger tap.</p>
        </CardContent>
      </Card>
    </aside>
  );
}
