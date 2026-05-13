import { creationSteps, formatCards, productHighlights } from "./home-data";

export function CreationWorkflow() {
  return (
    <section className="bg-[#f7f3ec] px-4 py-16 text-[#161411] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase text-[#b85f2f]">
            Creation workflow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            A production surface for fast social creative.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {creationSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="border border-black/10 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-[#b85f2f]" />
                  <span className="text-sm text-black/38">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-black/62">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FormatGrid() {
  return (
    <section className="bg-[#101010] px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase text-[#7dd3fc]">
            Built for feeds
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Design once, remix across every short-form format.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {formatCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="border border-white/10 bg-white/[0.06] p-5"
              >
                <Icon className="size-6 text-[#f5b86f]" />
                <h3 className="mt-7 text-xl font-semibold">{card.title}</h3>
                <p className="mt-2 leading-7 text-white/60">{card.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductHighlights() {
  return (
    <section className="bg-white px-4 py-16 text-[#111] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-3">
          {productHighlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <article
                key={highlight.label}
                className="border border-black/10 p-6"
              >
                <Icon className="size-6 text-[#0f766e]" />
                <h3 className="mt-8 text-xl font-semibold">
                  {highlight.label}
                </h3>
                <p className="mt-3 leading-7 text-black/62">{highlight.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
