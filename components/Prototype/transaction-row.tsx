import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { formatMoney, type Transaction } from "@/components/Prototype/prototype-data";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isSend = transaction.type === "send";
  const Icon = isSend ? ArrowUpRight : ArrowDownLeft;

  return (
    <div className="flex items-center justify-between border-b border-white/8 py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={[
            "flex size-9 shrink-0 items-center justify-center",
            isSend ? "bg-primary/15 text-primary" : "bg-green-500/15 text-green-500",
          ].join(" ")}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{transaction.label}</p>
          <p className="mt-0.5 text-xs text-white/42">
            {transaction.time} · {transaction.method}
          </p>
        </div>
      </div>
      <p
        className={[
          "shrink-0 text-sm font-semibold",
          isSend ? "text-red-400" : "text-green-400",
        ].join(" ")}
      >
        {isSend ? "-" : "+"}
        {formatMoney(transaction.amount)}
      </p>
    </div>
  );
}
