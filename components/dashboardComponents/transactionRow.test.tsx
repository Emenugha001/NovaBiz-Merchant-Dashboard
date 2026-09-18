import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionRow } from "./transactionRow";
import type { Transaction } from "../../lib/transaction";

function makeTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: "txn_1",
    amountKobo: 500_000,
    status: "successful",
    type: "debit",
    description: "Test transaction",
    date: new Date().toISOString(),
    ...overrides,
  };
}

describe("TransactionRow", () => {
  it("shows money in (credit) as green", () => {
    render(<TransactionRow transaction={makeTransaction({ type: "credit" })} />);

    const amount = screen.getByText(/^\+/);
    expect(amount).toHaveClass("text-green-400");
  });

  it("shows money out (debit) as red", () => {
    render(<TransactionRow transaction={makeTransaction({ type: "debit" })} />);

    const amount = screen.getByText(/^-/);
    expect(amount).toHaveClass("text-[#ec2d01]");
  });
});
