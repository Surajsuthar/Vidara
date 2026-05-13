import { Film, ImageIcon, Layers3, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

const footerLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about-us" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy-policy" },
];

const productSignals = [
  { label: "AI images", Icon: ImageIcon },
  { label: "Short video", Icon: Film },
  { label: "Creative variants", Icon: Layers3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <Image
        src="/auth-studio-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.95)_0%,rgba(7,7,7,0.72)_44%,rgba(7,7,7,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,184,111,0.18),transparent_30%)]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex min-h-[48vh] flex-col justify-between px-5 py-6 sm:px-8 lg:min-h-screen lg:px-12 lg:py-10">
          <Link href="/" className="flex w-fit items-center gap-3">
            <span className="grid size-10 place-items-center border border-white/15 bg-white text-sm font-black text-black">
              V
            </span>
            <span className="text-xl font-semibold">Vidara</span>
          </Link>

          <div className="max-w-2xl py-12 lg:py-0">
            <div className="mb-5 inline-flex items-center gap-2 border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/76 backdrop-blur">
              <Play className="size-4 fill-[#f5b86f] text-[#f5b86f]" />
              Image and short-video generation studio
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Sign in and start shaping feed-ready creative.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
              Generate AI images, reel concepts, shorts, and campaign variants
              from a single creative workspace.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {productSignals.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="border border-white/10 bg-black/30 px-4 py-4 backdrop-blur"
                >
                  <Icon className="size-5 text-[#f5b86f]" />
                  <p className="mt-4 text-sm text-white/76">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <footer className="hidden items-center justify-between gap-4 text-xs text-white/42 lg:flex">
            <p>© {new Date().getFullYear()} Vidara.</p>
            <nav className="flex items-center gap-4">
              {footerLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-white/80"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </footer>
        </section>

        <section className="flex items-center justify-center px-5 pb-8 sm:px-8 lg:px-12 lg:py-10">
          {children}
        </section>
      </div>
    </main>
  );
}
