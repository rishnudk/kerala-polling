"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeralaDistrictMap } from "@/component/map/KeralaDistrictMap";
import geoData from '@/data/district.geojson'

export default function HomePage() {
  const router = useRouter();
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");

  function handleDistrictChange(nextDistrict: string) {
    setDistrict(nextDistrict);
    setConstituency("");
  }

  function handleContinue() {
    if (!district || !constituency) {
      return;
    }

    router.push(
      `/vote?constituency=${encodeURIComponent(constituency)}&district=${encodeURIComponent(district)}`
    );
  }

  return (
    <KeralaDistrictMap
      district={district}
      constituency={constituency}
      onDistrictChange={handleDistrictChange}
      onConstituencyChange={setConstituency}
      onContinue={handleContinue}
    />
  );
}
