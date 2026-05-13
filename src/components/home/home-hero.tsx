import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroStats, showcaseTiles } from "./home-data";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#070707] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,rgba(241,120,47,0.22),transparent_28%),linear-gradient(315deg,rgba(34,211,238,0.16),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/80">
            <Sparkles className="size-4 text-[#f5b86f]" />
            AI image and short-form video studio
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Create AI images and vertical videos built for feeds.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/68 sm:text-lg">
            Vidara turns prompts into images, shorts, reels, and TikTok-style
            creative so makers can test hooks, styles, and campaign ideas
            without a full production cycle.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/auth">
                Generate now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/explore">
                <Play className="size-4" />
                Explore outputs
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 border border-white/10 bg-black/20">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="border-r border-white/10 px-3 py-4 last:border-r-0 sm:px-5"
              >
                <div className="text-2xl font-semibold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs leading-5 text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden border border-white/12 bg-white/8 p-3 shadow-2xl shadow-black/50">
          <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/70 backdrop-blur">
            <span>Vidara Studio</span>
            <span className="text-[#f5b86f]">rendering 9:16</span>
          </div>
          <div className="grid h-full grid-cols-2 grid-rows-[1fr_0.8fr_0.78fr] gap-3 pt-11">
            {showcaseTiles.map((tile) => (
              <div
                aria-label={tile.alt}
                key={tile.label}
                role="img"
                className={`relative min-h-36 overflow-hidden bg-cover bg-center ${tile.className}`}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute bottom-3 left-3 border border-white/15 bg-black/45 px-2 py-1 text-xs text-white/82 backdrop-blur">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
