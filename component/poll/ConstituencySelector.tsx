"use client";

import { CONSTITUENCIES } from "@/data/constituencies";

interface Props {
  district: string;
  value: string;
  onChange: (constituency: string) => void;
  theme?: "light" | "dark";
  highlight?: boolean;
}

export function ConstituencySelector({
  district,
  value,
  onChange,
  theme = "light",
  highlight = false,
}: Props) {
  const options = district ? CONSTITUENCIES[district] ?? [] : [];
  const disabled = !district;
  const isDark = theme === "dark";

  return (
  <div className={`flex flex-col gap-1.5 transition-all duration-500 ${
    highlight ? "scale-[1.02] -translate-y-1" : ""
  }`}>
    <label className={`text-sm font-medium ${isDark ? "text-emerald-50" : "text-gray-700"}`}>
      Constituency{" "}
      <span className={`font-normal ${isDark ? "text-emerald-100/55" : "text-gray-400"}`}>
        (Mandalam)
      </span>
    </label>
    
    {/* This wrapper div handles the glow/ring effect */}
    <div className={`relative transition-all duration-500 ${
      highlight ? "ring-4 ring-green-500/30 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]" : ""
    }`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm transition-colors outline-none focus:border-transparent focus:ring-2 focus:ring-green-500 ${
          disabled
            ? isDark
              ? "cursor-not-allowed border-emerald-100/10 bg-white/5 text-emerald-100/35"
              : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
            : value
              ? isDark
                ? "border-emerald-300/40 bg-[#0e2225] text-emerald-50"
                : "border-green-400 bg-white text-gray-900"
              : isDark
                ? "border-emerald-100/15 bg-[#0e2225] text-emerald-100/55"
                : "border-gray-200 bg-white text-gray-400"
        }`}
      >
        <option value="">
          {disabled ? "Select a district first" : "Select your constituency"}
        </option>
        {options.map((constituency) => (
          <option key={constituency} value={constituency}>
            {constituency}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg className={`h-4 w-4 ${disabled ? (isDark ? "text-emerald-100/25" : "text-gray-200") : (isDark ? "text-emerald-100/55" : "text-gray-400")}`} fill="none" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </div>
    </div>

    {district ? (
      <p className={`text-xs ${isDark ? "text-emerald-100/55" : "text-gray-400"}`}>
        {options.length} constituencies in {district}
      </p>
    ) : null}
  </div>
);

}
