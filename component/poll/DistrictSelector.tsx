"use client";

import { DISTRICTS } from "@/data/constituencies";

interface Props {
  value:    string;
  onChange: (district: string) => void;
}

export function DistrictSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        District
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full appearance-none rounded-xl border px-4 py-3 pr-10
            text-sm bg-white transition-colors outline-none
            focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${value ? "border-green-400 text-gray-900" : "border-gray-200 text-gray-400"}
          `}
        >
          <option value="">— Select your district —</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
