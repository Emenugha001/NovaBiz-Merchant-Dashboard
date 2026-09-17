"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const syncStatus = () => setIsOnline(navigator.onLine);
    const timeoutId = setTimeout(syncStatus, 0);
    window.addEventListener("online", syncStatus);
    window.addEventListener("offline", syncStatus);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("online", syncStatus);
      window.removeEventListener("offline", syncStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] bg-[#ec2d01] px-4 py-2 text-center text-sm font-[600] text-white"
    >
      You&apos;re offline. We&apos;ll keep retrying once your connection is back.
    </div>
  );
}
