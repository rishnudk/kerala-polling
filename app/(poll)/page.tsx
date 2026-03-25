"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeralaDistrictMap } from "@/component/map/KeralaDistrictMap";
import geoData from '@/data/district.geojson'

export default function HomePage() {
  const router = useRouter();
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [step, setStep] = useState<"selection" | "vote" | "results">("selection");

  function handleDistrictChange(nextDistrict: string) {
    setDistrict(nextDistrict);
    setConstituency("");
    setStep("selection");
  }

  function handleContinue() {
    if (!district || !constituency) {
      return;
    }

    setStep("vote");
  }

  return (
    <KeralaDistrictMap
      district={district}
      constituency={constituency}
      onDistrictChange={handleDistrictChange}
      onConstituencyChange={setConstituency}
      onContinue={handleContinue}
      step={step}
      setStep={setStep}
    />
  );
}
