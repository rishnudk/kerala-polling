"use client";

interface Party {
  id:     string;
  name:   string;
  leader: string;
  color:  string;
  light:  string;
}

interface Props {
  party:    Party;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export function PartyCard({ party, selected, disabled, onSelect }: Props) {
  return (
    <button
      onClick={() => !disabled && onSelect(party.id)}
      disabled={disabled}
      aria-pressed={selected}
      className={`
        w-full text-left rounded-xl border p-4
        transition-all duration-150 outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2
        ${selected
          ? "border-2 shadow-sm"
          : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={
        selected
          ? { borderColor: party.color, backgroundColor: party.light }
          : {}
      }
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left — color dot + text */}
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: party.color }}
          />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: selected ? party.color : "#111827" }}
            >
              {party.id}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{party.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{party.leader}</p>
          </div>
        </div>

        {/* Right — radio circle */}
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center
                     justify-center flex-shrink-0 transition-all duration-150"
          style={
            selected
              ? { borderColor: party.color, backgroundColor: party.color }
              : { borderColor: "#D1D5DB" }
          }
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 12 12"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}