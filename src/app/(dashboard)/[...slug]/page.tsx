import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatInterface from "@/components/chat-interface";
import {
  buildStudioMetadata,
  isValidStudioSlug,
  STUDIO_ITEMS,
} from "@/lib/studio-config";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildStudioMetadata(slug.join("/"));
}

export function generateStaticParams() {
  return STUDIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export default async function StudioPage({ params }: Props) {
  const { slug } = await params;

  if (!isValidStudioSlug(slug)) {
    notFound();
  }

  console.log("slug", slug.join("/"))

  return <ChatInterface />;
}
