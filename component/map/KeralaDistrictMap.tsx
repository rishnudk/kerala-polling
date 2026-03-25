"use client";

import { useMemo, useState } from "react";
import { ConstituencySelector } from "@/component/poll/ConstituencySelector";
import { KERALA_DISTRICT_MAP } from "@/data/kerala-map";
import geoData from '@/data/district.json'
import { geoPath, geoMercator } from 'd3-geo'
import { VoteStep } from "@/component/poll/VoteStep";
import { ResultsStep } from "@/component/poll/ResultsStep";
import { GlobalResults } from "@/component/poll/GlobalResults";

interface Props {
  district: string;
  constituency: string;
  onDistrictChange: (district: string) => void;
  onConstituencyChange: (constituency: string) => void;
  onContinue: () => void;
  step: "selection" | "vote" | "results" | "global_results";
  setStep: (step: "selection" | "vote" | "results" | "global_results") => void;
}

export function KeralaDistrictMap({
  district,
  constituency,
  onDistrictChange,
  onConstituencyChange,
  onContinue,
  step,
  setStep,
}: Props) {
  const [hoveredDistrict, setHoveredDistrict] = useState("");

  const activeDistrict = hoveredDistrict || district || "Thiruvananthapuram";
  const activeMeta = useMemo(
    () => KERALA_DISTRICT_MAP.find((item) => item.id === activeDistrict) ?? KERALA_DISTRICT_MAP[0],
    [activeDistrict]
  );

  const projection = geoMercator()
  .fitSize([400, 1000], geoData as any) 
  const pathGenerator = geoPath().projection(projection)

  function handleDistrictClick(nextDistrict: string) {
    if (district === nextDistrict) {
      onDistrictChange("");
      onConstituencyChange("");
      return;
    }

    onDistrictChange(nextDistrict);
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[radial-gradient(circle_at_top_left,_rgba(74,222,128,0.18),_transparent_28%),linear-gradient(145deg,_#08131a,_#0d1f24_45%,_#10271f)] text-[#ebfff5]">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col gap-10 px-5 py-8 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
        <section className="flex flex-col gap-6">
          <div className="max-w-xl">
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {step === "selection" ? "Choose your district" : 
               step === "global_results" ? "Kerala Statewide Standings" :
               step === "vote" ? "Cast your vote" : "Live Standings"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-emerald-50/70 sm:text-base">
              {step === "selection" 
                ? "Explore all 14 districts, click one to lock it in, and then choose your constituency to continue to the poll."
                : step === "global_results"
                ? "View the aggregate totals for all parties across every constituency in Kerala."
                : step === "vote" 
                ? "Select a party to cast your vote for this constituency. Your response is anonymous and counted instantly."
                : "See how the community is responding to the poll in real-time."}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200/10 bg-[#071117]/70 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <svg
              viewBox="0 0 400 1000"
              className="relative z-10 mx-auto h-[75vh] min-h-[500px] w-full max-w-[600px]"
              role="img"
              aria-label="Interactive Kerala district map"
            >
              {geoData.features.map((feature: any, i: number) => {
                const districtName = feature.properties.DISTRICT
                const path = pathGenerator(feature)

                const isSelected = district === districtName
                const isHovered = hoveredDistrict === districtName
                const isActive = isSelected || isHovered

                return (
                  <path
                    key={i}
                    d={path || ''}
                    onMouseEnter={() => setHoveredDistrict(districtName)}
                    onMouseLeave={() => setHoveredDistrict('')}
                    onClick={() => handleDistrictClick(districtName)}
                    className={`cursor-pointer transition-all duration-300 ${step !== 'selection' ? 'pointer-events-none opacity-50' : ''}`}
                    fill={isActive ? "#5bf0a5" : "#184735"}
                    stroke={isActive ? "#d3ffe8" : "#4d8c72"}
                    strokeWidth={isSelected ? 4 : 1}
                  />
                )
              })}
            </svg>
          </div>
        </section>

        <aside className="relative overflow-hidden rounded-[2rem] border border-emerald-300/10 bg-[#0a1820]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur min-h-[500px] flex flex-col">
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(63,230,141,0.18),transparent)]" />
          
          {step === "selection" && (
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
                District panel
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                {activeMeta.id}
              </h2>
              <p className="mt-2 text-2xl text-emerald-200">
                {activeMeta.malayalam}
              </p>
              <div className="mt-6 rounded-2xl border border-emerald-200/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/55">
                  Capital
                </p>
                <p className="mt-2 text-lg font-medium text-emerald-50">
                  {activeMeta.capital}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-200/10 bg-white/5 p-4">
                <p className="text-sm leading-7 text-emerald-50/75">
                  {district
                    ? "District locked in. Pick a constituency below to continue to the voting step."
                    : "Hover to preview a district. Click once to select it, and click again to clear it."}
                </p>
              </div>

              <div className="mt-6">
                <ConstituencySelector
                  district={district}
                  value={constituency}
                  onChange={onConstituencyChange}
                  theme="dark"
                />
              </div>

              <button
                onClick={onContinue}
                disabled={!district || !constituency}
                className={`mt-6 w-full rounded-2xl px-4 py-4 text-sm font-semibold transition-all duration-300 ${district && constituency
                    ? "bg-emerald-300 text-[#062316] shadow-[0_18px_50px_rgba(91,240,165,0.35)] hover:bg-emerald-200"
                    : "cursor-not-allowed bg-white/10 text-emerald-50/35"
                  }`}
              >
                {district && constituency
                  ? `Continue with ${constituency}`
                  : "Select district and constituency"}
              </button>

              <button
                onClick={() => setStep("global_results")}
                className="mt-4 w-full rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-400/10"
              >
                View Statewide Standings
              </button>
            </div>
          )}

          {step === "vote" && (
            <VoteStep 
              district={district}
              constituency={constituency}
              onBack={() => setStep("selection")}
              onSuccess={() => setStep("results")}
            />
          )}

          {step === "results" && (
            <ResultsStep 
              district={district}
              constituency={constituency}
              onBack={() => setStep("selection")}
            />
          )}

          {step === "global_results" && (
            <GlobalResults 
              onBack={() => setStep("selection")}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
