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

const DISTRICT_COLORS: Record<string, string> = {
  Thiruvananthapuram: "#3b82f6", // Blue
  Kollam: "#10b981",             // Emerald
  Pathanamthitta: "#f59e0b",     // Amber
  Alappuzha: "#ef4444",          // Red
  Kottayam: "#8b5cf6",           // Violet
  Idukki: "#06b6d4",             // Cyan
  Ernakulam: "#ec4899",          // Pink
  Thrissur: "#f97316",           // Orange
  Palakkad: "#22c55e",           // Green
  Malappuram: "#6366f1",         // Indigo
  Kozhikode: "#eab308",          // Yellow
  Wayanad: "#d946ef",            // Fuchsia
  Kannur: "#14b8a6",             // Teal
  Kasaragod: "#f43f5e",          // Rose
};

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
    <div className="min-h-[calc(100vh-73px)] bg-white text-gray-900 font-sans">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col gap-10 px-6 py-12 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:px-12">
        <section className="flex flex-col gap-8">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              {step === "selection" ? "Choose your district" :
                step === "global_results" ? "Kerala Statewide Standings" :
                step === "vote" ? "Cast your vote" : "Live Standings"}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-500">
              {step === "selection"
                ? "Explore all 14 districts, click one to lock it in, and then choose your constituency to continue to the poll."
                : step === "global_results"
                  ? "View the aggregate totals for all parties across every constituency in Kerala."
                  : step === "vote"
                    ? "Select a party to cast your vote for this constituency. Your response is anonymous and counted instantly."
                    : "See how the community is responding to the poll in real-time."}
            </p>
          </div>

          <div className="relative flex items-center justify-center p-4">
            {/* Floating shadow element behind the map */}
            <div className="absolute inset-0 m-auto aspect-4/10 max-h-[70vh] w-full max-w-[400px] rounded-full bg-gray-200/30 blur-[100px]" />
            
            <svg
              viewBox="0 0 400 1000"
              className="relative z-10 mx-auto h-[75vh] min-h-[500px] w-full max-w-[500px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              role="img"
              aria-label="Interactive Kerala district map"
            >
              {geoData.features.map((feature: any, i: number) => {
                const districtName = feature.properties.DISTRICT
                const path = pathGenerator(feature)

                const isSelected = district === districtName
                const isHovered = hoveredDistrict === districtName
                const isActive = isSelected || isHovered
                const baseColor = DISTRICT_COLORS[districtName] || "#cbd5e1"

                return (
                  <path
                    key={i}
                    d={path || ''}
                    onMouseEnter={() => setHoveredDistrict(districtName)}
                    onMouseLeave={() => setHoveredDistrict('')}
                    onClick={() => handleDistrictClick(districtName)}
                    className={`cursor-pointer transition-all duration-500 ease-out outline-none ${step !== 'selection' ? 'pointer-events-none opacity-40 grayscale-[0.5]' : ''}`}
                    fill={isActive ? baseColor : `${baseColor}cc`}
                    stroke={isSelected ? "#000" : "white"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{
                      filter: isSelected ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))" : "none",
                      transform: isSelected ? "scale(1.01)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                )
              })}
            </svg>
          </div>
        </section>

        <aside className="lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-50/50 p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl min-h-[550px] flex flex-col transition-all duration-300">
            {step === "selection" && (
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Current Selection
                  </p>
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {activeMeta.id}
                  </h2>
                  <p className="mt-1 text-2xl font-medium text-gray-400 italic">
                    {activeMeta.malayalam}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                      Capital
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {activeMeta.capital}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm leading-relaxed text-gray-500">
                      {district
                        ? "Great! Now select your constituency to proceed to voting."
                        : "Hover over the map to explore. Click a district to start."}
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-6">
                  <ConstituencySelector
                    district={district}
                    value={constituency}
                    onChange={onConstituencyChange}
                    theme="light"
                  />

                  <button
                    onClick={onContinue}
                    disabled={!district || !constituency}
                    className={`group relative w-full overflow-hidden rounded-2xl px-6 py-5 text-sm font-bold transition-all duration-300 ${district && constituency
                      ? "bg-gray-900 text-white shadow-xl hover:bg-black hover:-translate-y-1 active:translate-y-0"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {district && constituency
                        ? `Continue with ${constituency} →`
                        : "Select district & constituency"}
                    </span>
                  </button>

                  <button
                    onClick={() => setStep("global_results")}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
                  >
                    View Statewide Standings
                  </button>
                </div>
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
          </div>
        </aside>
      </div>
    </div>
  );
}
