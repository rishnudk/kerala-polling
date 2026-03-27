"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ConstituencySelector } from "@/component/poll/ConstituencySelector";
import { KERALA_DISTRICT_MAP } from "@/data/kerala-map";
import geoData from '@/data/district.json'
import { geoPath, geoMercator } from 'd3-geo'
import { VoteStep } from "@/component/poll/VoteStep";
import { ResultsStep } from "@/component/poll/ResultsStep";
import { GlobalResults } from "@/component/poll/GlobalResults";
import { UserVoteStatus } from "@/component/poll/UserVoteStatus";
import { RainbowButton } from "../ui/rainbow-button";

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
  const [highlight, setHighlight] = useState(false);
  const mapRef = useRef<SVGSVGElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);


  const activeDistrict = hoveredDistrict || district || "Thiruvananthapuram";
  const activeMeta = useMemo(
    () => KERALA_DISTRICT_MAP.find((item) => item.id === activeDistrict) ?? KERALA_DISTRICT_MAP[0],
    [activeDistrict]
  );

  const projection = geoMercator()
    .fitSize([600, 1200], geoData as any)
  const pathGenerator = geoPath().projection(projection)

  function handleDistrictClick(nextDistrict: string) {
    if (district === nextDistrict) {
      onDistrictChange("");
      onConstituencyChange("");
      return;
    }

    onDistrictChange(nextDistrict);
  }

  useEffect(() => {
    if (district && !constituency) {
      setHighlight(true);

      if (window.innerWidth < 1024) {
        selectRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }
      const timer = setTimeout(() => {
        setHighlight(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [district, constituency])

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white text-gray-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-[1600px] flex-col gap-10 px-6 py-12 lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:px-12">

        {/* MAP SECTION with Floating Text */}
        <section className="relative flex flex-col items-center justify-start pt-0">

          {/* 
             ADJUST TEXT POSITIONING (Desktop only):
             - CHANGE 'top-0 right-4' to move the heading (e.g., 'top-10 right-10')
          */}
          <div className="hidden lg:block absolute top-0 right-39 z-20 max-w-xs text-right animate-in fade-in slide-in-from-right duration-700">
            <h1 className=" font-nunito-sans text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {step === "selection" ? "Choose your district" :
                step === "global_results" ? "Kerala Status" :
                  step === "vote" ? "Cast your vote" : "Live Standings"}
            </h1>
            <div className="h-1.5 w-24 bg-gray-900 ml-auto mt-4 rounded-full" />
          </div>

          {/* 
             ADJUST DESCRIPTION POSITIONING (Desktop only):
             - CHANGE 'top-1/2 -translate-y-1/2 left-0' to move the description
             - CHANGE 'max-w-[240px]' to change the width of the text block
          */}
          <div className="hidden lg:block absolute top-[40%] -translate-y-1/2 left-0 z-20 max-w-[240px] animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <p className="text-xl leading-relaxed text-gray-500 font-medium">
                {step === "selection"
                  ? "Explore all 14 districts, click one to lock it in, and then choose your constituency."
                  : step === "global_results"
                    ? "View the aggregate totals for all parties across every constituency."
                    : "Cast your vote or view real-time polling data."}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
                Interactive Polling Map
              </p>
            </div>
          </div>

          {/* 
             ADJUST MAP SIZE:
             - CHANGE 'h-[85vh]' to increase/decrease the map's vertical height
             - CHANGE 'max-w-[750px]' to increase/decrease the map's horizontal limit
          */}
          <div className="relative flex items-center justify-center w-full h-full -mt-8">
            {/* Floating shadow element behind the map */}
            <div className="absolute inset-0 -top-10 m-auto aspect-6/12 max-h-[90vh] w-full max-w-[1200px] rounded-full bg-gray-200/40 blur-[150px]" />

            <svg
              viewBox="0 0 600 1200"
              className="relative z-10 mx-auto h-[92vh] min-h-[600px] w-full drop-shadow-[0_45px_100px_rgba(0,0,0,0.1)] transition-all duration-700"
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
                    className={`cursor-pointer transition-all duration-500 ease-out outline-none ${step !== 'selection' ? 'pointer-events-none opacity-40 grayscale-[0.8]' : ''}`}
                    fill={isActive ? baseColor : `${baseColor}cc`}
                    stroke={isSelected ? "#000" : "white"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{
                      filter: isSelected ? "drop-shadow(0 0 12px rgba(0,0,0,0.15))" : "none",
                      transform: isSelected ? "scale(1.025)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                )
              })}
            </svg>
          </div>

          {/* Mobile Text (Visible only on mobile) */}
          <div className="lg:hidden mt-10 text-center px-6">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {step === "selection" ? "Choose your district" : "Kerala Poll"}
            </h2>
            <p className="text-gray-500">
              Explore the districts and cast your vote.
            </p>
          </div>

        </section>

        <aside
          ref={selectRef}
          className="lg:sticky lg:top-4 lg:-translate-x-32 z-30">
          <UserVoteStatus />

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
                    highlight={highlight}
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

                  <RainbowButton
                    onClick={() => setStep("global_results")}
                    variant="outline"
                    className="w-full rounded-2xl px-6 py-4 text-xs font-bold transition-all"
                  >
                    View Statewide Standings
                  </RainbowButton>

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
