import { formatTransactionDate } from "../../lib/date";
import { formatMoney } from "../../lib/money";
import type { Transaction } from "../../lib/transaction";

export function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "successful") return null;

  const isFailed = status === "failed";
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[10px] font-[700] uppercase tracking-wide ${
        isFailed ? "bg-[#ec2d01]/20 text-[#ec2d01]" : "bg-amber-400/20 text-amber-300"
      }`}
    >
      {status}
    </span>
  );
}

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === "credit";

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isCredit ? "bg-green-400 text-[#23297A]" : "bg-[#FFBF0D] text-[#23297A]"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {isCredit ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7 7 17M7 17h6M7 17v-6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7h-6M17 7v6" />
            )}
          </svg>
        </span>
        <div>
          <p className="text-sm font-[600] text-white">{transaction.description}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-white/50">{formatTransactionDate(transaction.date)}</p>
            <StatusBadge status={transaction.status} />
          </div>
        </div>
      </div>
      <p className={`text-sm font-[600] ${isCredit ? "text-green-400" : "text-white"}`}>
        {isCredit ? "+" : "-"}
        {formatMoney(transaction.amountKobo)}
      </p>
    </div>
  );
}
