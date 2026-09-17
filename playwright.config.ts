import { defineConfig, devices } from "@playwright/test";

// Next.js (this project's version) only allows one `next dev` per project at a time —
// a second one (even on a different port) refuses to start with "Another next dev
// server is already running". So this reuses whatever's already up on the default
// port instead of trying to spawn a second instance alongside it.
const PORT = 3000;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // The mock API (MSW) only runs in development — see README's "Mock API layer" —
    // and a production build has no real backend to talk to, so E2E runs against `next dev`.
    // Latency/failure-rate are zeroed out here for deterministic runs (only takes effect
    // when this command is the one starting the server — see the note above); see the
    // README's "Optimistic updates and idempotency" section for what these env vars control.
    command: `npx next dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_MOCK_LATENCY_MS: "0",
      NEXT_PUBLIC_MOCK_FAILURE_RATE: "0",
    },
  },
});
