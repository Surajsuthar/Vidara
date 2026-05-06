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

  return <ChatInterface studioMode={studioItem.key} />;
}
