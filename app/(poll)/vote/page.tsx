
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PARTIES } from "@/data/parties";
import { PartyCard } from "@/component/poll/PartyCard";
import { AlreadyVotedBanner } from "@/component/poll/AlreadyVotedBanner";
import { StepIndicator } from "@/component/ui/StepIndicator";
import { useFingerprint } from "@/hooks/useFingerprint";
import { useVoteStatus } from "@/hooks/useVoteStatus";

// ── Spinner helper ────────────────────────────────────────────────────────────
function Spinner({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <div
                className="w-8 h-8 rounded-full border-2 border-green-500
                   border-t-transparent animate-spin"
            />
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

// ── Inner component (uses useSearchParams — must be inside Suspense) ──────────
function VotePageInner() {
    const router = useRouter();
    const params = useSearchParams();
    const constituency = params.get("constituency") ?? "";
    const district = params.get("district") ?? "";

    const fingerprint = useFingerprint();
    const voteStatus = useVoteStatus(constituency, fingerprint);

    const [selected, setSelected] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guard — no constituency in URL
    if (!constituency || !district) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No constituency selected.</p>
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm text-green-600 underline"
                    >
                        Go back to select one
                    </button>
                </div>
            </div>
        );
    }

    // Loading fingerprint or vote status
    if (!fingerprint || voteStatus.loading) {
        return <Spinner label="Checking your vote status..." />;
    }

    // ── Submit vote ─────────────────────────────────────────────────────────────
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

            const data = await res.json();

            if (res.status === 201) {
                // Save to localStorage so the banner shows instantly next visit
                localStorage.setItem(`kp_voted_${constituency}`, selected);
                router.push(
                    `/results/${encodeURIComponent(constituency)}?district=${encodeURIComponent(district)}&success=1`
                );
                return;
            }

            if (res.status === 409) {
                setError("You have already voted in this constituency from this device.");
                return;
            }

            if (res.status === 429) {
                setError("Too many votes from this network. Please try again tomorrow.");
                return;
            }

            setError(data.error ?? "Something went wrong. Please try again.");

        } catch {
            setError("Network error. Check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto px-4 py-8">

                <StepIndicator current={2} />

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className="text-xs text-gray-400 hover:text-gray-600
                       mb-3 flex items-center gap-1 transition-colors"
                    >
                        ← Change constituency
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">{constituency}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{district} district</p>
                </div>

                {/* Already voted — show banner */}
                {voteStatus.voted && voteStatus.party ? (
                    <AlreadyVotedBanner
                        party={voteStatus.party}
                        constituency={constituency}
                        district={district}
                    />
                ) : (
                    <>
                        <p className="text-sm font-medium text-gray-700 mb-4">
                            Who would you vote for?
                        </p>

                        {/* Party cards */}
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

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!selected || submitting}
                            className={`
                w-full py-3.5 rounded-xl text-sm font-semibold
                transition-all duration-150
                ${selected && !submitting
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-sm active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                }
              `}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span
                                        className="w-4 h-4 border-2 border-white border-t-transparent
                               rounded-full animate-spin"
                                    />
                                    Submitting...
                                </span>
                            ) : selected ? (
                                `Vote for ${selected} →`
                            ) : (
                                "Select a party to continue"
                            )}
                        </button>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                            This is a community opinion poll — not an official election.
                            <br />
                            One response per device per constituency.
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

// ── Page export — wrap in Suspense (required for useSearchParams) ─────────────
export default function VotePage() {
    return (
        <Suspense fallback={<Spinner label="Loading..." />}>
            <VotePageInner />
        </Suspense>
    );
}
