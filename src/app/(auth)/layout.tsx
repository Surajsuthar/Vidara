import { Play, Star } from "lucide-react";
import Link from "next/link";
import type React from "react";

const footerLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about-us" },
  { label: "Terms", href: "/terms" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full">
      <section className="hidden md:flex md:w-3/5 items-center justify-center p-12">
        <div className="relative w-full h-full rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-40 pointer-events-none" />

          <div className="relative z-10 p-10 h-full w-full flex flex-col justify-around text-white">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/20 border border-white/30">
                  <Play className="h-5 w-5 fill-white text-white" />
                </div>
                <span className="text-2xl font-semibold tracking-tight">
                  Vidara
                </span>
              </div>

              <div className="space-y-3 max-w-md">
                <h2 className="text-4xl font-bold leading-tight tracking-tight">
                  Create images and videos with{" "}
                  <span className="text-white/60">just a prompt.</span>
                </h2>

                <p className="text-base text-white/60 leading-relaxed">
                  Vidara turns ideas into visuals instantly. Generate cinematic
                  images and videos with AI — built for creators, builders, and
                  storytellers.
                </p>
              </div>
            </div>

            {/* ── Bottom: testimonial + footer links ── */}
            <div className="space-y-6">
              {/* Testimonial */}
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/70 italic leading-relaxed">
                  "Vidara transformed how our team shares product demos. The
                  analytics alone are worth every penny."
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-semibold text-white">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/90">
                      Aisha Patel
                    </p>
                    <p className="text-[11px] text-white/45">
                      Head of Product · Nexlayer
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer links */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/30">
                  © {new Date().getFullYear()} Vidara. All rights reserved.
                </p>
                <nav className="flex items-center gap-4">
                  {footerLinks.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="text-xs text-white/45 hover:text-white/80 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full md:w-2/5 flex items-center justify-center p-6">
        {children}
      </section>
    </main>
  );
}
