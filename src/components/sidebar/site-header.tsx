"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGenerateContext } from "@/context/generate-context";
import { useGithub } from "@/hooks/use-github-count";
import { useSession } from "@/lib/auth-client";
import { STUDIO_ITEMS } from "@/lib/studio-config";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { stargazers_count } = useGithub();
  const { data: session, isPending } = useSession();
  const { resource } = useGenerateContext();
  const pathname = usePathname();

  const studioItem = STUDIO_ITEMS.find(
    (item) => `${item.slug[0]}/${item.slug[1]}` === resource,
  );
  const pageTitle = studioItem?.label ?? pathname.split("/").pop();

  // Build breadcrumb from context resource
  const user = session?.user
    ? {
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        avatar: session.user.image ?? "",
      }
    : null;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60 sticky top-0 z-40 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4">
        {pageTitle && (
          <>
            <h1 className="text-base font-medium">{pageTitle}</h1>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Credits */}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
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
              <Button variant="outline" size="sm" asChild>
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
            <Button asChild size="sm">
              <Link href="/auth">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
