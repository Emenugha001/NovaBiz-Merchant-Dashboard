import { PROFILES, type Profile } from "./profiles";

const ACTIVE_PROFILE_KEY = "novabiz-active-profile";

/** The profile id chosen on the home page, or null if none has been selected yet. */
export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch {
    // Storage unavailable — the selection just won't persist across a reload.
  }
}

/** Resolves the active profile, falling back to the first one if none is set or the id is stale. */
export function getActiveProfile(): Profile {
  const id = getActiveProfileId();
  return PROFILES.find((profile) => profile.id === id) ?? PROFILES[0];
}
