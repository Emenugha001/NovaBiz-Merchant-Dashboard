"use client";

import { useMemo, useState } from "react";
import type { TransactionsResponse } from "../../lib/api";
import { useFetch } from "../../lib/useFetch";
import { TransactionRow } from "./transactionRow";

const WINDOW_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export default function RecentTransactions({ onBack }: { onBack: () => void }) {
  const [now] = useState(() => Date.now());
  const transactions = useFetch<TransactionsResponse>("/api/transactions");

  const recent = useMemo(() => {
    if (transactions.status !== "success") return null;
    const cutoff = now - WINDOW_DAYS * DAY_MS;
    return transactions.data.transactions.filter((transaction) => new Date(transaction.date).getTime() >= cutoff);
  }, [transactions, now]);

  return (
    <div className="w-full rounded-2xl bg-[#23297A] p-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Back" className="text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <h2 className="text-lg font-[600] text-white">Transactions (last 5 days)</h2>
      </div>

      {transactions.status === "loading" && (
        <div className="mt-4 flex flex-col divide-y divide-white/10" role="status">
          <span className="sr-only">Loading transactions…</span>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="h-3.5 w-32 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.status === "error" && (
        <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center" role="alert">
          <p className="text-sm text-white/70">{transactions.message}</p>
          <button
            type="button"
            onClick={transactions.retry}
            className="text-sm font-[600] text-[#FFBF0D] underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {recent && recent.length === 0 && (
        <p className="mt-6 py-4 text-center text-sm text-white/60">No transactions in the last 5 days.</p>
      )}

      {recent && recent.length > 0 && (
        <div className="mt-4 flex flex-col divide-y divide-white/10">
          {recent.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}
