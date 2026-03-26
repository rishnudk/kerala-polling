import type { ReactNode } from "react";
import Link from "next/link";

export default function PollLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold tracking-tight text-gray-900">Kerala Polling</span>
          </Link>
          <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Opinion survey
          </span>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 pb-12 text-center border-t border-gray-50 pt-10">
        <p className="text-xs font-medium text-gray-400">
          This is an independent opinion poll | Not affiliated with any election authority
        </p>
      </footer>
    </div>
  );
}
