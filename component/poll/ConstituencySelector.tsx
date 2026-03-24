"use client";

import { CONSTITUENCIES } from "@/data/Constituencies";

interface Props {
  district: string;
  value:    string;
  onChange: (constituency: string) => void;
}

export function ConstituencySelector({ district, value, onChange }: Props) {
  const options = district ? CONSTITUENCIES[district] ?? [] : [];
  const disabled = !district;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        Constituency <span className="text-gray-400 font-normal">(Mandalam)</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-xl border px-4 py-3 pr-10
            text-sm transition-colors outline-none
            focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${disabled
              ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
              : value
                ? "bg-white border-green-400 text-gray-900"
                : "bg-white border-gray-200 text-gray-400"
            }
          `}
        >
          <option value="">
            {disabled ? "Select a district first" : "— Select your constituency —"}
          </option>
          {options.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className={`w-4 h-4 ${disabled ? "text-gray-200" : "text-gray-400"}`}
            fill="none" viewBox="0 0 16 16"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Helper: how many constituencies in this district */}
      {district && (
        <p className="text-xs text-gray-400">
          {options.length} constituencies in {district}
        </p>
      )}
    </div>
  );
}
