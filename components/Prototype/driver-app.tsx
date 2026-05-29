"use client";

import {
  ArrowLeft,
  CarFront,
  Check,
  Hash,
  Loader2,
  Radio,
  WalletCards,
  X,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { NFCRipple } from "@/components/Prototype/nfc-ripple";
import {
  SERVICE_FEE,
  formatMoney,
  getTime,
  numericValue,
  sleep,
  type DriverState,
  type ToastType,
  type Transaction,
  type UserState,
} from "@/components/Prototype/prototype-data";
import { TransactionRow } from "@/components/Prototype/transaction-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type DriverScreen = "home" | "charge" | "terminal" | "success" | "failed" | "manual";
type TerminalPhase = "waiting" | "tapping";

type DriverAppProps = {
  user: UserState;
  driver: DriverState;
  setUser: Dispatch<SetStateAction<UserState>>;
  setDriver: Dispatch<SetStateAction<DriverState>>;
  showToast: (message: string, type?: ToastType) => void;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold tracking-[0.08em] text-neutral-500">
        {label}
      </span>
      <div className="flex border border-neutral-200 bg-white">
        {prefix ? (
          <span className="flex h-10 items-center px-3 text-sm font-semibold text-neutral-500">
            {prefix}
          </span>
        ) : null}
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 border-0 bg-transparent text-sm font-semibold text-neutral-950 placeholder:text-neutral-400 focus-visible:ring-0"
        />
      </div>
    </label>
  );
}

