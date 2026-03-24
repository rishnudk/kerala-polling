"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams }      from "next/navigation";
import { ResultsChart }  from "@/component/results/ResultsChart";
import { StepIndicator } from "@/component/ui/StepIndicator";
import { PARTIES }       from "@/data/parties";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ResultRow {
  party:      string;
  votes:      number;
  percentage: number;
  color:      string;
}

interface ApiResponse {
  constituency: string;
  results:      Record<string, number>;
  total:        number;
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-green-500
                      border-t-transparent animate-spin" />
      <p className="text-sm text-gray-400">Loading results...</p>
    </div>
  );
}

// ── Inner component ───────────────────────────────────────────────────────────
function ResultsPageInner() {
  const router  = useRouter();
  const params  = useParams();
  const search  = useSearchParams();

  const constituency = decodeURIComponent(params.constituency as string);
  const district     = search.get("district") ?? "";

  const [rows,       setRows]       = useState<ResultRow[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // ── Fetch results from API ──────────────────────────────────────────────────
  const fetchResults = useCallback(async () => {
    try {
      const res  = await fetch(
        `/api/result?constituency=${encodeURIComponent(constituency)}`
      );
      const data: ApiResponse = await res.json();

      if (!res.ok) throw new Error(data as any);

      const t = data.total ?? 0;

      // Shape API response into chart rows, sorted by votes descending
      const shaped: ResultRow[] = PARTIES.map((p) => {
        const votes = data.results[p.id] ?? 0;
        return {
          party:      p.id,
          votes,
          percentage: t > 0 ? Math.round((votes / t) * 100) : 0,
          color:      p.color,
        };
      }).sort((a, b) => b.votes - a.votes);

      setRows(shaped);
      setTotal(t);
      setLastUpdate(new Date());
      setError(null);
    } catch {
      setError("Could not load results. Retrying...");
    } finally {
      setLoading(false);
    }
  }, [constituency]);

  // Initial fetch + poll every 15 seconds for live-ish updates
  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 15_000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  if (loading) return <Spinner />;

  const leader = rows[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">

        <StepIndicator current={3} />

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-400 hover:text-gray-600
                       mb-3 flex items-center gap-1 transition-colors"
          >
            ← Vote in another constituency
          </button>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{constituency}</h1>
              {district && (
                <p className="text-sm text-gray-500 mt-0.5">{district} district</p>
              )}
            </div>
            {/* Live badge */}
            <div className="flex items-center gap-1.5 bg-green-50 border
                            border-green-200 rounded-full px-3 py-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">Live</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Leader card */}
        {total > 0 && leader && (
          <div
            className="rounded-xl p-4 mb-5 border"
            style={{
              backgroundColor: `${leader.color}15`,
              borderColor:     `${leader.color}40`,
            }}
          >
            <p className="text-xs font-medium text-gray-500 mb-0.5">
              Currently leading
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: leader.color }}
                />
                <p className="text-lg font-bold text-gray-900">{leader.party}</p>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: leader.color }}
              >
                {leader.percentage}%
              </p>
            </div>
          </div>
        )}

        {/* Chart card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <ResultsChart data={rows} total={total} />
        </div>

        {/* Last updated */}
        {lastUpdate && (
          <p className="text-xs text-gray-400 text-center mb-6">
            Updated {lastUpdate.toLocaleTimeString()} · refreshes every 15s
          </p>
        )}

        {/* Vote again in another constituency */}
        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 rounded-xl text-sm font-semibold
                     bg-white border border-gray-200 text-gray-700
                     hover:bg-gray-50 transition-colors"
        >
          Vote in another constituency
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          This is an independent community poll · not an official election result
        </p>

      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function ResultsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ResultsPageInner />
    </Suspense>
  );
}