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
    <div className="relative z-10 flex flex-col h-full">
      <button
        onClick={onBack}
        className="text-xs font-bold text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-1 transition-colors group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to selection
      </button>

      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{constituency}</h2>
        <p className="mt-1 text-lg font-medium text-gray-400 italic">{district} district</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
        <ResultsChart data={rows} total={data.total} />
      </div>

      <p className="mt-auto text-[10px] text-center text-gray-400 uppercase tracking-[0.2em] font-bold">
        Live results • Updates every 15s
      </p>
    </div>
  );
}
