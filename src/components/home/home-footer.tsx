import Link from "next/link";

const footerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about-us", label: "About us" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
];

export function HomeFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#070707] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">Vidara</p>
          <p className="mt-1 text-sm text-white/50">
            AI images and short-form video for social creative.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
