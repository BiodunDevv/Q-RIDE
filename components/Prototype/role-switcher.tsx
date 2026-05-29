import { CarFront, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Role } from "@/components/Prototype/prototype-data";

type RoleSwitcherProps = {
  role: Role;
  onRoleChange: (role: Role) => void;
};

export function RoleSwitcher({ role, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="grid grid-cols-2 gap-1 border-b border-neutral-200 bg-white p-3">
      <Button
        size="sm"
        variant={role === "passenger" ? "default" : "secondary"}
        onClick={() => onRoleChange("passenger")}
      >
        <UserRound className="size-3.5" />
        Passenger
      </Button>
      <Button
        size="sm"
        variant={role === "driver" ? "default" : "secondary"}
        onClick={() => onRoleChange("driver")}
      >
        <CarFront className="size-3.5" />
        Driver
      </Button>
    </div>
  );
}
