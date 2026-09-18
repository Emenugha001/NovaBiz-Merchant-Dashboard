"use client";

import { useState } from "react";
import type { BalanceSummary, ResolveAccountResponse, SendMoneyRequest, SendMoneyResponse } from "../../lib/api";
import { formatAccountNumber } from "../../lib/account";
import { BANKS, RECENT_BANK_IDS, type Bank } from "../../lib/banks";
import { formatMoney } from "../../lib/money";
import { useFetch } from "../../lib/useFetch";
import {
  AmountNairaInput,
  ChevronRightIcon,
  CloseIcon,
  DAILY_LIMIT_KOBO,
  DEMO_PIN,
  LogoBadge,
  MINIMUM_AMOUNT_KOBO,
  PayingFromCard,
  PinStep,
  StepHeader,
  SubmitFailedStep,
  SuccessStep,
} from "../paymentFlowShared";

type Step = "form" | "banks" | "confirm" | "amount" | "pin" | "success" | "submit-failed";

function BankIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-6 9 6" />
      <path strokeLinecap="round" d="M4 10v9M9 10v9M15 10v9M20 10v9M2 21h20" />
    </svg>
  );
}

export default function HeroTransfer({
  onClose,
  onTransferComplete,
}: {
  onClose: () => void;
  onTransferComplete: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [amountKobo, setAmountKobo] = useState(0);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const balance = useFetch<BalanceSummary>("/api/balance");

  const isAccountNumberComplete = accountNumber.length === 10;

  function handleSelectBank(bank: Bank) {
    setSelectedBank(bank);
    setStep("confirm");
  }

  function submitTransfer() {
    // Optimistic: show success immediately, reconcile below if the request actually fails.
    setStep("success");

    const body: SendMoneyRequest = { description: `Transfer to ${recipientName}`, amountKobo };
    fetch("/api/send-money", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<SendMoneyResponse>;
      })
      .then(() => onTransferComplete())
      .catch(() => setStep("submit-failed"));
  }

  function handlePinComplete(pin: string) {
    if (pin === DEMO_PIN) {
      setPinError(null);
      submitTransfer();
    } else {
      setPinError("Incorrect PIN. Please try again.");
      setPinAttempt((attempt) => attempt + 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[#23297A] sm:max-w-md sm:rounded-3xl">
        {step === "form" && (
          <FormStep
            balance={balance}
            accountNumber={accountNumber}
            onChangeAccountNumber={setAccountNumber}
            selectedBank={selectedBank}
            onSelectBankClick={() => setStep("banks")}
            isAccountNumberComplete={isAccountNumberComplete}
            onClose={onClose}
          />
        )}

        {step === "banks" && <BanksStep onBack={() => setStep("form")} onSelectBank={handleSelectBank} />}

        {step === "confirm" && selectedBank && (
          <ConfirmStep
            accountNumber={accountNumber}
            bank={selectedBank}
            onBack={() => setStep("form")}
            onChange={() => setStep("form")}
            onConfirm={(name) => {
              setRecipientName(name);
              setStep("amount");
            }}
          />
        )}

        {step === "amount" && selectedBank && (
          <AmountStep
            recipientName={recipientName}
            bank={selectedBank}
            balance={balance}
            amountKobo={amountKobo}
            onChangeAmountKobo={setAmountKobo}
            onBack={() => setStep("confirm")}
            onContinue={() => setStep("pin")}
          />
        )}

        {step === "pin" && (
          <PinStep
            onBack={() => setStep("amount")}
            onPinComplete={handlePinComplete}
            errorMessage={pinError}
            attempt={pinAttempt}
          />
        )}

        {step === "success" && (
          <SuccessStep
            title="Transfer successful"
            detail={`${formatMoney(amountKobo)} was sent to ${recipientName}`}
            onDone={onClose}
          />
        )}

        {step === "submit-failed" && (
          <SubmitFailedStep title="Transfer didn't go through" onRetry={() => setStep("pin")} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function FormStep({
  balance,
  accountNumber,
  onChangeAccountNumber,
  selectedBank,
  onSelectBankClick,
  isAccountNumberComplete,
  onClose,
}: {
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  accountNumber: string;
  onChangeAccountNumber: (value: string) => void;
  selectedBank: Bank | null;
  onSelectBankClick: () => void;
  isAccountNumberComplete: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-[600] text-white">Send Money</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="text-white/70 hover:text-white">
          <CloseIcon />
        </button>
      </div>

      <p className="mt-6 text-sm text-white/50">Paying from</p>
      <div className="mt-2">
        <PayingFromCard balance={balance} />
      </div>

      <label htmlFor="recipient-account" className="mt-6 block text-sm text-white/50">
        Enter recipient&apos;s account number
      </label>
      <div className="relative mt-2">
        <input
          id="recipient-account"
          inputMode="numeric"
          autoComplete="off"
          value={formatAccountNumber(accountNumber)}
          onChange={(event) => onChangeAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="000 000 0000"
          className="w-full rounded-2xl border-2 border-transparent bg-white/5 px-5 py-4 text-2xl font-[700] tracking-widest text-white placeholder:text-white/20 focus:border-[#FFBF0D] focus:outline-none"
        />
        {accountNumber.length > 0 && (
          <button
            type="button"
            onClick={() => onChangeAccountNumber("")}
            aria-label="Clear account number"
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <p className="mt-6 text-sm text-white/50">Select recipient&apos;s bank</p>
      <button
        type="button"
        onClick={onSelectBankClick}
        disabled={!isAccountNumberComplete}
        className="mt-2 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-left transition-opacity disabled:opacity-40"
      >
        <span className="flex items-center gap-3">
          {selectedBank ? (
            <LogoBadge src={selectedBank.logoUrl} name={selectedBank.name} size={36} />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              <BankIcon />
            </span>
          )}
          <span className="text-base font-[600] text-white">{selectedBank ? selectedBank.name : "Select Bank"}</span>
        </span>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

function BanksStep({ onBack, onSelectBank }: { onBack: () => void; onSelectBank: (bank: Bank) => void }) {
  const recentBanks = RECENT_BANK_IDS.map((id) => BANKS.find((bank) => bank.id === id)).filter(
    (bank): bank is Bank => Boolean(bank)
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StepHeader title="Banks" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-sm text-white/50">Recent</p>
        <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto">
          {recentBanks.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank)}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <LogoBadge src={bank.logoUrl} name={bank.name} size={48} />
              <span className="max-w-[64px] truncate text-xs text-white/70">{bank.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-white/50">All Institutions</p>
        <div className="mt-2 flex flex-col divide-y divide-white/10">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank)}
              className="flex items-center justify-between py-3 text-left"
            >
              <span className="flex items-center gap-3">
                <LogoBadge src={bank.logoUrl} name={bank.name} size={36} />
                <span className="text-sm font-[600] text-white">{bank.name}</span>
              </span>
              <ChevronRightIcon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmStep({
  accountNumber,
  bank,
  onBack,
  onChange,
  onConfirm,
}: {
  accountNumber: string;
  bank: Bank;
  onBack: () => void;
  onChange: () => void;
  onConfirm: (recipientName: string) => void;
}) {
  const [saveRecipient, setSaveRecipient] = useState(false);
  const resolved = useFetch<ResolveAccountResponse>(
    `/api/resolve-account?accountNumber=${accountNumber}&bankId=${bank.id}`
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <StepHeader title="Confirm Recipient" onBack={onBack} />

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-center text-lg font-[700] text-white">Confirm it&apos;s the right recipient</h2>

        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-6">
          <LogoBadge src={bank.logoUrl} name={bank.name} size={56} />

          {resolved.status === "loading" && (
            <div className="mt-2 flex flex-col items-center gap-2" role="status">
              <span className="sr-only">Verifying recipient…</span>
              <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>
          )}

          {resolved.status === "error" && (
            <div className="mt-2 flex flex-col items-center gap-2 text-center" role="alert">
              <p className="text-sm text-white/70">{resolved.message}</p>
              <button
                type="button"
                onClick={resolved.retry}
                className="text-sm font-[600] text-[#FFBF0D] underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {resolved.status === "success" && (
            <>
              <p className="text-base font-[700] text-[#FFBF0D]">{resolved.data.name}</p>
              <p className="text-sm font-[600] text-white">{bank.name}</p>
              <p className="text-sm font-[700] text-white">{formatAccountNumber(accountNumber)}</p>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-white/70">Save recipient?</span>
          <button
            type="button"
            role="switch"
            aria-checked={saveRecipient}
            aria-label="Save recipient"
            onClick={() => setSaveRecipient((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              saveRecipient ? "bg-[#FFBF0D]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                saveRecipient ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onChange}
            className="flex-1 rounded-full bg-white/10 px-5 py-3 text-sm font-[700] text-white transition-colors hover:bg-white/20"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => resolved.status === "success" && onConfirm(resolved.data.name)}
            disabled={resolved.status !== "success"}
            className="flex-1 rounded-full bg-[#FFBF0D] px-5 py-3 text-sm font-[700] text-[#23297A] transition-opacity disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function AmountStep({
  recipientName,
  bank,
  balance,
  amountKobo,
  onChangeAmountKobo,
  onBack,
  onContinue,
}: {
  recipientName: string;
  bank: Bank;
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  amountKobo: number;
  onChangeAmountKobo: (kobo: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  let hint: string | null = null;
  if (amountKobo === 0 || amountKobo < MINIMUM_AMOUNT_KOBO) {
    hint = `Enter an amount above ${formatMoney(MINIMUM_AMOUNT_KOBO)}`;
  } else if (amountKobo > DAILY_LIMIT_KOBO) {
    hint = "This exceeds your daily limit";
  } else if (balance.status === "success" && amountKobo > balance.data.balanceKobo) {
    hint = "Insufficient balance";
  } else if (balance.status === "loading") {
    hint = "Checking your balance…";
  } else if (balance.status === "error") {
    hint = "Couldn't check your balance.";
  }

  const isValid = hint === null && balance.status === "success";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <StepHeader title="Add amount" onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-center text-sm text-white/50">
          To{" "}
          <span className="ml-1 inline-flex items-center gap-1.5 align-middle">
            <LogoBadge src={bank.logoUrl} name={bank.name} size={20} />
            <span className="text-sm font-[600] text-white">{recipientName}</span>
          </span>
        </p>

        <label htmlFor="amount" className="sr-only">
          Amount in Naira
        </label>
        <AmountNairaInput amountKobo={amountKobo} onChangeAmountKobo={onChangeAmountKobo} />

        {hint && (
          <p className="mt-2 text-center text-xs text-white/50">
            {hint}
            {balance.status === "error" && (
              <button
                type="button"
                onClick={balance.retry}
                className="ml-1.5 font-[600] text-[#FFBF0D] underline underline-offset-2"
              >
                Retry
              </button>
            )}
          </p>
        )}

        <div className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white/70">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
          </svg>
          <span className="flex-1">Daily limit left to spend: {formatMoney(DAILY_LIMIT_KOBO)}</span>
          <ChevronRightIcon />
        </div>

        <div className="mt-auto pt-8">
          <p className="text-sm text-white/50">Paying from</p>
          <div className="mt-2">
            <PayingFromCard balance={balance} strikeBalance />
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={!isValid}
            className="mt-4 w-full rounded-full bg-[#FFBF0D] px-5 py-3.5 text-sm font-[700] text-[#23297A] transition-opacity disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
