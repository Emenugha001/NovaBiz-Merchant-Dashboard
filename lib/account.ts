/** Groups raw digits into a 3-3-4 display format, e.g. "8118472666" -> "811 847 2666". */
export function formatAccountNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean).join(" ");
}
