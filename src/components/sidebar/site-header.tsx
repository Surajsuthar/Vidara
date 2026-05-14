"use client";

import { Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGithub } from "@/hooks/use-github-count";
import { useSession } from "@/lib/auth-client";
import { getStudioItemByMode } from "@/lib/studio-config";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { stargazers_count } = useGithub();
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageTitle =
    pathname === "/generate"
      ? getStudioItemByMode(searchParams.get("studio")).label
      : pathname.split("/").pop();

  const user = session?.user
    ? {
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        avatar: session.user.image ?? "",
      }
    : null;

  const formattedTitle = pageTitle
    ? pageTitle
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Studio";

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/10 bg-[#070707]/88 text-white backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4">
        {formattedTitle && (
          <>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#f5b86f]" />
              <h1 className="text-sm font-medium sm:text-base">
                {formattedTitle}
              </h1>
            </div>
            <Separator
              orientation="vertical"
              className="mx-2 bg-white/12 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Credits */}
          <Separator
            orientation="vertical"
            className="mx-2 hidden bg-white/12 data-[orientation=vertical]:h-4 sm:block"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-white/12 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                {!isPending && session?.user ? "0.00" : "0.00"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!isPending && session?.user
                  ? "Total credit remaining"
                  : "Upgrade for more credit"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* GitHub */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-white/12 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link
                  href="https://github.com/Surajsuthar/Vidara"
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  <span>{stargazers_count}</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub stars</p>
            </TooltipContent>
          </Tooltip>

          {/* Auth */}
          {user ? (
            <NavUser user={user} />
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/auth">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
