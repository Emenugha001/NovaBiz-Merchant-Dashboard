export type Theme = "light" | "dark";

const THEME_KEY = "novabiz-theme";

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage unavailable — fall back to light.
  }
  return "light";
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage unavailable — the preference just won't persist this time.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Source for the blocking inline script in the root layout that applies the theme before hydration, avoiding a flash of the wrong theme. */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("${THEME_KEY}");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;
