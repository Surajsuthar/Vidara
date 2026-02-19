import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <section className="absolute inset-0 flex items-center justify-end pr-12 z-100">
        {children}
      </section>
    </main>
  );
}
