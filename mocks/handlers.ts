import { http, HttpResponse, delay } from "msw";
import type {
  BalanceSummary,
  LoginRequest,
  LoginResponse,
  ResolveAccountResponse,
  SendMoneyRequest,
  SendMoneyResponse,
  TransactionsResponse,
} from "../lib/api";
import type { Transaction } from "../lib/transaction";
import { db } from "./db";
import { getFailureRate, getLatencyMs } from "./mockConfig";
import { getActiveProfile } from "../lib/activeProfile";
import { PROFILES } from "../lib/profiles";

/** Waits out the configured latency, then rolls the configured failure rate. Both are read live, so the dev controls panel can change them without a reload. */
async function simulateNetwork(): Promise<{ shouldFail: boolean }> {
  await delay(getLatencyMs());
  return { shouldFail: Math.random() < getFailureRate() };
}

/** Either a 500 or a hard network error, so both failure classes are reachable. */
function simulatedFailureResponse() {
  if (Math.random() < 0.5) {
    return HttpResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return HttpResponse.error();
}

const MERCHANT_NAMES = [
  "Glo (08118472143)",
  "MTN (08034567890)",
  "Airtel (08123456789)",
  "DSTV Subscription",
  "Ikeja Electric",
  "Bet9ja",
  "Netflix Subscription",
  "Uber Ride",
  "Jumia Purchase",
  "AEDC Electricity",
];

function generateTransactions(count: number): Transaction[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, index) => {
    const isCredit = Math.random() < 0.2;
    const statusRoll = Math.random();
    const status = statusRoll < 0.08 ? "failed" : statusRoll < 0.16 ? "pending" : "successful";

    return {
      id: `txn_${index + 1}`,
      amountKobo: Math.round((Math.random() * 50000 + 500) * 100),
      status,
      type: isCredit ? "credit" : "debit",
      description: isCredit ? "Wallet funding" : MERCHANT_NAMES[index % MERCHANT_NAMES.length],
      date: new Date(now - index * 1000 * 60 * 47).toISOString(),
    };
  });
}

if (db.transactions.count() === 0) {
  db.transactions.seed(generateTransactions(1200));
}

/** Idempotency-Key -> the response first returned for it, so a retried submit can't double-send. */
const idempotencyCache = new Map<string, SendMoneyResponse>();

export const handlers = [
  http.get("/api/balance", async () => {
    const { shouldFail } = await simulateNetwork();
    if (shouldFail) return simulatedFailureResponse();

    const { inflowKobo, outflowKobo } = db.transactions.todayTotals();
    const body: BalanceSummary = {
      balanceKobo: db.account.get(getActiveProfile().id).balanceKobo,
      todayInflowKobo: inflowKobo,
      todayOutflowKobo: outflowKobo,
    };
    return HttpResponse.json(body);
  }),

  http.get("/api/transactions", async () => {
    const { shouldFail } = await simulateNetwork();
    if (shouldFail) return simulatedFailureResponse();

    const body: TransactionsResponse = {
      transactions: db.transactions.findAll(),
      total: db.transactions.count(),
    };
    return HttpResponse.json(body);
  }),

  http.get("/api/resolve-account", async () => {
    const { shouldFail } = await simulateNetwork();
    if (shouldFail) return simulatedFailureResponse();

    const body: ResolveAccountResponse = { name: "Oluchi Francisca Emenugha" };
    return HttpResponse.json(body);
  }),

  http.post("/api/login", async ({ request }) => {
    const { shouldFail } = await simulateNetwork();
    if (shouldFail) return simulatedFailureResponse();

    const { email, password } = (await request.json()) as LoginRequest;
    const profile = PROFILES.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password
    );

    if (!profile) {
      return HttpResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const body: LoginResponse = { profileId: profile.id };
    return HttpResponse.json(body);
  }),

  http.post("/api/send-money", async ({ request }) => {
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return HttpResponse.json(idempotencyCache.get(idempotencyKey));
    }

    const { shouldFail } = await simulateNetwork();
    if (shouldFail) return simulatedFailureResponse();

    const { description, amountKobo } = (await request.json()) as SendMoneyRequest;

    const transaction: Transaction = {
      id: `txn_${crypto.randomUUID()}`,
      amountKobo,
      status: "successful",
      type: "debit",
      description,
      date: new Date().toISOString(),
    };
    db.transactions.create(transaction);
    db.account.debit(getActiveProfile().id, amountKobo);

    const body: SendMoneyResponse = { transaction };
    if (idempotencyKey) idempotencyCache.set(idempotencyKey, body);

    return HttpResponse.json(body, { status: 201 });
  }),
];
