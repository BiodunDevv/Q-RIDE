"use client";

import { ArrowLeft, Check, CreditCard, Hash, Loader2, Plus, Radio } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { NFCRipple } from "@/components/Prototype/nfc-ripple";
import {
  DRIVER_CODE,
  SERVICE_FEE,
  formatMoney,
  getTime,
  isDriverCodeValid,
  numericValue,
  sleep,
  type DriverState,
  type ToastType,
  type Transaction,
  type UserState,
} from "@/components/Prototype/prototype-data";
import { QRideCard } from "@/components/Prototype/qride-card";
import { TransactionRow } from "@/components/Prototype/transaction-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type PassengerScreen = "home" | "nfc" | "manual" | "processing" | "success" | "topup";
type NfcPhase = "idle" | "ready" | "tapping" | "done";

type PassengerAppProps = {
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
      <span className="text-xs font-semibold tracking-[0.08em] text-white/55">
        {label}
      </span>
      <div className="flex border border-white/12 bg-white/5">
        {prefix ? (
          <span className="flex h-10 items-center px-3 text-sm font-semibold text-white/42">
            {prefix}
          </span>
        ) : null}
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 border-0 bg-transparent text-sm font-semibold text-white placeholder:text-white/28 focus-visible:ring-0"
        />
      </div>
    </label>
  );
}