export function DriverApp({
  user,
  driver,
  setUser,
  setDriver,
  showToast,
}: DriverAppProps) {
  const [screen, setScreen] = useState<DriverScreen>("home");
  const [chargeAmount, setChargeAmount] = useState("");
  const [phase, setPhase] = useState<TerminalPhase>("waiting");
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);

  const fare = Number(chargeAmount) || 0;
  const passengerPays = fare + SERVICE_FEE;

  const reset = () => {
    setScreen("home");
    setPhase("waiting");
    setPendingTx(null);
    setChargeAmount("");
  };

  const startCharge = () => {
    if (!fare || fare < 50) {
      showToast("Enter a valid fare. Minimum is ₦50.", "error");
      return;
    }

    setPhase("waiting");
    setScreen("terminal");
  };

  const simulateReceive = async () => {
    setPhase("tapping");
    await sleep(1100);

    if (user.balance < passengerPays) {
      setScreen("failed");
      return;
    }

    const driverTransaction: Transaction = {
      id: Date.now(),
      type: "receive",
      label: "Fare from passenger",
      amount: fare,
      service: SERVICE_FEE,
      method: "NFC Card",
      time: getTime(),
    };

    const passengerTransaction: Transaction = {
      ...driverTransaction,
      id: driverTransaction.id + 1,
      type: "send",
      label: `Ride · ${driver.name}`,
      amount: passengerPays,
      rideAmount: fare,
    };

    setDriver((current) => ({
      ...current,
      balance: current.balance + fare,
      todayEarnings: current.todayEarnings + fare,
      transactions: [driverTransaction, ...current.transactions].slice(0, 20),
    }));
    setUser((current) => ({
      ...current,
      balance: current.balance - passengerPays,
      transactions: [passengerTransaction, ...current.transactions].slice(0, 20),
    }));
    setPendingTx(driverTransaction);
    setScreen("success");
  };

  if (screen === "home") {
    return (
      <div className="bg-neutral-50 pb-20 text-neutral-950">
        <div className="bg-white px-5 pt-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-neutral-500">
                DRIVER DASHBOARD
              </p>
              <h2 className="text-xl font-semibold text-neutral-950">{driver.name}</h2>
            </div>
            <Badge className="bg-green-100 text-green-700">ONLINE</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-neutral-200 bg-white text-neutral-950">
              <CardContent className="p-4">
                <WalletCards className="mb-3 size-5 text-primary" />
                <p className="text-xl font-black">{formatMoney(driver.balance)}</p>
                <p className="mt-1 text-xs text-neutral-500">Wallet balance</p>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 bg-white text-neutral-950">
              <CardContent className="p-4">
                <CarFront className="mb-3 size-5 text-green-600" />
                <p className="text-xl font-black">{formatMoney(driver.todayEarnings)}</p>
                <p className="mt-1 text-xs text-neutral-500">Today&apos;s earnings</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 border border-dashed border-neutral-300 bg-neutral-100 p-4">
            <p className="text-xs font-semibold tracking-[0.1em] text-neutral-500">
              RIDE CODE
            </p>
            <p className="mt-1 text-2xl font-black tracking-[0.14em] text-neutral-950">
              {driver.code}
            </p>
            <p className="mt-1 text-xs text-neutral-500">Use this for manual passenger payments.</p>
          </div>
        </div>

        <div className="space-y-5 px-5 pt-5">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-neutral-500">
              COLLECT FARE
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto flex-col items-start gap-2 p-4" onClick={() => setScreen("charge")}>
                <Radio className="size-5" />
                <span>NFC Charge</span>
                <span className="text-xs font-normal text-primary-foreground/70">Tap card payment</span>
              </Button>
              <Button
                variant="secondary"
                className="h-auto flex-col items-start gap-2 p-4"
                onClick={() => setScreen("manual")}
              >
                <Hash className="size-5" />
                <span>Manual Code</span>
                <span className="text-xs font-normal text-muted-foreground">Show ride code</span>
              </Button>
            </div>
          </div>

          {driver.transactions.length ? (
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.1em] text-neutral-500">
                RECENT FARES
              </p>
              {driver.transactions.slice(0, 4).map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "charge") {
    return (
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">Charge Passenger</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Enter fare. Passenger pays the fare plus QRide&apos;s ₦10 service fee.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[100, 150, 200, 250, 300, 400, 500, 1000].map((amount) => (
            <Button
              key={amount}
              variant={chargeAmount === String(amount) ? "default" : "secondary"}
              size="sm"
              onClick={() => setChargeAmount(String(amount))}
            >
              ₦{amount}
            </Button>
          ))}
        </div>

        <Field
          label="CUSTOM FARE"
          value={chargeAmount}
          prefix="₦"
          onChange={(value) => setChargeAmount(numericValue(value))}
          placeholder="200"
        />

        {fare > 0 ? (
          <Card className="border-neutral-200 bg-white text-neutral-950">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Passenger pays</span>
                <span>{formatMoney(passengerPays)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>You receive</span>
                <span className="text-green-600">{formatMoney(fare)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">QRide service</span>
                <span>{formatMoney(SERVICE_FEE)}</span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Button onClick={startCharge} className="w-full">
          Present NFC Terminal
        </Button>
      </div>
    );
  }

  if (screen === "terminal") {
    return (
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={reset}>
          <ArrowLeft className="size-3.5" />
          Cancel
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">NFC Terminal Active</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Passenger holds their QRide card to this device.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 border border-neutral-200 bg-white p-6 text-center">
          <NFCRipple active={phase === "waiting" || phase === "tapping"} />
          <div>
            <p className="text-4xl font-black text-primary">{formatMoney(fare)}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Passenger pays {formatMoney(passengerPays)} including service fee.
            </p>
          </div>
          {phase === "waiting" ? (
            <p className="text-sm font-semibold text-neutral-600">Waiting for card tap...</p>
          ) : (
            <div className="text-sm font-semibold text-neutral-950">
              <Loader2 className="mx-auto mb-2 size-7 animate-spin text-primary" />
              Processing fare
            </div>
          )}
        </div>

        <Button onClick={simulateReceive} disabled={phase === "tapping"} className="w-full">
          Simulate Passenger Tap
        </Button>
      </div>
    );
  }

  if (screen === "success" && pendingTx) {
    return (
      <div className="flex min-h-[520px] items-center justify-center bg-neutral-50 px-6 text-center">
        <div className="w-full">
          <Check className="mx-auto mb-4 size-12 text-green-500" />
          <p className="text-lg font-semibold text-neutral-950">Fare collected</p>
          <p className="mt-2 text-4xl font-black text-primary">
            {formatMoney(pendingTx.amount)}
          </p>
          <Card className="mt-6 border-neutral-200 bg-white text-neutral-950">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Passenger paid</span>
                <span>{formatMoney((pendingTx.amount || 0) + SERVICE_FEE)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">QRide kept</span>
                <span>{formatMoney(SERVICE_FEE)}</span>
              </div>
              <Separator className="bg-neutral-200" />
              <div className="flex justify-between font-semibold">
                <span>Today&apos;s total</span>
                <span>{formatMoney(driver.todayEarnings)}</span>
              </div>
            </CardContent>
          </Card>
          <Button onClick={reset} className="mt-6 w-full">
            Next Passenger
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "failed") {
    return (
      <div className="flex min-h-[520px] items-center justify-center bg-neutral-50 px-6 text-center">
        <div className="w-full">
          <X className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-semibold text-neutral-950">Payment failed</p>
          <p className="mt-2 text-sm text-neutral-500">
            Passenger wallet has {formatMoney(user.balance)} and needs {formatMoney(passengerPays)}.
          </p>
          <div className="mt-6 grid gap-2">
            <Button onClick={() => setScreen("terminal")}>Try Again</Button>
            <Button variant="outline" onClick={reset}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
      <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
        <ArrowLeft className="size-3.5" />
        Back
      </Button>
      <div>
        <h2 className="text-xl font-semibold text-neutral-950">Manual Payment</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Show this code so passengers can pay from their QRide app.
        </p>
      </div>
      <div className="border border-primary/35 bg-primary/10 p-6 text-center">
        <p className="text-xs font-semibold tracking-[0.1em] text-neutral-500">
          YOUR RIDE CODE
        </p>
        <p className="mt-3 text-3xl font-black tracking-[0.16em] text-neutral-950">
          {driver.code}
        </p>
      </div>
      <Card className="border-neutral-200 bg-white text-neutral-950">
        <CardContent className="space-y-4 text-sm text-neutral-600">
          {[
            "Tell the passenger your QRide code.",
            "They enter the code and fare amount in their app.",
            "Your driver wallet receives the fare instantly.",
            "QRide adds the fixed service fee to the passenger total.",
          ].map((step, index) => (
            <div key={step} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
