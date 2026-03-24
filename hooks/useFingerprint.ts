"use client";

import { useEffect, useState } from "react";

export function useFingerprint(): string | null {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Load FingerprintJS — reads browser signals to make a stable device ID
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const fp     = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch {
        // Fallback: if FingerprintJS fails (ad blocker etc.)
        // generate a random ID and persist it in localStorage
        const KEY = "kp_device_id";
        let id = localStorage.getItem(KEY);
        if (!id) {
          id = Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem(KEY, id);
        }
        setFingerprint(id);
      }
    }

    load();
  }, []);

  return fingerprint; // null while loading, string once ready
}