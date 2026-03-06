"use client";

import { IconCompass } from "@tabler/icons-react";
import { Folder, Settings2 } from "lucide-react";

import type * as React from "react";
import { useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
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
        title: "library",
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>Vidara</SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavSecondary items={authNav} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
