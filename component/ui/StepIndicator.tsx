interface Props {
  current: number; // 1, 2, or 3
}

const STEPS = ["Select", "Vote", "Results"];

export function StepIndicator({ current }: Props) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((label, i) => {
        const stepNum  = i + 1;
        const done     = stepNum < current;
        const active   = stepNum === current;

        return (
          <div key={label} className="flex items-center gap-1">
            {/* Circle */}
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  text-xs font-semibold transition-colors
                  ${done   ? "bg-green-500 text-white"
                  : active ? "bg-green-600 text-white ring-4 ring-green-100"
                           : "bg-gray-100 text-gray-400"}
                `}
              >
                {done ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : stepNum}
              </div>
              <span
                className={`text-xs font-medium ${
                  active ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${
                  done ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}