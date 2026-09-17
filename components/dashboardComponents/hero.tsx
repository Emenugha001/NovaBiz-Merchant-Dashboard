"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { BalanceSummary } from "../../lib/api";
import { getActiveProfile } from "../../lib/activeProfile";
import { formatAccountNumber } from "../../lib/account";
import { formatMoneyParts } from "../../lib/money";
import { formatRelativeTime } from "../../lib/relativeTime";
import { useFetch } from "../../lib/useFetch";

export default function Overview({
  refreshKey = 0,
  onHistoryClick,
}: {
  refreshKey?: number;
  onHistoryClick?: () => void;
}) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const balance = useFetch<BalanceSummary>(`/api/balance?_r=${refreshKey}`);
  const profile = getActiveProfile();

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCopy() {
    navigator.clipboard
      .writeText(profile.accountNumber)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard access denied/unavailable — nothing else to do here.
      });
  }

  const balanceParts = balance.status === "success" ? formatMoneyParts(balance.data.balanceKobo) : null;

  return (
    <div className="w-full rounded-2xl bg-[#23297A] p-8 shadow-sm mt-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-[600] text-white">
          {formatAccountNumber(profile.accountNumber)} | {profile.name}
        </p>
        <div className="relative shrink-0">
          <button type="button" onClick={handleCopy} aria-label="Copy account number" className="text-white">
            <Image
              src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789573595/Group_rvd9a1.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain mix-blend-multiply"
            />
          </button>
          {isCopied && (
            <span
              role="status"
              className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-[600] text-[#23297A] shadow"
            >
              Copied!
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex min-h-11 items-center gap-3" aria-live="polite">
        {balance.status === "loading" && (
          <div className="h-9 w-40 animate-pulse rounded bg-white/10" role="status">
            <span className="sr-only">Loading balance…</span>
          </div>
        )}

        {balance.status === "error" && (
          <div className="flex items-center gap-3" role="alert">
            <p className="text-sm text-white/70">{balance.message}</p>
            <button
              type="button"
              onClick={balance.retry}
              className="text-sm font-[600] text-[#FFBF0D] underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {balanceParts && (
          <>
            <p className="text-4xl font-[700] text-white">
              {isBalanceHidden ? (
                "₦**,***.**"
              ) : (
                <>
                  <span>{balanceParts.symbol}</span>
                  <span className="ml-2">{balanceParts.rest}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setIsBalanceHidden((prev) => !prev)}
              aria-label={isBalanceHidden ? "Show balance" : "Hide balance"}
              className="text-white"
            >
              {isBalanceHidden ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a13.2 13.2 0 01-1.6 2.9M6.6 6.6C4.4 8 2.9 10 2 12c1 4 5 8 10 8 1.35 0 2.63-.28 3.8-.78" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      <p className="mt-4 text-sm text-white/60">
        {balance.status === "success" ? `Last updated ${formatRelativeTime(balance.updatedAt, now)}` : " "}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-[600] text-white transition-colors hover:bg-white/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Add Money
        </button>
        <button
          type="button"
          onClick={onHistoryClick}
          className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-[600] text-white transition-colors hover:bg-white/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          History
        </button>
      </div>
    </div>
  );
}
