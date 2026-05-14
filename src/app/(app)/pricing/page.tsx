import { Check, Gift, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import {
  PublicPageFooter,
  PublicPageShell,
} from "@/components/home/public-page-shell";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Pro",
    price: "$19",
    cadence: "per month",
    description:
      "For creators and small teams making daily image concepts and short-form drafts.",
    icon: Sparkles,
    features: [
      "Monthly image and video generation credits",
      "Vertical formats for reels, shorts, and TikTok-style clips",
      "Image model selection and prompt controls",
      "Personal media library",
      "Commercial use for generated assets",
    ],
  },
  {
    name: "Prime",
    price: "$49",
    cadence: "per month",
    description:
      "For higher-volume creative work, campaign testing, and priority iteration.",
    icon: Zap,
    features: [
      "Higher monthly generation credit allowance",
      "Priority access to premium image and video models",
      "Batch creative variants for faster testing",
      "Extended media history and organized library",
      "Early access to new studio workflows",
    ],
  },
];

export default function Pricing() {
  return (
    <PublicPageShell
      eyebrow="Pricing"
      title="Simple plans for AI images and short-form video."
      description="Start with the tier that matches your current creative volume. The details here are intentionally easy to edit when your final limits and prices are ready."
    >
      <section className="px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto mb-5 flex max-w-6xl flex-col gap-5 border border-black/10 bg-[#f7f2eb] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center bg-white text-[#b85f2f]">
              <Gift className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Free signup credits</h2>
              <p className="mt-2 max-w-2xl leading-7 text-black/62">
                Create a free account and get{" "}
                <span className="font-bold">20 welcome credits</span> to try
                image generation before choosing a paid plan.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[#111] text-white hover:bg-[#111]/90">
            <Link href="/auth">Start free</Link>
          </Button>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.name}
                className="flex min-h-full flex-col border border-black/10 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Icon className="size-7 text-[#b85f2f]" />
                    <h2 className="mt-6 text-3xl font-semibold">{plan.name}</h2>
                    <p className="mt-3 leading-7 text-black/62">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-semibold">{plan.price}</p>
                    <p className="mt-1 text-sm text-black/50">{plan.cadence}</p>
                  </div>
                </div>

                <div className="my-8 h-px bg-black/10" />

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm leading-6 text-black/70"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-[#0f766e]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-9 bg-[#111] text-white hover:bg-[#111]/90"
                >
                  <Link href="/auth">Choose {plan.name}</Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#101010] px-4 py-14 text-white sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-medium uppercase text-[#7dd3fc]">
              Product focus
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Credits should support the way creators actually test ideas.
            </h2>
          </div>
          <p className="leading-7 text-white/62">
            Vidara pricing is designed around repeated creative iteration:
            prompt, generate, compare, remix, and save the strongest image or
            vertical video direction for your next post or campaign.
          </p>
        </div>
      </section>

      <PublicPageFooter />
    </PublicPageShell>
  );
}
