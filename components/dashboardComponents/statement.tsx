"use client";

import { useMemo, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import type { TransactionsResponse } from "../../lib/api";
import type { Transaction } from "../../lib/transaction";
import { useFetch } from "../../lib/useFetch";
import { TransactionRow } from "./transactionRow";

type TypeFilter = "all" | "credit" | "debit";
const ROW_HEIGHT = 72;
const LIST_HEIGHT = 480;

function StatementRow({ index, style, transactions }: RowComponentProps<{ transactions: Transaction[] }>) {
  return (
    <div style={style} className="border-b border-white/10 px-0.5">
      <TransactionRow transaction={transactions[index]} />
    </div>
  );
}

export default function Statement({ onBack }: { onBack: () => void }) {
  const transactions = useFetch<TransactionsResponse>("/api/transactions");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    if (transactions.status !== "success") return null;

    const query = search.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = toDate ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;

    return transactions.data.transactions.filter((transaction) => {
      if (typeFilter !== "all" && transaction.type !== typeFilter) return false;
      if (query && !transaction.description.toLowerCase().includes(query)) return false;

      const time = new Date(transaction.date).getTime();
      if (from !== null && time < from) return false;
      if (to !== null && time > to) return false;

      return true;
    });
  }, [transactions, search, typeFilter, fromDate, toDate]);

  return (
    <div className="w-full rounded-2xl bg-[#23297A] p-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Back" className="text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <h2 className="text-lg font-[600] text-white">Statement</h2>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, description..."
          className="w-full rounded bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFBF0D]"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        {(["all", "credit", "debit"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTypeFilter(option)}
            className={`rounded-full px-4 py-1.5 text-sm font-[600] capitalize transition-colors ${
              typeFilter === option ? "bg-[#FFBF0D] text-[#23297A]" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="flex-1 text-xs text-white/50">
          From
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[#FFBF0D]"
          />
        </label>
        <label className="flex-1 text-xs text-white/50">
          To
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-[#FFBF0D]"
          />
        </label>
      </div>

      {transactions.status === "loading" && (
        <div className="mt-4 flex flex-col divide-y divide-white/10" role="status">
          <span className="sr-only">Loading statement…</span>
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

      {filtered && filtered.length === 0 && (
        <p className="mt-6 py-4 text-center text-sm text-white/60">No matching transactions.</p>
      )}

      {filtered && filtered.length > 0 && (
        <div className="no-scrollbar mt-4">
          <List
            rowComponent={StatementRow}
            rowCount={filtered.length}
            rowHeight={ROW_HEIGHT}
            rowProps={{ transactions: filtered }}
            style={{ height: LIST_HEIGHT }}
          />
        </div>
      )}
    </div>
  );
}
