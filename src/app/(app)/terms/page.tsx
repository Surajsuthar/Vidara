import {
  PublicPageFooter,
  PublicPageShell,
} from "@/components/home/public-page-shell";

const sections = [
  {
    title: "Use of the product",
    copy: "Vidara provides tools for creating AI-generated images and short-form video. You are responsible for prompts, uploaded inputs, generated outputs you publish, and how those outputs are used.",
  },
  {
    title: "Accounts and access",
    copy: "Keep your account secure and use accurate sign-in information. Access may be limited or removed if the product is misused, abused, or used to harm other people or services.",
  },
  {
    title: "Generated media",
    copy: "Generated images and videos may be stored in your Vidara library. You should review outputs before publishing and make sure your use complies with applicable laws, platform rules, and third-party rights.",
  },
  {
    title: "Credits and plans",
    copy: "Paid plans and generation credits may change as the product evolves. Final pricing, limits, refunds, and billing rules should be reviewed before launch and updated here.",
  },
];

export default function Terms() {
  return (
    <PublicPageShell
      eyebrow="Terms"
      title="Terms for using Vidara."
      description="This page is a clear product-oriented starting point. Replace it with reviewed legal terms before production launch."
    >
      <section className="px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="border border-black/10 bg-white p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 leading-7 text-black/62">{section.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicPageFooter />
    </PublicPageShell>
  );
}
