"use client";

import { useState } from "react";
import type { BalanceSummary, SendMoneyRequest, SendMoneyResponse } from "../../lib/api";
import { DATA_PLANS, type DataPlan } from "../../lib/dataPlans";
import { formatMoney } from "../../lib/money";
import type { Network } from "../../lib/networks";
import { formatPhoneNumber } from "../../lib/phone";
import { useFetch } from "../../lib/useFetch";
import {
  ChevronRightIcon,
  CloseIcon,
  DEMO_PIN,
  LogoBadge,
  NetworksStep,
  PayingFromCard,
  PinStep,
  SignalIcon,
  StepHeader,
  SubmitFailedStep,
  SuccessStep,
} from "../paymentFlowShared";

type Step = "form" | "networks" | "plans" | "confirm" | "pin" | "success" | "submit-failed";

export default function HeroData({
  onClose,
  onTransferComplete,
}: {
  onClose: () => void;
  onTransferComplete: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const balance = useFetch<BalanceSummary>("/api/balance");

  const isPhoneNumberComplete = phoneNumber.length === 11;

  function handleSelectNetwork(network: Network) {
    setSelectedNetwork(network);
    setStep("plans");
  }

  function handleSelectPlan(plan: DataPlan) {
    setSelectedPlan(plan);
    setStep("confirm");
  }

  function submitPurchase() {
    if (!selectedNetwork || !selectedPlan) return;
    // Optimistic: show success immediately, reconcile below if the request actually fails.
    setStep("success");

    const body: SendMoneyRequest = {
      description: `${selectedPlan.label} Data - ${selectedNetwork.name} (${formatPhoneNumber(phoneNumber)})`,
      amountKobo: selectedPlan.priceKobo,
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

        {step === "plans" && <PlansStep onBack={() => setStep("form")} onSelectPlan={handleSelectPlan} />}

        {step === "confirm" && selectedNetwork && selectedPlan && (
          <ConfirmStep
            phoneNumber={phoneNumber}
            network={selectedNetwork}
            plan={selectedPlan}
            balance={balance}
            onBack={() => setStep("plans")}
            onContinue={() => setStep("pin")}
          />
        )}

        {step === "pin" && (
          <PinStep
            onBack={() => setStep("confirm")}
            onPinComplete={handlePinComplete}
            errorMessage={pinError}
            attempt={pinAttempt}
          />
        )}

        {step === "success" && selectedNetwork && selectedPlan && (
          <SuccessStep
            title="Data purchase successful"
            detail={`${selectedPlan.label} ${selectedNetwork.name} data sent to ${formatPhoneNumber(phoneNumber)}`}
            onDone={onClose}
          />
        )}

        {step === "submit-failed" && (
          <SubmitFailedStep title="Purchase didn't go through" onRetry={() => setStep("pin")} onClose={onClose} />
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
        <h2 className="text-base font-[600] text-white">Buy Data</h2>
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

function PlansStep({ onBack, onSelectPlan }: { onBack: () => void; onSelectPlan: (plan: DataPlan) => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StepHeader title="Select a plan" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-3">
          {DATA_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan)}
              className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-left transition-colors hover:bg-white/10"
            >
              <span>
                <span className="block text-base font-[700] text-white">{plan.label}</span>
                <span className="block text-xs text-white/50">Valid for {plan.validity}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-[700] text-[#FFBF0D]">{formatMoney(plan.priceKobo)}</span>
                <ChevronRightIcon />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmStep({
  phoneNumber,
  network,
  plan,
  balance,
  onBack,
  onContinue,
}: {
  phoneNumber: string;
  network: Network;
  plan: DataPlan;
  balance: ReturnType<typeof useFetch<BalanceSummary>>;
  onBack: () => void;
  onContinue: () => void;
}) {
  let hint: string | null = null;
  if (balance.status === "loading") {
    hint = "Checking your balance…";
  } else if (balance.status === "error") {
    hint = "Couldn't check your balance.";
  } else if (balance.status === "success" && plan.priceKobo > balance.data.balanceKobo) {
    hint = "Insufficient balance";
  }

  const isValid = hint === null && balance.status === "success";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <StepHeader title="Confirm purchase" onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-center text-sm text-white/50">
          To{" "}
          <span className="ml-1 inline-flex items-center gap-1.5 align-middle">
            <LogoBadge src={network.logoUrl} name={network.name} size={20} />
            <span className="text-sm font-[600] text-white">{formatPhoneNumber(phoneNumber)}</span>
          </span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-1 rounded-2xl bg-white/5 p-6">
          <LogoBadge src={network.logoUrl} name={network.name} size={44} />
          <span className="mt-1 text-2xl font-[700] text-white">{plan.label}</span>
          <span className="text-sm text-white/50">Valid for {plan.validity}</span>
          <span className="mt-2 text-lg font-[700] text-[#FFBF0D]">{formatMoney(plan.priceKobo)}</span>
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
