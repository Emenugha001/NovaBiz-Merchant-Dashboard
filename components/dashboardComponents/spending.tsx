"use client";

import { useMemo, useState } from "react";
import type { BalanceSummary, TransactionsResponse } from "../../lib/api";
import { isSameDay } from "../../lib/date";
import { formatMoney } from "../../lib/money";
import { useFetch } from "../../lib/useFetch";

const TABS = ["Today", "This week"] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export default function Spending({ refreshKey = 0 }: { refreshKey?: number }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Today");
  const [now] = useState(() => Date.now());
  const balance = useFetch<BalanceSummary>(`/api/balance?_r=${refreshKey}`);
  const transactions = useFetch<TransactionsResponse>(`/api/transactions?_r=${refreshKey}`);

  const outKobo = useMemo(() => {
    if (transactions.status !== "success") return null;

    const cutoff = now - 7 * DAY_MS;
    return transactions.data.transactions
      .filter((transaction) => {
        if (transaction.status !== "successful" || transaction.type !== "debit") return false;
        const time = new Date(transaction.date).getTime();
        return activeTab === "Today" ? isSameDay(time, now) : time >= cutoff;
      })
      .reduce((sum, transaction) => sum + transaction.amountKobo, 0);
  }, [transactions, activeTab, now]);

  return (
    <div className="w-full rounded-2xl bg-[#23297A] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-[600] text-white">Spending trends</h2>
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-sm font-[600] transition-colors ${
                activeTab === tab ? "bg-[#FFBF0D] text-[#23297A]" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {(balance.status === "loading" || transactions.status === "loading") && (
        <div className="mt-5 grid grid-cols-2 gap-3" role="status">
          <span className="sr-only">Loading spending trends…</span>
          <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
        </div>
      )}

      {(balance.status === "error" || transactions.status === "error") && (
        <div className="mt-5 flex flex-col items-center gap-2 py-2 text-center" role="alert">
          <p className="text-sm text-white/70">
            {balance.status === "error" ? balance.message : transactions.status === "error" ? transactions.message : ""}
          </p>
          <button
            type="button"
            onClick={() => {
              if (balance.status === "error") balance.retry();
              if (transactions.status === "error") transactions.retry();
            }}
            className="text-sm font-[600] text-[#FFBF0D] underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {balance.status === "success" && outKobo !== null && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-green-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
              </svg>
              <span className="text-sm font-[600]">Money in</span>
            </div>
            <p className="mt-2 text-lg font-[700] text-white">{formatMoney(balance.data.balanceKobo)}</p>
            <p className="mt-1 text-[11px] text-white/40">Current wallet balance</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-[#ec2d01]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M6 11l6-6 6 6" />
              </svg>
              <span className="text-sm font-[600]">Money out</span>
            </div>
            <p className="mt-2 text-lg font-[700] text-white">{formatMoney(outKobo)}</p>
            <p className="mt-1 text-[11px] text-white/40">{activeTab === "Today" ? "Today" : "Last 7 days"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
