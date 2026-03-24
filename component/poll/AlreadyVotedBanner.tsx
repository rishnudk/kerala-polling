"use client";

import { useRouter } from "next/navigation";
import { PARTIES }   from "@/data/parties";

interface Props {
  party:        string;
  constituency: string;
  district:     string;
}

export function AlreadyVotedBanner({ party, constituency, district }: Props) {
  const router  = useRouter();
  const matched = PARTIES.find((p) => p.id === party);

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-5">
      {/* Icon + message */}
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-green-500
                     flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 14 14">
            <path
              d="M2 7l3.5 3.5L12 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-green-800">
            Vote already recorded
          </p>
          <p className="text-sm text-green-700 mt-1 leading-relaxed">
            You voted for{" "}
            <span className="font-semibold">
              {matched?.name ?? party}
            </span>{" "}
            in{" "}
            <span className="font-semibold">{constituency}</span>,{" "}
            {district}.
          </p>
          <p className="text-xs text-green-600 mt-1">
            One vote allowed per device per constituency.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() =>
          router.push(
            `/results/${encodeURIComponent(constituency)}?district=${encodeURIComponent(district)}`
          )
        }
        className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold
                   text-white bg-green-600 hover:bg-green-700
                   transition-colors duration-150"
      >
        See live results →
      </button>
    </div>
  );
}