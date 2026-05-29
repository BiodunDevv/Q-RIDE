"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DriverApp } from "@/components/Prototype/driver-app";
import { LiveBalances } from "@/components/Prototype/live-balances";
import { PassengerApp } from "@/components/Prototype/passenger-app";
import { PhoneFrame } from "@/components/Prototype/phone-frame";
import {
  INITIAL_DRIVER,
  INITIAL_USER,
  type DriverState,
  type Role,
  type ToastType,
  type UserState,
} from "@/components/Prototype/prototype-data";
import { PrototypeToast } from "@/components/Prototype/prototype-toast";
import { RoleSwitcher } from "@/components/Prototype/role-switcher";
import { Logo } from "@/components/Landing/logo";
import { Button } from "@/components/ui/button";

type ToastState = {
  message: string;
  type: ToastType;
};

export function PrototypeShell() {
  const [role, setRole] = useState<Role>("passenger");
  const [user, setUser] = useState<UserState>(INITIAL_USER);
  const [driver, setDriver] = useState<DriverState>(INITIAL_DRIVER);
  const [toast, setToast] = useState<ToastState | null>(null);
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

      <section id="prototype" className="container-shell py-8 sm:py-10 lg:py-12">
        <div className="mb-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            QRide interactive prototype
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Test the passenger wallet, driver terminal, NFC tap flow, manual ride-code
            payment, wallet top-up, and shared service-fee balances in one client-side demo.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(260px,320px)] lg:justify-center">
          <div className="relative">
            <PhoneFrame>
              <RoleSwitcher role={role} onRoleChange={setRole} />
              {role === "passenger" ? (
                <PassengerApp
                  user={user}
                  driver={driver}
                  setUser={setUser}
                  setDriver={setDriver}
                  showToast={showToast}
                />
              ) : (
                <DriverApp
                  user={user}
                  driver={driver}
                  setUser={setUser}
                  setDriver={setDriver}
                  showToast={showToast}
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
