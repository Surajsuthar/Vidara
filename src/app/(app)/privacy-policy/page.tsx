import {
  PublicPageFooter,
  PublicPageShell,
} from "@/components/home/public-page-shell";

const sections = [
  {
    title: "Information we use",
    copy: "Vidara may use account details, authentication provider data, prompts, generation settings, media records, and usage events needed to operate the product.",
  },
  {
    title: "Generated content",
    copy: "Prompts and generated media may be processed by AI providers and stored so you can view, manage, and reuse your outputs inside the product.",
  },
  {
    title: "Service providers",
    copy: "The app uses infrastructure, database, storage, email, authentication, analytics, and AI model providers to deliver the service.",
  },
  {
    title: "Your choices",
    copy: "You can manage your connected accounts, sessions, and profile information from settings. Data deletion and export rules should be finalized before production launch.",
  },
];

export default function PrivacyPolicy() {
  return (
    <PublicPageShell
      eyebrow="Privacy"
      title="How Vidara handles product data."
      description="This privacy page is a practical placeholder for the current product. Replace it with reviewed privacy language before launch."
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
