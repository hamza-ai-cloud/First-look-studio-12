import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin - First Look Studio',
  description: 'First Look Studio administration dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-wide text-white">
              First Look Studio
            </p>
            <p className="hidden text-xs text-gray-500 sm:block">
              Administration
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <span
              className="h-2 w-2 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-gray-300">
              Admin
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
