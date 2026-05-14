import { Film, ImageIcon, Library, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const libraryStats = [
  { label: "Generated images", value: "0", Icon: ImageIcon },
  { label: "Short video drafts", value: "0", Icon: Film },
  { label: "Saved variants", value: "0", Icon: Sparkles },
];

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-var(--header-height)-2rem)] border border-white/10 bg-[#101010]">
      <div className="border-b border-white/10 px-4 py-8 sm:px-6">
        <p className="text-sm font-medium uppercase text-[#f5b86f]">Library</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal">
          Your generated media will live here.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-white/58">
          Keep images, vertical video drafts, thumbnails, and campaign variants
          organized as Vidara generations are saved.
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
        {libraryStats.map(({ label, value, Icon }) => (
          <article
            key={label}
            className="border border-white/10 bg-white/[0.04] p-5"
          >
            <Icon className="size-5 text-[#7dd3fc]" />
            <p className="mt-6 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-white/48">{label}</p>
          </article>
        ))}
      </div>

      <div className="mx-4 mb-4 grid min-h-80 place-items-center border border-dashed border-white/12 bg-black/20 p-8 text-center sm:mx-6 sm:mb-6">
        <div className="max-w-md">
          <Library className="mx-auto size-9 text-[#f5b86f]" />
          <h3 className="mt-5 text-xl font-semibold">No saved media yet</h3>
          <p className="mt-3 leading-7 text-white/52">
            Generate your first image or creative direction and it will appear
            here once persistence is connected to the library view.
          </p>
          <Button
            asChild
            className="mt-6 bg-white text-black hover:bg-white/90"
          >
            <Link href="/generate?studio=generate-image">Create media</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
