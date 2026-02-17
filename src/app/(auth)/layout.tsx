import type React from "react";
import { BackGroundLayout } from "@/components/auth/masonry-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <BackGroundLayout />
      <section className="absolute inset-0 flex items-center justify-end pr-12 z-[100]">
        {children}
      </section>
    </main>
  );
}
