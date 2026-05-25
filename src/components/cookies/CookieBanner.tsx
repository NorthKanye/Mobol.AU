"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "./consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    writeConsent("granted");
    setVisible(false);
  };

  const handleReject = () => {
    writeConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="cookie-banner"
    >
      <p>
        We use cookies to understand how the site is used. See our{" "}
        <Link href="/cookies">Cookie Policy</Link> for details.
      </p>
      <div className="cookie-banner-actions">
        <button
          type="button"
          onClick={handleReject}
          className="cookie-banner-btn cookie-banner-btn-secondary"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="cookie-banner-btn cookie-banner-btn-primary"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
