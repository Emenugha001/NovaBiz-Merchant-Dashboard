"use client";

import { useCallback, useEffect, useState } from "react";

export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T; updatedAt: number };

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForOnline(): Promise<void> {
  if (typeof navigator === "undefined" || navigator.onLine) return Promise.resolve();
  return new Promise((resolve) => {
    function handleOnline() {
      window.removeEventListener("online", handleOnline);
      resolve();
    }
    window.addEventListener("online", handleOnline);
  });
}

/**
 * Fetches `url` as JSON, re-running whenever `url` changes or `retry()` is called.
 * Waits out real offline periods and retries transient failures with exponential
 * backoff (1s, 2s, 4s) before surfacing an error — poor-connectivity users get a
 * spinner a bit longer instead of an immediate, often-unnecessary error.
 */
export function useFetch<T>(url: string): FetchState<T> & { retry: () => void } {
  const [requestKey, setRequestKey] = useState(0);
  const [trackedUrl, setTrackedUrl] = useState(url);
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });

  if (url !== trackedUrl) {
    setTrackedUrl(url);
    setState({ status: "loading" });
  }

  useEffect(() => {
    let cancelled = false;

    async function attempt(retryCount: number): Promise<void> {
      await waitForOnline();
      if (cancelled) return;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = (await response.json()) as T;
        if (!cancelled) setState({ status: "success", data, updatedAt: Date.now() });
      } catch {
        if (cancelled) return;
        if (retryCount < MAX_RETRIES) {
          await wait(BASE_RETRY_DELAY_MS * 2 ** retryCount);
          if (!cancelled) await attempt(retryCount + 1);
        } else {
          setState({ status: "error", message: "Couldn't load this right now." });
        }
      }
    }

    attempt(0);

    return () => {
      cancelled = true;
    };
  }, [url, requestKey]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setRequestKey((key) => key + 1);
  }, []);

  return { ...state, retry };
}
