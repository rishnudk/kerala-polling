"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConstituencySelector } from "@/component/poll/ConstituencySelector";
import { DistrictSelector } from "@/component/poll/DistrictSelector";
import { StepIndicator } from "@/component/ui/StepIndicator";

export default function HomePage() {
  const router = useRouter();

  const [district,      setDistrict]      = useState("");
  const [constituency,  setConstituency]  = useState("");

  // Reset constituency whenever district changes
  function handleDistrictChange(d: string) {
    setDistrict(d);
    setConstituency("");
  }

  function handleContinue() {
    if (!district || !constituency) return;
    router.push(
      `/vote?constituency=${encodeURIComponent(constituency)}&district=${encodeURIComponent(district)}`
    );
  }

  const canContinue = !!district && !!constituency;

  return (
    <div className="max-w-md mx-auto px-4 py-8">

      <StepIndicator current={1} />

      {/* Hero text */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Kerala election poll
        </h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Share your opinion. Select your constituency and cast
          your preference — no sign-in needed.
        </p>
      </div>

      {/* Selection card */}
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm p-5 flex flex-col gap-5">

        <DistrictSelector
          value={district}
          onChange={handleDistrictChange}
        />

        <ConstituencySelector
          district={district}
          value={constituency}
          onChange={setConstituency}
        />

        {/* Selected summary pill */}
        {canContinue && (
          <div className="flex items-center gap-2 bg-green-50 border
                          border-green-100 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-green-800">{constituency}</span>
              <span className="text-green-600"> · {district}</span>
            </div>
          </div>
        )}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`
          mt-5 w-full py-4 rounded-xl text-sm font-semibold
          transition-all duration-200
          ${canContinue
            ? "bg-green-600 hover:bg-green-700 text-white shadow-sm active:scale-[0.98]"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }
        `}
      >
        {canContinue ? `Continue to vote →` : "Select a constituency to continue"}
      </button>

      {/* Info pills */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          "No sign-in needed",
          "Anonymous poll",
          "One vote per constituency",
        ].map((text) => (
          <span
            key={text}
            className="text-xs text-gray-400 bg-white border border-gray-100
                       rounded-full px-3 py-1"
          >
            {text}
          </span>
        ))}
      </div>

    </div>
  );
}
