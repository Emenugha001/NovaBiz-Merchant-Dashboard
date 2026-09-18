import { test, expect, type Page } from "@playwright/test";

const EMAIL = "adamu.ade@novabiz.test";
const PASSWORD = "adamu1234";
const PIN = "1234";
// The mock /api/resolve-account handler always returns this name regardless of the
// account/bank picked (see mocks/handlers.ts), so it's deterministic to assert on.
const RESOLVED_RECIPIENT = "Oluchi Francisca Emenugha";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** Reveals and parses the wallet balance shown on the dashboard overview card. */
async function readBalanceKobo(page: Page): Promise<number> {
  const toggle = page.getByRole("button", { name: /show balance|hide balance/i });
  if ((await toggle.getAttribute("aria-label")) === "Show balance") {
    await toggle.click();
  }
  const text = await page.locator("p.text-4xl").innerText();
  const naira = Number(text.replace(/[^\d.]/g, ""));
  return Math.round(naira * 100);
}

test.describe("Send Money", () => {
  test("logs in, sends money, and reflects the debit and new transaction", async ({ page }) => {
    await login(page);

    const balanceBefore = await readBalanceKobo(page);

    await page.getByRole("button", { name: "Transfer", exact: true }).click();

    await page.getByRole("textbox", { name: /account number/i }).fill("1234567890");
    await page.getByRole("button", { name: /select bank/i }).click();
    // Providus Bank only appears once (not duplicated under "Recent"), so this stays unambiguous.
    await page.getByRole("button", { name: /Providus Bank/i }).click();

    await expect(page.getByText(RESOLVED_RECIPIENT)).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();

    await page.getByLabel(/amount in naira/i).fill("50000");
    await page.getByRole("button", { name: "Continue" }).click();

    for (const digit of PIN) {
      await page.getByRole("button", { name: digit, exact: true }).click();
    }

    await expect(page.getByText("Transfer successful")).toBeVisible();
    await expect(page.getByText(`was sent to ${RESOLVED_RECIPIENT}`, { exact: false })).toBeVisible();

    await page.getByRole("button", { name: "Done" }).click();

    const balanceAfter = await readBalanceKobo(page);
    expect(balanceAfter).toBe(balanceBefore - 5_000_000);

    const recentTransactions = page.locator("text=Recent transactions").locator("..").locator("..");
    await expect(recentTransactions.getByText(`Transfer to ${RESOLVED_RECIPIENT}`).first()).toBeVisible();
  });
});
