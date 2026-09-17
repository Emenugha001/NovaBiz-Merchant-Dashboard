/** An amount of money as an integer number of kobo (1 Naira = 100 kobo). Never a float. */
export type Money = number;

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
});

export function formatMoney(kobo: Money): string {
  return nairaFormatter.format(kobo / 100);
}

/** Splits a formatted amount into its currency symbol and the numeric rest, e.g. for adding a visual gap between them without string-splicing the value itself. */
export function formatMoneyParts(kobo: Money): { symbol: string; rest: string } {
  const parts = nairaFormatter.formatToParts(kobo / 100);
  const symbol = parts.find((part) => part.type === "currency")?.value ?? "";
  const rest = parts
    .filter((part) => part.type !== "currency")
    .map((part) => part.value)
    .join("");
  return { symbol, rest };
}
