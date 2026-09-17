const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** Formats an ISO 8601 timestamp for display, e.g. "Sep 16, 8:41 AM". */
export function formatTransactionDate(iso: string): string {
  return transactionDateFormatter.format(new Date(iso));
}

/** Whether two timestamps fall on the same calendar day (local time), not just within 24 hours of each other. */
export function isSameDay(aMs: number, bMs: number): boolean {
  const a = new Date(aMs);
  const b = new Date(bMs);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
