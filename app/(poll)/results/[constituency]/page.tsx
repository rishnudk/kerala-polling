"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ResultsChart } from "@/component/results/ResultsChart";
import { StepIndicator } from "@/component/ui/StepIndicator";
import { PARTIES } from "@/data/parties";

interface ResultRow {
  party: string;
  votes: number;
  percentage: number;
  color: string;
}

interface ApiResponse {
  constituency: string;
  results: Record<string, number>;
  total: number;
}

function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      <p className="text-sm text-gray-400">Loading results...</p>
    </div>
  );
}

function ResultsPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const constituency = decodeURIComponent((params.constituency as string) ?? "");
  const district = searchParams.get("district") ?? "";
  const showSuccess = searchParams.get("success") === "1";

  const [rows, setRows] = useState<ResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchResults() {
      try {
        const res = await fetch(
          `/api/result?constituency=${encodeURIComponent(constituency)}`
        );
        const data: ApiResponse = await res.json();

        if (!res.ok) {
          throw new Error("Could not load results.");
        }

        const nextTotal = data.total ?? 0;
        const nextRows = PARTIES.map((party) => {
          const votes = data.results[party.id] ?? 0;

          return {
            party: party.id,
            votes,
            percentage: nextTotal > 0 ? Math.round((votes / nextTotal) * 100) : 0,
            color: party.color,
          };
        }).sort((a, b) => b.votes - a.votes);

        if (!isMounted) {
          return;
        }

        setRows(nextRows);
        setTotal(nextTotal);
        setLastUpdate(new Date());
        setError(null);
      } catch {
        if (isMounted) {
          setError("Could not load results. Retrying...");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!constituency) {
      setLoading(false);
      setError("Missing constituency.");
      return;
    }

    fetchResults();
    const interval = setInterval(fetchResults, 15_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [constituency]);

  if (loading) {
    return <Spinner />;
  }

  const leader = rows[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <StepIndicator current={3} />

        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1 transition-colors"
          >
            Back to another constituency
          </button>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{constituency}</h1>
              {district ? (
                <p className="text-sm text-gray-500 mt-0.5">{district} district</p>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">Live</span>
            </div>
          </div>
        </div>

        {showSuccess ? (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm font-medium text-green-800">
              Vote submitted successfully.
            </p>
            <p className="text-xs text-green-700 mt-1">
              Your response has been counted for {constituency}.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : null}

        {total > 0 && leader ? (
          <div
            className="rounded-xl p-4 mb-5 border"
            style={{
              backgroundColor: `${leader.color}15`,
              borderColor: `${leader.color}40`,
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
              <p className="text-2xl font-bold" style={{ color: leader.color }}>
                {leader.percentage}%
              </p>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <ResultsChart data={rows} total={total} />
        </div>

        {lastUpdate ? (
          <p className="text-xs text-gray-400 text-center mb-6">
            Updated {lastUpdate.toLocaleTimeString()} | refreshes every 15s
          </p>
        ) : null}

        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Vote in another constituency
        </button>

        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          This is an independent community poll | not an official election result
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-green-700 hover:text-green-800">
            Back to constituency selection
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ResultsPageInner />
    </Suspense>
  );
}
