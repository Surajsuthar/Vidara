import ChatInterface from "@/components/chat-interface";
import { getStudioItemByMode } from "@/lib/studio-config";

type StudioPageProps = {
  searchParams?: Promise<{
    studio?: string;
  }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const params = await searchParams;
  const studioItem = getStudioItemByMode(params?.studio);

  return (
    <section className="relative min-h-[calc(100vh-var(--header-height)-2rem)] overflow-hidden border border-white/10 bg-[#101010]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(245,184,111,0.18),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(125,211,252,0.12),transparent_26%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 text-center sm:pt-18">
        <p className="text-sm font-medium uppercase text-[#f5b86f]">
          Vidara Studio
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
          Create images and short-form creative from prompts.
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-white/58">
          Choose a model, tune the generation settings, and build visual
          directions for reels, shorts, campaigns, and product ideas.
        </p>
      </div>
      <ChatInterface studioMode={studioItem.key} />
    </section>
  );
}
