import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroTransfer from "./heroTransfer";
import { formatMoney } from "../../lib/money";

const BALANCE_RESPONSE = { balanceKobo: 50_000_000, todayInflowKobo: 0, todayOutflowKobo: 0 };
const RESOLVE_RESPONSE = { name: "Jane Doe" };
const AMOUNT_KOBO = 5_000_000; // ₦50,000, entered as "50000" naira below.

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

/** Stubs global fetch: balance/resolve-account always succeed, send-money is driven by `sendMoney`. */
function stubFetch(sendMoney: (init: RequestInit) => Promise<Response>) {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.startsWith("/api/balance")) return Promise.resolve(jsonResponse(BALANCE_RESPONSE));
    if (url.startsWith("/api/resolve-account")) return Promise.resolve(jsonResponse(RESOLVE_RESPONSE));
    if (url.startsWith("/api/send-money")) return sendMoney(init!);

    return Promise.reject(new Error(`Unhandled fetch to ${url}`));
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function sendMoneySuccessResponse(init: RequestInit): Response {
  const body = JSON.parse(init.body as string) as { description: string; amountKobo: number };
  return jsonResponse(
    {
      transaction: {
        id: "txn_test",
        amountKobo: body.amountKobo,
        status: "successful",
        type: "debit",
        description: body.description,
        date: new Date().toISOString(),
      },
    },
    201
  );
}

/** Drives the overlay from the initial form through PIN entry, using a bank that's only listed once (not duplicated under "Recent"), to keep queries unambiguous. */
async function fillOutFormThroughPin(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText(/Adamu Ade/);

  fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: "1234567890" } });
  await user.click(screen.getByRole("button", { name: /select bank/i }));
  await user.click(screen.getByRole("button", { name: /Providus Bank/i }));

  await screen.findByText("Jane Doe");
  await user.click(screen.getByRole("button", { name: "Confirm" }));

  fireEvent.change(await screen.findByLabelText(/amount in naira/i), { target: { value: "50000" } });
  await user.click(screen.getByRole("button", { name: "Continue" }));

  for (const digit of ["1", "2", "3", "4"]) {
    await user.click(await screen.findByRole("button", { name: digit }));
  }
}

function sendMoneyCalls(fetchMock: ReturnType<typeof stubFetch>) {
  return fetchMock.mock.calls.filter(([url]) => String(url).startsWith("/api/send-money"));
}

describe("HeroTransfer (Send Money)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("completes the happy path from form to success, sending an Idempotency-Key", async () => {
    const user = userEvent.setup();
    const onTransferComplete = vi.fn();
    const fetchMock = stubFetch((init) => Promise.resolve(sendMoneySuccessResponse(init)));

    render(<HeroTransfer onClose={vi.fn()} onTransferComplete={onTransferComplete} />);
    await fillOutFormThroughPin(user);

    await screen.findByText("Transfer successful");
    expect(screen.getByText(`${formatMoney(AMOUNT_KOBO)} was sent to Jane Doe`)).toBeInTheDocument();
    await waitFor(() => expect(onTransferComplete).toHaveBeenCalledTimes(1));

    const calls = sendMoneyCalls(fetchMock);
    expect(calls).toHaveLength(1);
    const headers = calls[0][1]?.headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toEqual(expect.any(String));
    expect(headers["Idempotency-Key"].length).toBeGreaterThan(0);
  });

  it("shows the failure screen when the request fails, requires the PIN again on retry, and reuses the same Idempotency-Key", async () => {
    const user = userEvent.setup();
    const onTransferComplete = vi.fn();
    let attempt = 0;
    const fetchMock = stubFetch((init) => {
      attempt += 1;
      if (attempt === 1) return Promise.reject(new Error("Network error"));
      return Promise.resolve(sendMoneySuccessResponse(init));
    });

    render(<HeroTransfer onClose={vi.fn()} onTransferComplete={onTransferComplete} />);
    await fillOutFormThroughPin(user);

    // Optimistic success screen reconciles to the failure screen once the request rejects.
    await screen.findByText("Transfer didn't go through");
    expect(onTransferComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    // Retry doesn't resubmit directly — it sends the user back to re-enter their PIN.
    expect(screen.queryByText("Transfer successful")).not.toBeInTheDocument();
    expect(sendMoneyCalls(fetchMock)).toHaveLength(1);
    for (const digit of ["1", "2", "3", "4"]) {
      await user.click(await screen.findByRole("button", { name: digit }));
    }

    await screen.findByText("Transfer successful");
    await waitFor(() => expect(onTransferComplete).toHaveBeenCalledTimes(1));

    const calls = sendMoneyCalls(fetchMock);
    expect(calls).toHaveLength(2);
    const firstKey = (calls[0][1]?.headers as Record<string, string>)["Idempotency-Key"];
    const secondKey = (calls[1][1]?.headers as Record<string, string>)["Idempotency-Key"];
    expect(secondKey).toBe(firstKey);
  });
});
