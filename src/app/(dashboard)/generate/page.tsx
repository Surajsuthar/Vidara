import ChatInterface from "@/components/chat-interface";
import { STUDIO_ITEMS } from "@/lib/studio-config";

export function generateStaticParams() {
  return STUDIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export default async function StudioPage() {
  return <ChatInterface />;
}
