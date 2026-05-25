export type Consent = "granted" | "denied";

export const CONSENT_KEY = "mobol_cookie_consent_v1";
export const CONSENT_EVENT = "mobol:consent-changed";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
    return null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage may be unavailable (private mode, quota); fail open.
  }
  window.dispatchEvent(
    new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }),
  );
}
