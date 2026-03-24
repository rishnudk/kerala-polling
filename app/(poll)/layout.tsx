import type { ReactNode } from "react";

export default function PollLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08131a]">
      <header className="border-b border-emerald-200/10 bg-[#08131a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(91,240,165,0.75)]" />
          <span className="text-sm font-semibold text-emerald-50">Kerala Poll</span>
          <span className="ml-auto rounded-full bg-emerald-200/10 px-2 py-0.5 text-xs text-emerald-100/65">
            Opinion survey
          </span>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 pb-8 text-center">
        <p className="text-xs text-emerald-100/45">
          This is an independent opinion poll | Not affiliated with any election authority
        </p>
      </footer>
    </div>
  );
}
