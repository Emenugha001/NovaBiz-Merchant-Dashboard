const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Formats how long ago `fromMs` was, relative to `nowMs`, e.g. "5 seconds ago", "1 minute ago". */
export function formatRelativeTime(fromMs: number, nowMs: number): string {
  const diffSeconds = Math.round((fromMs - nowMs) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffSeconds) < 60) return relativeTimeFormatter.format(diffSeconds, "second");
  if (Math.abs(diffMinutes) < 60) return relativeTimeFormatter.format(diffMinutes, "minute");
  return relativeTimeFormatter.format(diffHours, "hour");
}
