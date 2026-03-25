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
    <div className="relative z-10 flex flex-col h-full">
      <button
        onClick={onBack}
        className="text-xs font-bold text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-1 transition-colors group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to selection
      </button>

      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Statewide Standings
        </p>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Kerala Aggregate</h2>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Live Data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Votes</p>
          <p className="text-2xl font-bold text-gray-900">{data.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Constituencies</p>
          <p className="text-2xl font-bold text-gray-900">140</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
        <ResultsChart data={rows} total={data.total} />
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.party} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
               <span className="font-bold text-gray-700">{row.party}</span>
            </div>
            <span className="font-mono font-bold text-gray-500">{row.votes.toLocaleString()} <span className="text-[10px] uppercase text-gray-300">votes</span></span>
          </div>
        ))}
      </div>

      <p className="mt-auto text-[10px] text-center text-gray-400 font-bold py-6 uppercase tracking-widest">
        Aggregate of all primary polling stations
      </p>
    </div>
  );
}
