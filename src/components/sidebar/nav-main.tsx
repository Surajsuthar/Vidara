"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { MessageHistorys } from "../message-history";
import { Studio } from "./studio";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/42">Studio</SidebarGroupLabel>
      <SidebarMenu>
        <Studio />
      </SidebarMenu>
      <SidebarGroupLabel className="mt-4 text-white/42">
        Recent work
      </SidebarGroupLabel>
      <SidebarGroup>
        <MessageHistorys />
      </SidebarGroup>
    </SidebarGroup>
  );
}
