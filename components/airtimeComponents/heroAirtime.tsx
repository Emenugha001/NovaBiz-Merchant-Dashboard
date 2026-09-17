"use client";

import { useState } from "react";
import type { BalanceSummary, SendMoneyRequest, SendMoneyResponse } from "../../lib/api";
import { formatMoney } from "../../lib/money";
import type { Network } from "../../lib/networks";
import { formatPhoneNumber } from "../../lib/phone";
import { useFetch } from "../../lib/useFetch";
import {
  ChevronRightIcon,
  CloseIcon,
  DAILY_LIMIT_KOBO,
  DEMO_PIN,
  LogoBadge,
  MINIMUM_AMOUNT_KOBO,
  NetworksStep,
  PayingFromCard,
  PinStep,
  SignalIcon,
  StepHeader,
  SubmitFailedStep,
  SuccessStep,
} from "../paymentFlowShared";

type Step = "form" | "networks" | "amount" | "pin" | "success" | "submit-failed";

export default function HeroAirtime({
  onClose,
  onTransferComplete,
}: {
  onClose: () => void;
  onTransferComplete: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [amountKobo, setAmountKobo] = useState(0);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const balance = useFetch<BalanceSummary>("/api/balance");

  const isPhoneNumberComplete = phoneNumber.length === 11;

  function handleSelectNetwork(network: Network) {
    setSelectedNetwork(network);
    setStep("amount");
  }

  function submitPurchase() {
    if (!selectedNetwork) return;
    // Optimistic: show success immediately, reconcile below if the request actually fails.
    setStep("success");

    const body: SendMoneyRequest = {
      description: `Airtime - ${selectedNetwork.name} (${formatPhoneNumber(phoneNumber)})`,
      amountKobo,
    };
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
      submitPurchase();
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
            phoneNumber={phoneNumber}
            onChangePhoneNumber={setPhoneNumber}
            selectedNetwork={selectedNetwork}
            onSelectNetworkClick={() => setStep("networks")}
            isPhoneNumberComplete={isPhoneNumberComplete}
            onClose={onClose}
          />
        )}

        {step === "networks" && <NetworksStep onBack={() => setStep("form")} onSelectNetwork={handleSelectNetwork} />}

        {step === "amount" && selectedNetwork && (
          <AmountStep
            phoneNumber={phoneNumber}
            network={selectedNetwork}
            balance={balance}
            amountKobo={amountKobo}
            onChangeAmountKobo={setAmountKobo}
            onBack={() => setStep("form")}
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

        {step === "success" && selectedNetwork && (
          <SuccessStep
            title="Airtime purchase successful"
            detail={`${formatMoney(amountKobo)} ${selectedNetwork.name} airtime sent to ${formatPhoneNumber(phoneNumber)}`}
            onDone={onClose}
          />
        )}

        {step === "submit-failed" && (
          <SubmitFailedStep title="Purchase didn't go through" onRetry={submitPurchase} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function FormStep({
  balance,
  phoneNumber,
  onChangePhoneNumber,
  selectedNetwork,
  onSelectNetworkClick,
  isPhoneNumberComplete,
  onClose,
}: {
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  phoneNumber: string;
  onChangePhoneNumber: (value: string) => void;
  selectedNetwork: Network | null;
  onSelectNetworkClick: () => void;
  isPhoneNumberComplete: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-[600] text-white">Buy Airtime</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="text-white/70 hover:text-white">
          <CloseIcon />
        </button>
      </div>

      <p className="mt-6 text-sm text-white/50">Paying from</p>
      <div className="mt-2">
        <PayingFromCard balance={balance} />
      </div>

      <label htmlFor="phone-number" className="mt-6 block text-sm text-white/50">
        Enter phone number
      </label>
      <div className="relative mt-2">
        <input
          id="phone-number"
          inputMode="numeric"
          autoComplete="off"
          value={formatPhoneNumber(phoneNumber)}
          onChange={(event) => onChangePhoneNumber(event.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="0000 000 0000"
          className="w-full rounded-2xl border-2 border-transparent bg-white/5 px-5 py-4 text-2xl font-[700] tracking-widest text-white placeholder:text-white/20 focus:border-[#FFBF0D] focus:outline-none"
        />
        {phoneNumber.length > 0 && (
          <button
            type="button"
            onClick={() => onChangePhoneNumber("")}
            aria-label="Clear phone number"
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <p className="mt-6 text-sm text-white/50">Select network</p>
      <button
        type="button"
        onClick={onSelectNetworkClick}
        disabled={!isPhoneNumberComplete}
        className="mt-2 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-left transition-opacity disabled:opacity-40"
      >
        <span className="flex items-center gap-3">
          {selectedNetwork ? (
            <LogoBadge src={selectedNetwork.logoUrl} name={selectedNetwork.name} size={36} />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              <SignalIcon />
            </span>
          )}
          <span className="text-base font-[600] text-white">{selectedNetwork ? selectedNetwork.name : "Select Network"}</span>
        </span>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

function AmountStep({
  phoneNumber,
  network,
  balance,
  amountKobo,
  onChangeAmountKobo,
  onBack,
  onContinue,
}: {
  phoneNumber: string;
  network: Network;
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  amountKobo: number;
  onChangeAmountKobo: (kobo: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const amountNaira = Math.floor(amountKobo / 100);

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
            <LogoBadge src={network.logoUrl} name={network.name} size={20} />
            <span className="text-sm font-[600] text-white">{formatPhoneNumber(phoneNumber)}</span>
          </span>
        </p>

        <label htmlFor="amount" className="sr-only">
          Amount in Naira
        </label>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-3xl font-[700] text-white/50">₦</span>
          <input
            id="amount"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={amountNaira === 0 ? "" : amountNaira.toLocaleString("en-US")}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
              onChangeAmountKobo(digits ? Number(digits) * 100 : 0);
            }}
            placeholder="0"
            className="w-40 rounded-xl bg-transparent text-center text-4xl font-[700] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FFBF0D]"
          />
        </div>

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
