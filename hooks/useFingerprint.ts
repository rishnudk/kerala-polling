"use client";

import { useEffect, useState } from "react";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const fp     = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch {
        // Fallback: random ID stored in localStorage
        const key = "kp_device_id";
        let id = localStorage.getItem(key);
        if (!id) {
          id = Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem(key, id);
        }
        setFingerprint(id);
      }
    }
    load();
  }, []);

  return fingerprint;
}