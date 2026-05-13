import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface PublicPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}: PublicPageShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#15130f]">
      <header className="border-b border-black/10 bg-[#070707] px-4 py-4 text-white sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-8 place-items-center border border-white/15 bg-white text-sm font-black text-black">
              V
            </span>
            <span className="text-lg font-semibold">Vidara</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/64 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </nav>
      </header>

      <section className="border-b border-black/10 px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase text-[#b85f2f]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-black/62 sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      {children}
    </main>
  );
}

export function PublicPageFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-black/58 sm:flex-row sm:items-center sm:justify-between">
        <p>Vidara builds AI image and short-video tools for social creative.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="hover:text-black" href="/pricing">
            Pricing
          </Link>
          <Link className="hover:text-black" href="/about-us">
            About us
          </Link>
          <Link className="hover:text-black" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-black" href="/privacy-policy">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
