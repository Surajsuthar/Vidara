"use client";

import { IconCompass } from "@tabler/icons-react";
import { ArrowUpRight, Folder, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";

import type * as React from "react";
import { useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authNav = useMemo(
    () => [
      {
        title: "Explore",
        url: "/explore",
        icon: IconCompass,
      },
      {
        title: "Media",
        url: "/library",
        icon: Folder,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
    [],
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-white/10 bg-[#0b0b0b] text-white"
      {...props}
    >
      <SidebarHeader className="border-b border-white/10 px-3 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center border border-white/15 bg-white text-sm font-black text-black">
            V
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="font-semibold leading-none">Vidara</span>
            <span className="mt-1 text-xs text-white/45">AI media studio</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={authNav} />
        <Button
          asChild
          variant="outline"
          className="mx-2 mb-2 justify-between border-white/12 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/pricing">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-[#f5b86f]" />
              Upgrade
            </span>
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
