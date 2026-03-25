"use client";

import { useEffect, useState } from "react";
import { PARTIES } from "@/data/parties";
import { ResultsChart } from "@/component/results/ResultsChart";

interface Props {
  constituency: string;
  district: string;
  onBack: () => void;
}

interface ApiResponse {
  results: Record<string, number>;
  total: number;
}

export function ResultsStep({ constituency, district, onBack }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/result?constituency=${encodeURIComponent(constituency)}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch results", e);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    const interval = setInterval(fetchResults, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [constituency]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm text-emerald-100/50">Loading results...</p>
      </div>
    );
  }

  const rows = PARTIES.map((p) => ({
    party: p.id,
    votes: data.results[p.id] ?? 0,
    color: p.color,
    percentage: data.total > 0 ? Math.round(((data.results[p.id] ?? 0) / data.total) * 100) : 0,
  })).sort((a, b) => b.votes - a.votes);

  return (
    <div className="relative z-10">
      <button
        onClick={onBack}
        className="text-xs text-emerald-300/50 hover:text-emerald-300 mb-4 transition-colors"
      >
        ← Back to selection
      </button>

      <h2 className="text-2xl font-semibold text-white mb-1">{constituency}</h2>
      <p className="text-sm text-emerald-100/60 mb-6">{district} district</p>

      <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/10 mb-6">
        <ResultsChart data={rows} total={data.total} />
      </div>

      <p className="text-[10px] text-center text-emerald-100/30 uppercase tracking-widest">
        Live results • Updates every 15s
      </p>
    </div>
  );
}
