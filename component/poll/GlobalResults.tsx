"use client";

import { useEffect, useState } from "react";
import { PARTIES } from "@/data/parties";
import { ResultsChart } from "@/component/results/ResultsChart";

interface Props {
  onBack: () => void;
}

interface ApiResponse {
  results: Record<string, number>;
  total: number;
}

export function GlobalResults({ onBack }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("/api/result");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch global results", e);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    const interval = setInterval(fetchResults, 30000); // 30s refresh for global
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm text-emerald-100/50">Loading global results...</p>
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

      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70 mb-2">
          Final Standings
        </p>
        <h2 className="text-3xl font-bold text-white mb-1">Kerala Aggregate</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-medium text-emerald-400">Live Data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/10">
          <p className="text-[10px] uppercase tracking-wider text-emerald-100/40 mb-1">Total Votes</p>
          <p className="text-2xl font-bold text-white">{data.total.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/10">
          <p className="text-[10px] uppercase tracking-wider text-emerald-100/40 mb-1">Constituencies</p>
          <p className="text-2xl font-bold text-white">20</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-emerald-500/10 mb-6">
        <ResultsChart data={rows} total={data.total} />
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.party} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
               <span className="text-emerald-50/70">{row.party}</span>
            </div>
            <span className="font-mono text-emerald-100/90">{row.votes.toLocaleString()} votes</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-center text-emerald-100/30 font-medium py-6 uppercase tracking-widest">
        Aggregate of all 140 constituencies
      </p>
    </div>
  );
}
