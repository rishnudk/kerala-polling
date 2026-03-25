"use client";

import { useEffect, useState } from "react";
import { RainbowButton } from "@/component/ui/rainbow-button";

export function UserVoteStatus() {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const res = await fetch("/api/result");
        const data = await res.json();
        setTotal(data.total);
      } catch (error) {
        console.error("Failed to fetch total votes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTotal();
    const interval = setInterval(fetchTotal, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && total === null) {
    return (
      <div className="w-full mb-6">
        <RainbowButton disabled className="">
          Loading votes...
        </RainbowButton>
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <RainbowButton
        className=""
      >
        <div className="flex items-center justify-center gap-3">
          <div className="relative flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-white"></div>
          </div>
          <span className="tracking-tight text-white capitalize">
            {total?.toLocaleString() ?? "0"} votes and counting
          </span>
        </div>
      </RainbowButton>
    </div>
  );
}
