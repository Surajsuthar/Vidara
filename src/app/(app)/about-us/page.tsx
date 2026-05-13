import { Clapperboard, Images, Layers3 } from "lucide-react";
import {
  PublicPageFooter,
  PublicPageShell,
} from "@/components/home/public-page-shell";

const principles = [
  {
    icon: Images,
    title: "Make visual iteration faster",
    copy: "Vidara exists to reduce the gap between an idea and a usable image, thumbnail, or campaign direction.",
  },
  {
    icon: Clapperboard,
    title: "Design for short-form media",
    copy: "The product treats vertical video, reels, shorts, and TikTok-style creative as first-class outputs.",
  },
  {
    icon: Layers3,
    title: "Keep creators in control",
    copy: "Model choice, prompt settings, media history, and organized outputs should stay clear and editable.",
  },
];

export default function AboutUs() {
  return (
    <PublicPageShell
      eyebrow="About Vidara"
      title="A creative studio for AI images and feed-ready video."
      description="Vidara is built for people who need to move quickly from idea to visual asset: creators, makers, marketers, and small teams testing social content."
    >
      <section className="px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal">
              The product goal is simple: make strong creative drafts easier to
              produce.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-black/66">
            <p>
              Vidara combines AI image generation, short-video generation, model
              selection, and media organization into one focused workflow. The
              experience is meant to help users test ideas before they commit to
              a larger production process.
            </p>
            <p>
              The interface favors practical creative work: clear prompts,
              useful generation controls, fast output review, and a library that
              keeps finished media accessible.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <article
                key={principle.title}
                className="border border-black/10 p-6"
              >
                <Icon className="size-6 text-[#b85f2f]" />
                <h3 className="mt-8 text-xl font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 leading-7 text-black/62">{principle.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <PublicPageFooter />
    </PublicPageShell>
  );
}
