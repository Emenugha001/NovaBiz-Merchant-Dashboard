/** Groups raw digits into a 4-3-4 display format, e.g. "08012345678" -> "0801 234 5678". */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 11)].filter(Boolean).join(" ");
}
