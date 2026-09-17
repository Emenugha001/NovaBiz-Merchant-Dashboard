import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

let startPromise: ReturnType<typeof worker.start> | null = null;

/** Memoized so React Strict Mode's double effect invocation doesn't call worker.start() twice. */
export function startWorker(): ReturnType<typeof worker.start> {
  if (!startPromise) {
    startPromise = worker.start({ onUnhandledRequest: "bypass" });
  }
  return startPromise;
}
