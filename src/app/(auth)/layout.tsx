import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full">
      <section className="hidden md:flex md:w-3/5 items-center justify-center p-12">
        <div className="relative w-full h-full rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-40 pointer-events-none" />
          <div className="relative z-10 h-full w-full flex items-center justify-center text-white/70">
            Glass Area
          </div>
        </div>
      </section>
      <section className="w-full md:w-2/5 flex items-center justify-center p-6">
        {children}
      </section>
    </main>
  );
}
