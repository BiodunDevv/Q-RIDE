"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DriverApp } from "@/components/Prototype/driver-app";
import type { DeviceColor } from "@/components/Prototype/iphone";
import { LiveBalances } from "@/components/Prototype/live-balances";
import { PassengerApp } from "@/components/Prototype/passenger-app";
import { PhoneFrame } from "@/components/Prototype/phone-frame";
import {
  INITIAL_DRIVER,
  INITIAL_USER,
  getTime,
  type DriverState,
  type Notification,
  type Role,
  type ToastType,
  type UserState,
} from "@/components/Prototype/prototype-data";
import { PrototypeToast } from "@/components/Prototype/prototype-toast";
import { RoleSwitcher } from "@/components/Prototype/role-switcher";
import { Logo } from "@/components/Landing/logo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

type ToastState = {
  message: string;
  type: ToastType;
};

export function PrototypeShell() {
  const isMobile = useIsMobile();
  const [role, setRole] = useState<Role>("passenger");
  const [user, setUser] = useState<UserState>(INITIAL_USER);
  const [driver, setDriver] = useState<DriverState>(INITIAL_DRIVER);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showMobileFrame, setShowMobileFrame] = useState(true);
  const [deviceColor, setDeviceColor] = useState<DeviceColor>("black");
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }, []);

  const pushNotification = useCallback(
    (notification: Omit<Notification, "id" | "time">) => {
      setNotifications((current) => [
        {
          ...notification,
          id: Date.now(),
          time: getTime(),
        },
        ...current,
      ].slice(0, 20));
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const qrideEarned = useMemo(
    () =>
      user.transactions
        .filter((transaction) => transaction.type === "send")
        .reduce((total, transaction) => total + (transaction.service ?? 0), 0),
    [user.transactions]
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="qride-noise border-b border-border bg-card">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                Landing
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="#prototype">
                Try prototype
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <section id="prototype" className="container-shell py-4 sm:py-5 lg:py-6">
        <div className="mb-4 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            QRide interactive prototype
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Test the passenger wallet, driver terminal, NFC tap flow, manual ride-code
            payment, wallet top-up, and shared service-fee balances in one client-side demo.
          </p>
        </div>

        <div className="mb-4 grid gap-3 border border-border bg-card px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
          {isMobile ? (
            <div>
              <p className="text-sm font-medium">Device frame</p>
              <p className="text-xs text-muted-foreground">
                {showMobileFrame ? "Showing phone shell" : "Using full app view"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium">Phone preview</p>
              <p className="text-xs text-muted-foreground">
                Dark frame with the light QRide app UI.
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            {(["black", "graphite"] as DeviceColor[]).map((color) => (
              <Button
                key={color}
                type="button"
                size="sm"
                variant={deviceColor === color ? "default" : "outline"}
                onClick={() => setDeviceColor(color)}
              >
                {color}
              </Button>
            ))}
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              Pro Max
            </span>
            {isMobile ? (
              <Switch
                checked={showMobileFrame}
                onCheckedChange={setShowMobileFrame}
                aria-label="Toggle mobile phone frame"
              />
            ) : null}
          </div>
        </div>

        <div className="grid items-start justify-items-center gap-6 lg:min-h-[calc(100vh-14rem)] lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-center">
          <div className="relative flex w-full justify-center overflow-visible">
            <PhoneFrame
              showFrameOnMobile={showMobileFrame}
              deviceColor={deviceColor}
            >
              <RoleSwitcher role={role} onRoleChange={setRole} />
              {role === "passenger" ? (
                <PassengerApp
                  user={user}
                  driver={driver}
                  setUser={setUser}
                  setDriver={setDriver}
                  showToast={showToast}
                  pushNotification={pushNotification}
                  notifications={notifications}
                />
              ) : (
                <DriverApp
                  user={user}
                  driver={driver}
                  setUser={setUser}
                  setDriver={setDriver}
                  showToast={showToast}
                  pushNotification={pushNotification}
                  notifications={notifications}
                />
              )}
            </PhoneFrame>
            {toast ? <PrototypeToast message={toast.message} type={toast.type} /> : null}
          </div>

          <LiveBalances user={user} driver={driver} qrideEarned={qrideEarned} />
        </div>
      </section>
    </main>
  );
}
