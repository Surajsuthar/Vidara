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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>Vidara</SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={authNav} />
        {/*when to upgrade*/}
        <Button variant={"outline"}>Upgrade</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
