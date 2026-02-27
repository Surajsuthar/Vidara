"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useGithub } from "@/hooks/use-github-count";
import { useSession } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface DashboardProviderProps {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { stargazers_count } = useGithub();
  const { data: session, isPending } = useSession();

  return (
    <section className="w-full h-full">
      <div className="h-[50] border-b fixed p-2 bg-sidebar w-full right-1">
        <div className="flex justify-end gap-1.5">
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
                  : "Upgrad for More credit"}
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Link
                  className="flex justify-center items-center gap-0.5"
                  href={"#"}
                  target="_blank"
                >
                  <Github />
                  <p>{stargazers_count}</p>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Github stars</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <main className="mt-[51]">{children}</main>
    </section>
  );
}
