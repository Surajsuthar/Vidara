"use client";

import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HomeHeaderProps {
  githubStars?: number | string;
}

export function HomeHeader({ githubStars }: HomeHeaderProps) {
  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-6">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between border border-white/12 bg-[#080808]/80 px-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl sm:h-16 sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center border border-white/15 bg-white text-sm font-black text-black">
            V
          </span>
          <span className="text-lg font-semibold">Vidara</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link
              href="https://github.com/Surajsuthar/dev-notify"
              target="_blank"
            >
              <Github className="size-4" />
              {githubStars ?? "GitHub"}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href="/auth">
              Start creating
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
