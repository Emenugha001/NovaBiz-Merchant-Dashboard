# NovaBiz Merchant Dashboard - AI_USAGE

- **Tools Used** - Claude Code, Google AI, Google.
- **What AI helped with** - MSW handler/Mock design,the kobo-integer money formatting logic.
- **What you did yourself** -  decisions, review, edits, debugging.
- **One of the prompt given** - GET /dashboard 200 in 437ms... [browser] × unhandledRejection: Invariant Violation: Failed to call "configure()" on the network: cannot configure an already enabled network... there is an error
- **Answer I got** -  Diagnosed this as React Strict Mode intentionally double-invoking the useEffect that calls worker.start() — MSW's interceptor refuses to be configured a second time once already enabled. Fixed it by moving the start() call into a module-scoped memoized startWorker() function in mocks/browser.ts, so no matter how many times the effect fires, the actual start only happens once. A good "wrong/risky" candidate too, in reverse: the original implementation (calling worker.start() directly in the effect) was the risky code, caught by the error rather than by review.

