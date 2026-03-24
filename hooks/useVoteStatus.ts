"use client";

import { useEffect, useState } from "react";

interface VoteStatus {
  voted:   boolean;
  party:   string | null;
  loading: boolean;
}

export function useVoteStatus(
  constituency: string,
  fingerprint:  string | null
): VoteStatus {
  const [status, setStatus] = useState<VoteStatus>({
    voted:   false,
    party:   null,
    loading: true,
  });

  useEffect(() => {
    // Wait until fingerprint is ready and constituency is set
    if (!constituency || !fingerprint) return;

    // 1. Check localStorage first — instant, no network call
    const LOCAL_KEY  = `kp_voted_${constituency}`;
    const localVote  = localStorage.getItem(LOCAL_KEY);

    if (localVote) {
      setStatus({ voted: true, party: localVote, loading: false });
      return;
    }

    // 2. Check with server — catches users who cleared localStorage
    //    or are on a different browser but same fingerprint
    async function checkServer() {
      try {
        const res = await fetch(
          `/api/vote?constituency=${encodeURIComponent(constituency)}&fingerprint=${encodeURIComponent(fingerprint!)}`
        );
        const data = await res.json();

        if (data.voted) {
          // Sync back to localStorage so next check is instant
          localStorage.setItem(LOCAL_KEY, data.party);
          setStatus({ voted: true, party: data.party, loading: false });
        } else {
          setStatus({ voted: false, party: null, loading: false });
        }
      } catch {
        // On network error, assume not voted — don't block the user
        setStatus({ voted: false, party: null, loading: false });
      }
    }

    checkServer();
  }, [constituency, fingerprint]);

  return status;
}