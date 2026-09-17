import type { Money } from "./money";

export type TransactionStatus = "pending" | "successful" | "failed";
export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: string;
  amountKobo: Money;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  /** ISO 8601 timestamp. */
  date: string;
}
