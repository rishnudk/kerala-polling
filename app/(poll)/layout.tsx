import type { ReactNode } from "react";

export default function PollLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          {/* Kerala flag-inspired dot */}
          <div className="w-2 h-2 rounded-full bg-green-600" />
          <span className="text-sm font-semibold text-gray-800">Kerala Poll</span>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100
                           px-2 py-0.5 rounded-full">
            Opinion survey
          </span>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <p className="text-xs text-gray-400">
          This is an independent opinion poll · Not affiliated with any
          election authority
        </p>
      </footer>
    </div>
  );
}