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
    <div className="relative z-10">
      <button
        onClick={onBack}
        className="text-xs text-emerald-300/50 hover:text-emerald-300 mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back to selection
      </button>

      <h2 className="text-2xl font-semibold text-white mb-1">{constituency}</h2>
      <p className="text-sm text-emerald-100/60 mb-6">{district} district</p>

      <p className="text-sm font-medium text-emerald-50/80 mb-4">
        Who would you vote for?
      </p>

      <div className="flex flex-col gap-3 mb-6">
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
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || submitting}
        className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
          selected && !submitting
            ? "bg-emerald-400 text-[#062316] shadow-[0_12px_40px_rgba(52,211,153,0.3)] hover:scale-[1.02]"
            : "bg-white/5 text-emerald-100/20 cursor-not-allowed"
        }`}
      >
        {submitting ? "Submitting..." : selected ? `Vote for ${selected}` : "Select a party"}
      </button>
    </div>
  );
}
