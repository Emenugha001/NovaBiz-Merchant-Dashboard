import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";

// jsdom's crypto implementation doesn't always include randomUUID; fall back to Node's.
if (typeof globalThis.crypto?.randomUUID !== "function") {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}
