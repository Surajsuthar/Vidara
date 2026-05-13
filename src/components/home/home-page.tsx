"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGithub } from "@/hooks/use-github-count";
import { useSession } from "@/lib/auth-client";
import { HomeFooter } from "./home-footer";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import {
  CreationWorkflow,
  FormatGrid,
  ProductHighlights,
} from "./product-sections";

export function HomePage() {
  const router = useRouter();
  const { stargazers_count: githubStars } = useGithub();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/explore");
    }
  }, [router, session?.user]);

  if (session?.user || isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070707] text-white">
        <span className="text-sm text-white/55">Loading Vidara...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <HomeHeader githubStars={githubStars} />
      <HomeHero />
      <CreationWorkflow />
      <FormatGrid />
      <ProductHighlights />
      <HomeFooter />
    </main>
  );
}
