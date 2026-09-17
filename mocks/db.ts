import { PROFILES } from "../lib/profiles";
import type { Transaction } from "../lib/transaction";

interface Account {
  id: string;
  balanceKobo: number;
}

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

interface StoredState {
  accounts: Record<string, Account>;
  transactions: Transaction[];
}

const STORAGE_KEY = "novabiz-mock-db";

/** Reads any previously persisted state. Returns null if there's none, or storage isn't available (SSR, private browsing, quota). */
function loadPersisted(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredState) : null;
  } catch {
    return null;
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, transactions }));
  } catch {
    // Storage unavailable — the mock data just won't survive a reload this time.
  }
}

const persisted = loadPersisted();

const accounts: Record<string, Account> =
  persisted?.accounts ??
  Object.fromEntries(PROFILES.map((profile) => [profile.id, { id: profile.id, balanceKobo: profile.balanceKobo }]));

let transactions: Transaction[] = persisted?.transactions ?? [];

/** The mock "database" every handler reads from and writes to, persisted to localStorage so it survives page reloads. */
export const db = {
  account: {
    get(profileId: string): Account {
      if (!accounts[profileId]) {
        const profile = PROFILES.find((candidate) => candidate.id === profileId);
        accounts[profileId] = { id: profileId, balanceKobo: profile?.balanceKobo ?? 0 };
      }
      return accounts[profileId];
    },
    debit(profileId: string, amountKobo: number): void {
      db.account.get(profileId).balanceKobo -= amountKobo;
      persist();
    },
  },
  transactions: {
    seed(seeded: Transaction[]): void {
      transactions = seeded;
      persist();
    },
    findAll(): Transaction[] {
      return transactions;
    },
    count(): number {
      return transactions.length;
    },
    create(transaction: Transaction): void {
      transactions.unshift(transaction);
      persist();
    },
    todayTotals(): { inflowKobo: number; outflowKobo: number } {
      return transactions.reduce(
        (totals, transaction) => {
          if (transaction.status !== "successful" || !isToday(transaction.date)) return totals;
          if (transaction.type === "credit") totals.inflowKobo += transaction.amountKobo;
          else totals.outflowKobo += transaction.amountKobo;
          return totals;
        },
        { inflowKobo: 0, outflowKobo: 0 }
      );
    },
  },
};
