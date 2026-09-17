export function getFailureRate(): number {
  return Number(process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE ?? 0.15);
}

export function getLatencyMs(): number {
  return Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 800);
}