export function PassengerApp({
  user,
  driver,
  setUser,
  setDriver,
  showToast,
}: PassengerAppProps) {
  const [screen, setScreen] = useState<PassengerScreen>("home");
  const [rideAmount, setRideAmount] = useState("200");
  const [rideCode, setRideCode] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [nfcPhase, setNfcPhase] = useState<NfcPhase>("idle");
  const [nfcResult, setNfcResult] = useState<"success" | "fail" | null>(null);
  const [failReason, setFailReason] = useState("");
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);
  const [topupAmount, setTopupAmount] = useState("");

  const rideFare = Number(rideAmount) || 0;
  const totalPay = rideFare + SERVICE_FEE;

  const reset = () => {
    setNfcPhase("idle");
    setNfcResult(null);
    setFailReason("");
    setPendingTx(null);
    setRideCode("");
    setManualAmount("");
    setScreen("home");
  };

  const completePassengerPayment = (fare: number, method: string, label: string) => {
    const total = fare + SERVICE_FEE;
    const transaction: Transaction = {
      id: Date.now(),
      type: "send",
      label,
      amount: total,
      rideAmount: fare,
      service: SERVICE_FEE,
      method,
      time: getTime(),
    };
    const driverTransaction: Transaction = {
      id: transaction.id + 1,
      type: "receive",
      label: `Fare from ${user.name.split(" ")[0]}`,
      amount: fare,
      service: SERVICE_FEE,
      method,
      time: transaction.time,
    };

    setUser((current) => ({
      ...current,
      balance: current.balance - total,
      transactions: [transaction, ...current.transactions].slice(0, 20),
    }));
    setDriver((current) => ({
      ...current,
      balance: current.balance + fare,
      todayEarnings: current.todayEarnings + fare,
      transactions: [driverTransaction, ...current.transactions].slice(0, 20),
    }));
    setPendingTx(transaction);
    return transaction;
  };

  const simulateNfc = async () => {
    setNfcPhase("tapping");
    await sleep(1100);

    if (user.balance < totalPay) {
      setNfcPhase("done");
      setNfcResult("fail");
      setFailReason(
        `Insufficient balance. Need ${formatMoney(totalPay)}, have ${formatMoney(user.balance)}.`
      );
      return;
    }

    setNfcPhase("done");
    setNfcResult("success");
    completePassengerPayment(rideFare, "NFC Card", `Ride · ${driver.name}`);
  };

  const simulateManual = async () => {
    const fare = Number(manualAmount);

    if (!isDriverCodeValid(rideCode)) {
      showToast("Invalid ride code. Use MSAIBR-442 or 442.", "error");
      return;
    }

    if (!fare || fare < 50) {
      showToast("Enter a valid amount. Minimum fare is ₦50.", "error");
      return;
    }

    if (user.balance < fare + SERVICE_FEE) {
      showToast(`Need ${formatMoney(fare + SERVICE_FEE)}, only have ${formatMoney(user.balance)}.`, "error");
      return;
    }

    setScreen("processing");
    await sleep(1000);
    completePassengerPayment(fare, "Ride Code", `Ride Code · ${driver.name}`);
    setScreen("success");
  };

  if (screen === "home") {
    return (
      <div className="pb-20">
        <div className="bg-[linear-gradient(180deg,rgba(159,7,18,0.2),transparent)] px-5 pt-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-white/45">
                GOOD MORNING
              </p>
              <h2 className="text-xl font-semibold text-white">
                {user.name.split(" ")[0]}
              </h2>
            </div>
            <Badge className="bg-green-500/15 text-green-500">TIER {user.tier}</Badge>
          </div>

          <div className="bg-primary p-5 text-primary-foreground shadow-[0_18px_45px_rgba(159,7,18,0.25)]">
            <p className="text-xs font-semibold tracking-[0.1em] text-primary-foreground/70">
              WALLET BALANCE
            </p>
            <p className="mt-2 text-4xl font-black tracking-tight">
              {formatMoney(user.balance)}
            </p>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-xs text-primary-foreground/70">{user.matric}</p>
              <QRideCard mini />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 pt-5">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-white/52">
              PAY YOUR RIDE
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto flex-col items-start gap-2 p-4" onClick={() => setScreen("nfc")}>
                <Radio className="size-5" />
                <span>Tap to Pay</span>
                <span className="text-xs font-normal text-primary-foreground/70">NFC card</span>
              </Button>
              <Button
                variant="secondary"
                className="h-auto flex-col items-start gap-2 p-4"
                onClick={() => setScreen("manual")}
              >
                <Hash className="size-5" />
                <span>Ride Code</span>
                <span className="text-xs font-normal text-muted-foreground">Manual transfer</span>
              </Button>
            </div>
          </div>

          <button
            onClick={() => setScreen("topup")}
            className="flex w-full items-center gap-3 border border-white/10 bg-white/5 p-4 text-left"
          >
            <div className="flex size-10 items-center justify-center bg-white/8 text-white">
              <CreditCard className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Top Up Wallet</p>
              <p className="text-xs text-white/45">Current balance: {formatMoney(user.balance)}</p>
            </div>
            <Plus className="size-4 text-white/45" />
          </button>

          {user.transactions.length ? (
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.1em] text-white/52">
                RECENT
              </p>
              {user.transactions.slice(0, 4).map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "nfc") {
    return (
      <div className="space-y-5 px-5 py-5 pb-20">
        <Button size="sm" variant="secondary" onClick={reset}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-white">Tap to Pay</h2>
          <p className="mt-1 text-sm text-white/45">
            Driver activates terminal, you hold your QRide card.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Ride fare</span>
              <span>{formatMoney(rideFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Service charge</span>
              <span>+{formatMoney(SERVICE_FEE)}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between text-sm font-semibold">
              <span>You pay</span>
              <span className="text-primary">{formatMoney(totalPay)}</span>
            </div>
          </CardContent>
        </Card>

        {nfcPhase === "idle" ? (
          <Field
            label="RIDE AMOUNT"
            value={rideAmount}
            prefix="₦"
            onChange={(value) => setRideAmount(numericValue(value))}
            placeholder="200"
          />
        ) : null}

        <div className="flex flex-col items-center gap-5 border border-white/10 bg-black/30 p-6">
          <NFCRipple active={nfcPhase === "ready" || nfcPhase === "tapping"} success={nfcResult === "success"} fail={nfcResult === "fail"} />

          {nfcPhase === "idle" ? (
            <>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">Ready to tap</p>
                <p className="mt-1 text-xs text-white/42">Activate the reader, then place your card.</p>
              </div>
              <QRideCard />
              <Button onClick={() => setNfcPhase("ready")} className="w-full">
                Activate NFC Reader
              </Button>
            </>
          ) : null}

          {nfcPhase === "ready" ? (
            <>
              <p className="text-center text-sm font-semibold text-primary">Waiting for card...</p>
              <QRideCard active />
              <Button onClick={simulateNfc} className="w-full">Simulate Card Tap</Button>
            </>
          ) : null}

          {nfcPhase === "tapping" ? (
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
              <p className="text-sm font-semibold text-white">Reading card...</p>
            </div>
          ) : null}

          {nfcPhase === "done" && nfcResult === "success" && pendingTx ? (
            <div className="w-full text-center">
              <Check className="mx-auto mb-3 size-10 text-green-500" />
              <p className="text-sm font-semibold text-green-500">Payment successful</p>
              <p className="mt-2 text-3xl font-black text-white">{formatMoney(pendingTx.amount)}</p>
              <p className="mt-1 text-xs text-white/45">
                Driver receives {formatMoney(pendingTx.rideAmount ?? 0)} · QRide fee {formatMoney(SERVICE_FEE)}
              </p>
              <Button onClick={reset} className="mt-5 w-full">Done</Button>
            </div>
          ) : null}

          {nfcPhase === "done" && nfcResult === "fail" ? (
            <div className="w-full text-center">
              <p className="text-sm font-semibold text-red-400">Payment failed</p>
              <p className="mt-2 text-xs text-white/45">{failReason}</p>
              <div className="mt-5 grid gap-2">
                <Button onClick={() => { setNfcPhase("ready"); setNfcResult(null); setFailReason(""); }}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => { setNfcPhase("idle"); setNfcResult(null); setScreen("manual"); }}>
                  Use Ride Code
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "manual") {
    const fare = Number(manualAmount) || 0;
    return (
      <div className="space-y-5 px-5 py-5 pb-20">
        <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-white">Pay by Ride Code</h2>
          <p className="mt-1 text-sm text-white/45">Test code: {DRIVER_CODE} or 442.</p>
        </div>
        <Field label="DRIVER RIDE CODE" value={rideCode} onChange={(value) => setRideCode(value.toUpperCase())} placeholder="MSAIBR-442" />
        <Field label="AMOUNT" value={manualAmount} prefix="₦" onChange={(value) => setManualAmount(numericValue(value))} placeholder="200" />
        {fare > 0 ? (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/45">Ride fare</span><span>{formatMoney(fare)}</span></div>
              <div className="flex justify-between"><span className="text-white/45">Service charge</span><span>{formatMoney(SERVICE_FEE)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total deducted</span><span>{formatMoney(fare + SERVICE_FEE)}</span></div>
              <div className="flex justify-between text-green-400"><span>Driver receives</span><span>{formatMoney(fare)}</span></div>
            </CardContent>
          </Card>
        ) : null}
        <Button onClick={simulateManual} className="w-full">Confirm & Pay</Button>
      </div>
    );
  }

  if (screen === "processing") {
    return (
      <div className="flex min-h-[520px] items-center justify-center px-8 text-center">
        <div>
          <Loader2 className="mx-auto mb-4 size-10 animate-spin text-primary" />
          <p className="text-lg font-semibold text-white">Processing payment...</p>
          <p className="mt-2 text-sm text-white/45">Verifying ride code and crediting driver.</p>
        </div>
      </div>
    );
  }

  if (screen === "success" && pendingTx) {
    return (
      <div className="flex min-h-[520px] items-center justify-center px-6 text-center">
        <div className="w-full">
          <Check className="mx-auto mb-4 size-12 text-green-500" />
          <p className="text-lg font-semibold text-white">Payment successful</p>
          <p className="mt-2 text-4xl font-black text-primary">{formatMoney(pendingTx.amount)}</p>
          <Card className="mt-6 border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/45">Driver received</span><span className="text-green-400">{formatMoney(pendingTx.rideAmount ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-white/45">QRide fee</span><span>{formatMoney(SERVICE_FEE)}</span></div>
              <div className="flex justify-between"><span className="text-white/45">New balance</span><span>{formatMoney(user.balance)}</span></div>
            </CardContent>
          </Card>
          <Button onClick={reset} className="mt-6 w-full">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-5 py-5 pb-20">
      <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
        <ArrowLeft className="size-3.5" />
        Back
      </Button>
      <div>
        <h2 className="text-xl font-semibold text-white">Top Up Wallet</h2>
        <p className="mt-1 text-sm text-white/45">Add funds to your QRide wallet.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
          <Button
            key={amount}
            variant={topupAmount === String(amount) ? "default" : "secondary"}
            size="sm"
            onClick={() => setTopupAmount(String(amount))}
          >
            {formatMoney(amount)}
          </Button>
        ))}
      </div>
      <Field label="CUSTOM AMOUNT" value={topupAmount} prefix="₦" onChange={(value) => setTopupAmount(numericValue(value))} placeholder="0" />
      <Button
        onClick={async () => {
          const amount = Number(topupAmount);
          if (!amount || amount < 100) {
            showToast("Minimum top-up is ₦100.", "error");
            return;
          }
          setScreen("processing");
          await sleep(900);
          const transaction: Transaction = {
            id: Date.now(),
            type: "receive",
            label: "Wallet top-up",
            amount,
            method: "Bank Transfer",
            time: getTime(),
          };
          setUser((current) => ({
            ...current,
            balance: current.balance + amount,
            transactions: [transaction, ...current.transactions].slice(0, 20),
          }));
          setTopupAmount("");
          showToast(`${formatMoney(amount)} added to wallet.`, "success");
          setScreen("home");
        }}
      >
        Add {topupAmount ? formatMoney(Number(topupAmount)) : "Money"}
      </Button>
    </div>
  );
}
