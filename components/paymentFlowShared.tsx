"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import type { BalanceSummary } from "../lib/api";
import { getActiveProfile } from "../lib/activeProfile";
import { formatAccountNumber } from "../lib/account";
import { formatMoney } from "../lib/money";
import { NETWORKS, type Network } from "../lib/networks";
import { useFetch } from "../lib/useFetch";

export const MINIMUM_AMOUNT_KOBO = 10000;
export const DAILY_LIMIT_KOBO = 30000000;

/** Demo-only PIN, since there's no real auth backend to check against. */
export const DEMO_PIN = "1234";

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <Image
      src="https://res.cloudinary.com/dbmsazt7b/image/upload/v1789624481/Vector_2_kmrxwe.png"
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
    />
  );
}

/** A logo image on a neutral white badge, so mixed png/jpg/webp bank & network logos sit consistently regardless of their own background. */
export function LogoBadge({ src, name, size = 36 }: { src: string; name: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={name} width={size} height={size} className="h-full w-full object-contain p-1" />
    </span>
  );
}

export function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
      <button type="button" onClick={onBack} aria-label="Back" className="text-white">
        <BackIcon />
      </button>
      <h2 className="flex-1 text-center text-base font-[600] text-white">{title}</h2>
      <span className="w-5" aria-hidden="true" />
    </div>
  );
}

export function SignalIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4" />
    </svg>
  );
}

export function NetworksStep({
  onBack,
  onSelectNetwork,
}: {
  onBack: () => void;
  onSelectNetwork: (network: Network) => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StepHeader title="Select Network" onBack={onBack} />

      <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-6">
        {NETWORKS.map((network) => (
          <button
            key={network.id}
            type="button"
            onClick={() => onSelectNetwork(network)}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 py-6 transition-colors hover:bg-white/10"
          >
            <LogoBadge src={network.logoUrl} name={network.name} size={56} />
            <span className="text-sm font-[600] text-white">{network.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PayingFromCard({
  balance,
  strikeBalance,
}: {
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  strikeBalance?: boolean;
}) {
  const profile = getActiveProfile();

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFBF0D] text-sm font-[700] text-[#23297A]">
          {initials(profile.name)}
        </span>
        <p className="text-sm text-white">
          {profile.name} <span className="text-white/40">•</span> {formatAccountNumber(profile.accountNumber)}
        </p>
      </div>
      <p className={`mt-2 text-lg font-[700] text-white ${strikeBalance ? "line-through decoration-white/60" : ""}`}>
        {balance.status === "success" ? formatMoney(balance.data.balanceKobo) : balance.status === "loading" ? "…" : "—"}
      </p>
    </div>
  );
}

/** Keeps only digits and a single decimal point, capped at 2 decimal places (kobo). */
function sanitizeNairaInput(value: string): string {
  const digitsAndDots = value.replace(/[^\d.]/g, "");
  const firstDot = digitsAndDots.indexOf(".");
  if (firstDot === -1) return digitsAndDots;
  const whole = digitsAndDots.slice(0, firstDot + 1);
  const decimals = digitsAndDots.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
  return whole + decimals;
}

/**
 * A Naira amount input that accepts kobo (e.g. "5000.70"), not just whole Naira.
 * Tracks the raw typed text itself rather than reformatting from `amountKobo` on every
 * keystroke, so a trailing "." or a single trailing zero isn't clobbered mid-entry.
 */
export function AmountNairaInput({
  amountKobo,
  onChangeAmountKobo,
}: {
  amountKobo: number;
  onChangeAmountKobo: (kobo: number) => void;
}) {
  const [rawInput, setRawInput] = useState(() => (amountKobo === 0 ? "" : String(amountKobo / 100)));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const sanitized = sanitizeNairaInput(event.target.value);
    setRawInput(sanitized);
    const naira = sanitized === "" || sanitized === "." ? 0 : Number(sanitized);
    onChangeAmountKobo(Math.round(naira * 100));
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-3xl font-[700] text-white/50">₦</span>
        <input
          id="amount"
          inputMode="decimal"
          autoComplete="off"
          autoFocus
          value={rawInput}
          onChange={handleChange}
          placeholder="0"
          className="w-40 rounded-xl bg-transparent text-center text-4xl font-[700] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FFBF0D]"
        />
      </div>
      {rawInput !== "" && <p className="mt-1 text-center text-xs text-white/40">{formatMoney(amountKobo)}</p>}
    </>
  );
}

const PIN_LENGTH = 4;
const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"];

export function PinStep({
  onBack,
  onPinComplete,
  errorMessage,
  attempt,
}: {
  onBack: () => void;
  onPinComplete: (pin: string) => void;
  errorMessage: string | null;
  attempt: number;
}) {
  const [pin, setPin] = useState("");
  const [trackedAttempt, setTrackedAttempt] = useState(attempt);

  if (attempt !== trackedAttempt) {
    setTrackedAttempt(attempt);
    setPin("");
  }

  function pressKey(key: string) {
    if (key === "") return;
    if (key === "backspace") {
      setPin((current) => current.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;

    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) onPinComplete(next);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <StepHeader title="Authorize Payment" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center px-6 py-6">
        <h3 className="text-lg font-[700] text-white">Enter Transaction Pin</h3>
        <p className="mt-1 text-center text-sm text-white/50">To complete this transaction, enter your transaction PIN</p>

        <div className="mt-6 flex items-center gap-3" role="group" aria-label="Transaction PIN">
          {Array.from({ length: PIN_LENGTH }, (_, index) => {
            const isActive = index === pin.length;
            const isFilled = index < pin.length;
            return (
              <span
                key={index}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 text-2xl font-[700] text-white ${
                  isActive ? "border-[#FFBF0D]" : "border-transparent bg-white/10"
                }`}
              >
                {isFilled ? "•" : isActive ? <span className="animate-pulse">|</span> : ""}
              </span>
            );
          })}
        </div>

        <div className="mt-3 min-h-5" aria-live="assertive">
          {errorMessage && <p className="text-sm text-[#ec2d01]">{errorMessage}</p>}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {KEYPAD_KEYS.map((key, index) => {
            if (key === "") return <span key={index} />;
            return (
              <button
                key={index}
                type="button"
                onClick={() => pressKey(key)}
                aria-label={key === "backspace" ? "Delete" : key}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-[600] text-white transition-colors hover:bg-white/20"
              >
                {key === "backspace" ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 4H8l-6 8 6 8h13a1 1 0 001-1V5a1 1 0 00-1-1zM14 9l4 6M18 9l-4 6" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SuccessStep({
  title,
  detail,
  onDone,
}: {
  title: string;
  detail: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-400/20 text-green-400">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <h2 className="text-lg font-[700] text-white">{title}</h2>
      <p className="text-sm text-white/60">{detail}</p>
      <button
        type="button"
        onClick={onDone}
        className="mt-2 w-full rounded-full bg-[#FFBF0D] px-5 py-3.5 text-sm font-[700] text-[#23297A]"
      >
        Done
      </button>
    </div>
  );
}

export function SubmitFailedStep({
  title,
  onRetry,
  onClose,
}: {
  title: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ec2d01]/20 text-[#ec2d01]">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
      <h2 className="text-lg font-[700] text-white">{title}</h2>
      <p className="text-sm text-white/60">Your PIN was correct, but something went wrong sending this.</p>
      <div className="mt-2 flex w-full items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full bg-white/10 px-5 py-3.5 text-sm font-[700] text-white"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-full bg-[#FFBF0D] px-5 py-3.5 text-sm font-[700] text-[#23297A]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
