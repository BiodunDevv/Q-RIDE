"use client";

import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Check,
  CreditCard,
  FileText,
  Hash,
  Loader2,
  Plus,
  Radio,
  ShieldAlert,
  Snowflake,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { NFCRipple } from "@/components/Prototype/nfc-ripple";
import { CardGallery } from "@/components/Prototype/card-gallery";
import {
  DRIVER_CODE,
  SERVICE_FEE,
  formatMoney,
  getDayGreeting,
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

type PassengerScreen =
  | "home"
  | "nfc"
  | "manual"
  | "processing"
  | "success"
  | "topup"
  | "cards"
  | "receipt";
type NfcPhase = "idle" | "ready" | "tapping" | "done";

type PassengerAppProps = {
  user: UserState;
  driver: DriverState;
  setUser: Dispatch<SetStateAction<UserState>>;
  setDriver: Dispatch<SetStateAction<DriverState>>;
  showToast: (message: string, type?: ToastType) => void;
};

const quickRideAmounts = [100, 150, 200, 250, 300, 500];

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
      driverName: driver.name,
      receiptId: `QR-${Date.now().toString().slice(-6)}`,
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
    if (user.walletFrozen || user.cardStatus !== "active") {
      showToast("Wallet or card is not active. Check Card Management.", "error");
      return;
    }

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

    if (user.walletFrozen) {
      showToast("Wallet is frozen. Unfreeze it in Card Management.", "error");
      return;
    }

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
      <div className="bg-neutral-50 pb-20 text-neutral-950">
        <div className="bg-white px-5 pt-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-neutral-500">
                {getDayGreeting()}
              </p>
              <h2 className="text-xl font-semibold text-neutral-950">
                {user.name.split(" ")[0]}
              </h2>
            </div>
            <Badge className="bg-green-100 text-green-700">TIER {user.tier}</Badge>
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
            <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-neutral-500">
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
            className="flex w-full items-center gap-3 border border-neutral-200 bg-white p-4 text-left"
          >
            <div className="flex size-10 items-center justify-center bg-neutral-100 text-neutral-950">
              <CreditCard className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-950">Top Up Wallet</p>
              <p className="text-xs text-neutral-500">Current balance: {formatMoney(user.balance)}</p>
            </div>
            <Plus className="size-4 text-neutral-500" />
          </button>

          <button
            onClick={() => setScreen("cards")}
            className="flex w-full items-center gap-3 border border-neutral-200 bg-white p-4 text-left"
          >
            <div className="flex size-10 items-center justify-center bg-primary/10 text-primary">
              <BadgeCheck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-950">Card Management</p>
              <p className="text-xs text-neutral-500">
                {user.walletFrozen ? "Wallet frozen" : `Card status: ${user.cardStatus}`}
              </p>
            </div>
          </button>

          {user.transactions.length ? (
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.1em] text-neutral-500">
                RECENT
              </p>
              {user.transactions.slice(0, 4).map((transaction) => (
                <button
                  key={transaction.id}
                  type="button"
                  onClick={() => {
                    if (transaction.type === "send" && transaction.receiptId) {
                      setPendingTx(transaction);
                      setScreen("receipt");
                    }
                  }}
                  className="block w-full text-left"
                >
                  <TransactionRow transaction={transaction} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "nfc") {
    return (
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={reset}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">Tap to Pay</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Driver activates terminal, you hold your QRide card.
          </p>
        </div>

        <Card className="border-neutral-200 bg-white text-neutral-950">
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Ride fare</span>
              <span>{formatMoney(rideFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Service charge</span>
              <span>+{formatMoney(SERVICE_FEE)}</span>
            </div>
            <Separator className="bg-neutral-200" />
            <div className="flex justify-between text-sm font-semibold">
              <span>You pay</span>
              <span className="text-primary">{formatMoney(totalPay)}</span>
            </div>
          </CardContent>
        </Card>

        {nfcPhase === "idle" ? (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-neutral-500">
                QUICK FARE
              </p>
              <div className="grid grid-cols-3 gap-2">
                {quickRideAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    size="sm"
                    variant={rideAmount === String(amount) ? "default" : "outline"}
                    onClick={() => setRideAmount(String(amount))}
                    className="h-8 px-2 text-xs"
                  >
                    {formatMoney(amount)}
                  </Button>
                ))}
              </div>
            </div>
            <Field
              label="CUSTOM RIDE AMOUNT"
              value={rideAmount}
              prefix="₦"
              onChange={(value) => setRideAmount(numericValue(value))}
              placeholder="200"
            />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-5 border border-neutral-200 bg-white p-6">
          <NFCRipple active={nfcPhase === "ready" || nfcPhase === "tapping"} success={nfcResult === "success"} fail={nfcResult === "fail"} />

          {nfcPhase === "idle" ? (
            <>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-950">Ready to tap</p>
                <p className="mt-1 text-xs text-neutral-500">Activate the reader, then place your card.</p>
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
              <p className="text-sm font-semibold text-neutral-950">Reading card...</p>
            </div>
          ) : null}

          {nfcPhase === "done" && nfcResult === "success" && pendingTx ? (
            <div className="w-full text-center">
              <Check className="mx-auto mb-3 size-10 text-green-500" />
              <p className="text-sm font-semibold text-green-500">Payment successful</p>
              <p className="mt-2 text-3xl font-black text-neutral-950">{formatMoney(pendingTx.amount)}</p>
              <p className="mt-1 text-xs text-neutral-500">
                Driver receives {formatMoney(pendingTx.rideAmount ?? 0)} · QRide fee {formatMoney(SERVICE_FEE)}
              </p>
              <div className="mt-5 grid gap-2">
                <Button onClick={() => setScreen("receipt")} className="w-full">
                  <FileText className="size-4" />
                  View receipt
                </Button>
                <Button onClick={reset} variant="outline" className="w-full">Done</Button>
              </div>
            </div>
          ) : null}

          {nfcPhase === "done" && nfcResult === "fail" ? (
            <div className="w-full text-center">
              <p className="text-sm font-semibold text-red-400">Payment failed</p>
              <p className="mt-2 text-xs text-neutral-500">{failReason}</p>
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
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">Pay by Ride Code</h2>
          <p className="mt-1 text-sm text-neutral-500">Test code: {DRIVER_CODE} or 442.</p>
        </div>
        <Field label="DRIVER RIDE CODE" value={rideCode} onChange={(value) => setRideCode(value.toUpperCase())} placeholder="MSAIBR-442" />
        <Field label="AMOUNT" value={manualAmount} prefix="₦" onChange={(value) => setManualAmount(numericValue(value))} placeholder="200" />
        {fare > 0 ? (
          <Card className="border-neutral-200 bg-white text-neutral-950">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Ride fare</span><span>{formatMoney(fare)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Service charge</span><span>{formatMoney(SERVICE_FEE)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total deducted</span><span>{formatMoney(fare + SERVICE_FEE)}</span></div>
              <div className="flex justify-between text-green-600"><span>Driver receives</span><span>{formatMoney(fare)}</span></div>
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
          <p className="text-lg font-semibold text-neutral-950">Processing payment...</p>
          <p className="mt-2 text-sm text-neutral-500">Verifying ride code and crediting driver.</p>
        </div>
      </div>
    );
  }

  if (screen === "success" && pendingTx) {
    return (
      <div className="flex min-h-[520px] items-center justify-center bg-neutral-50 px-6 text-center">
        <div className="w-full">
          <Check className="mx-auto mb-4 size-12 text-green-500" />
          <p className="text-lg font-semibold text-neutral-950">Payment successful</p>
          <p className="mt-2 text-4xl font-black text-primary">{formatMoney(pendingTx.amount)}</p>
          <Card className="mt-6 border-neutral-200 bg-white text-neutral-950">
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Driver received</span><span className="text-green-600">{formatMoney(pendingTx.rideAmount ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">QRide fee</span><span>{formatMoney(SERVICE_FEE)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">New balance</span><span>{formatMoney(user.balance)}</span></div>
            </CardContent>
          </Card>
          <div className="mt-6 grid gap-2">
            <Button onClick={() => setScreen("receipt")} className="w-full">
              <FileText className="size-4" />
              View receipt
            </Button>
            <Button onClick={reset} variant="outline" className="w-full">Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "receipt" && pendingTx) {
    return (
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Ride Receipt</h2>
          <p className="mt-1 text-sm text-neutral-500">{pendingTx.receiptId}</p>
        </div>
        <Card className="border-neutral-200 bg-white">
          <CardContent className="space-y-3 text-sm">
            {[
              ["Driver", pendingTx.driverName ?? driver.name],
              ["Time", pendingTx.time],
              ["Method", pendingTx.method],
              ["Fare", formatMoney(pendingTx.rideAmount ?? 0)],
              ["Service fee", formatMoney(pendingTx.service ?? SERVICE_FEE)],
              ["Total paid", formatMoney(pendingTx.amount)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-neutral-500">{label}</span>
                <span className="text-right font-medium text-neutral-950">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {pendingTx.disputed ? (
          <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Dispute submitted. Support will review this receipt.
          </div>
        ) : null}
        <Button
          variant="outline"
          onClick={() => {
            setPendingTx((current) => current ? { ...current, disputed: true } : current);
            setUser((current) => ({
              ...current,
              transactions: current.transactions.map((transaction) =>
                transaction.id === pendingTx.id
                  ? { ...transaction, disputed: true }
                  : transaction
              ),
            }));
            showToast("Dispute submitted for review.", "success");
          }}
          className="w-full"
        >
          <ShieldAlert className="size-4" />
          Report a dispute
        </Button>
      </div>
    );
  }

  if (screen === "cards") {
    return (
      <div className="space-y-5 bg-neutral-50 px-5 py-5 pb-20 text-neutral-950">
        <Button size="sm" variant="secondary" onClick={() => setScreen("home")}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Card Management</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage linked QRide cards, wallet safety, and issuance status.
          </p>
        </div>

        <Card className="border-neutral-200 bg-white">
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Linked card</p>
                <p className="text-xs text-neutral-500">{user.card}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">{user.cardStatus}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Wallet safety</p>
                <p className="text-xs text-neutral-500">
                  {user.walletFrozen ? "Payments are paused" : "Payments are enabled"}
                </p>
              </div>
              <Badge variant="outline">{user.walletFrozen ? "Frozen" : "Live"}</Badge>
            </div>
          </CardContent>
        </Card>

        <CardGallery cardStatus={user.cardStatus} />

        <div className="grid gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setUser((current) => ({ ...current, walletFrozen: !current.walletFrozen }));
              showToast(user.walletFrozen ? "Wallet unfrozen." : "Wallet frozen.", "success");
            }}
          >
            <Snowflake className="size-4" />
            {user.walletFrozen ? "Unfreeze wallet" : "Freeze wallet"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUser((current) => ({
                ...current,
                cardStatus: current.cardStatus === "blocked" ? "active" : "blocked",
              }));
              showToast(user.cardStatus === "blocked" ? "Card reactivated." : "Card blocked.", "success");
            }}
          >
            <Ban className="size-4" />
            {user.cardStatus === "blocked" ? "Reactivate card" : "Block card"}
          </Button>
          <Button
            onClick={() => {
              setUser((current) => ({ ...current, cardStatus: "replacement" }));
              showToast("Replacement card request created.", "success");
            }}
          >
            <CreditCard className="size-4" />
            Replace card
          </Button>
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
        <h2 className="text-xl font-semibold text-neutral-950">Top Up Wallet</h2>
        <p className="mt-1 text-sm text-neutral-500">Add funds to your QRide wallet.</p>
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
