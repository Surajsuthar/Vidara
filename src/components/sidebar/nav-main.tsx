"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Studio } from "./studio";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Studio</SidebarGroupLabel>
      <SidebarMenu>
        <Studio />
      </SidebarMenu>
    </SidebarGroup>
  );
}
