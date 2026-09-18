"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, setStoredTheme, type Theme } from "../../lib/theme";

/** The switch's thumb icon, per design. */
const SWITCH_THUMB_URL = "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789650143/Vector_4_yqgvcz.png";

export default function Settings({ onBack }: { onBack: () => void }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Reads localStorage, so this has to happen after mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getStoredTheme());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
    applyTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <div className="w-full rounded-2xl bg-[#23297A] p-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Back" className="text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <h2 className="text-lg font-[600] text-white">Settings</h2>
      </div>

      <div className="mt-6 flex w-full items-center gap-6 rounded-xl bg-white/5 px-4 py-4">
        <div>
          <p className="text-sm font-[600] text-white">Dark mode</p>
          <p className="mt-0.5 text-xs text-white/50">Switches the whole dashboard's appearance, saved on this device.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label="Dark mode"
          onClick={toggleTheme}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${isDark ? "bg-[#FFBF0D]" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
              isDark ? "translate-x-5" : "translate-x-0.5"
            }`}
          >
            <Image src={SWITCH_THUMB_URL} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
          </span>
        </button>
      </div>
    </div>
  );
}
