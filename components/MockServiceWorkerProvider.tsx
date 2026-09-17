"use client";

import { useEffect, useState } from "react";

const MOCKING_ENABLED =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";

export default function MockServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;

    let isMounted = true;

    import("../mocks/browser").then(({ startWorker }) =>
      startWorker().then(() => {
        if (isMounted) setIsReady(true);
      })
    );

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) return null;

  return children;
}
