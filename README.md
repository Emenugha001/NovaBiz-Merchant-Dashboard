# NovaBiz Merchant Dashboard

NovaBiz Merchant Dashboard is a small-merchant dashboard for the NovaBiz module of FirstBank's fictional NovaPay super-app: a live view of money coming into a wallet, and a way to send money out (bank transfer, airtime, and data purchases). There is no live backend — the entire API layer is mocked in the browser with MSW.

## Features

- **Login** — email/password sign-in gates access to the dashboard entirely; there's no way to reach `/dashboard` without authenticating first (direct navigation redirects back to `/login`). Each account is a separate mock profile with its own name, balance, and account number — see [Demo accounts](#demo-accounts).
- **Balance summary** — current wallet balance and today's inflow/outflow totals, computed from the mock transaction store and formatted from integer kobo via `Intl.NumberFormat`.
- **Transaction feed** — a "Recent transactions" card on the dashboard, a "last 5 days" view, and a full **Statement** page wit=h search (by description), debit/credit filtering, and a date-range filter, paginated so 1,200+ mock rows stay smooth.
- **Send Money, Buy Airtime, Buy Data** — three multi-step overlays sharing the same underlying flow: recipient/network selection → amount (or plan) → PIN authorization → an **optimistic** success screen that reconciles (rolls back to a retryable failure state) if the mocked request actually fails, using a stable `Idempotency-Key` so a retry can't double-send.
- **Mock API layer** — MSW intercepts `fetch()` in the browser, backed by a small in-memory store, with configurable simulated latency and failure rate.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Mock backend**: MSW (Mock Service Worker) 2

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. MSW starts automatically in development (see [Mock API layer](#mock-api-layer) below) — there's no separate setup step. Sign in on `/login` with any of the [demo accounts](#demo-accounts) below.

## Demo accounts

There's no real auth backend — `POST /api/login` (mocked) checks the email/password against this
fixed list and, on a match, activates that profile for the rest of the session:

|   Name    |        Email            | Password      | Starting balance |
| Adamu Ade | `adamu.ade@novabiz.test`| `adamu1234`   |   ₦500,000.00    |
| Sanwo Olu | `sanwo.olu@novabiz.test`| `sanwo1234`   |  ₦1,500,000.00 |
| Jah Jesu  | `jah.jesu@novabiz.test` | `jahjesu1234` |   ₦128,761.82 |



## Poject Structure


```
app/                           # Next.js App Router routes (/, /login, /dashboard)
components/
|--  login.tsx                 # Email/password sign-in screen
|--  comingSoon.tsx            # Reusable "coming soon" overlay (Sidebar → Settings / Support)
|--  dashboardComponents/      # Balance card, services grid, transactions, spending, statement,    "More"
|--  transferComponents/       # Send Money overlay
|--  airtimeComponents/        # Buy Airtime overlay
|--  dataComponents/           # Buy Data overlay
|--  paymentFlowShared.tsx     # Shared UI for the three payment overlays (PIN pad, success/failure
                                 screens, "paying from" card, network picker) — extracted once Airtime
                                 and Data needed the same flow as Transfer
|--  sidebar.tsx               # Desktop sidebar / mobile drawer navigation (Overview, Transfers,     History,Settings, Support)
|-- lib/                       # Domain types (Money, Transaction, Profile) and pure helpers 
|-- mocks/                     # MSW handlers, the in-memory mock database, and mock config

```



### Mock API layer

MSW's browser worker (`mocks/browser.ts`) is started from `components/MockServiceWorkerProvider.tsx`,
a client component that renders `null` until `worker.start()` resolves (mocking is gated to
`NODE_ENV === "development"`, so none of this ships in a production build). The handlers
(`mocks/handlers.ts`) read and write a small store (`mocks/db.ts`) rather than mutating loose
module variables — a real backing store made it trivial to, for example, compute today's
inflow/outflow from the actual transaction records instead of hardcoding them. The store persists
itself to `localStorage` on every write and rehydrates from it on load, so the balance and
transaction history survive a page reload instead of resetting; the 1,200 seed transactions are
only (re)generated when there's nothing to restore.

Every handler runs through `simulateNetwork()`: it awaits a configurable delay, then rolls a
configurable chance of failing (either a 500 JSON error or a hard network error, so both failure
shapes are reachable). Both are read live from `mocks/mockConfig.ts` and can be overridden with:

```bash
NEXT_PUBLIC_MOCK_LATENCY_MS=1500 NEXT_PUBLIC_MOCK_FAILURE_RATE=0.5 npm run dev
```

(defaults: 800ms latency, 15% failure rate.)

### Optimistic updates and idempotency

Transfer, Airtime, and Data all submit the same way: on a correct PIN, the UI jumps to the success
screen.

The PIN itself is a hardcoded demo value (`1234`) — there's no real auth backend to check against.


## References

- [MSW documentation](https://mswjs.io/docs/) — request handlers, the browser worker setup, and the
  service worker init step used in [Mock API layer](#mock-api-layer).

## AI usage

See [AI_USAGE.md](./AI_USAGE.md).
