"use client";

import { useState } from "react";
import { PARTIES } from "@/data/parties";
import { PartyCard } from "@/component/poll/PartyCard";
import { useFingerprint } from "@/hooks/useFingerprint";
import { useVoteStatus } from "@/hooks/useVoteStatus";

interface Props {
  district: string;
  constituency: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function VoteStep({ district, constituency, onSuccess, onBack }: Props) {
  const fingerprint = useFingerprint();
  const voteStatus = useVoteStatus(constituency, fingerprint);

  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!fingerprint || voteStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm text-emerald-100/50">Checking status...</p>
      </div>
    );
  }

  async function handleSubmit() {
    if (!selected || !fingerprint) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constituency,
          district,
          party: selected,
          fingerprint,
        }),
      });

      if (res.status === 201) {
        localStorage.setItem(`kp_voted_${constituency}`, selected);
        onSuccess();
        return;
      }

      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

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

      <p className="text-sm font-bold text-gray-600 mb-4">
        Who would you vote for?
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {PARTIES.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            selected={selected === party.id}
            disabled={submitting}
            onSelect={setSelected}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className={`w-full py-5 rounded-2xl text-sm font-bold transition-all duration-300 ${
            selected && !submitting
              ? "bg-gray-900 text-white shadow-xl hover:bg-black hover:-translate-y-1 active:translate-y-0"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          {submitting ? "Submitting..." : selected ? `Confirm Vote for ${selected} →` : "Select a party to vote"}
        </button>
      </div>
    </div>
  );
}
