import type { Money } from "./money";
import type { Transaction } from "./transaction";

export interface BalanceSummary {
  balanceKobo: Money;
  todayInflowKobo: Money;
  todayOutflowKobo: Money;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export interface SendMoneyRequest {
  description: string;
  amountKobo: Money;
}

export interface SendMoneyResponse {
  transaction: Transaction;
}

export interface ResolveAccountResponse {
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  profileId: string;
}
