"use client";

import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { STUDIO_ITEMS } from "@/lib/studio-config";

export function Studio() {
  const router = useRouter();
  const pathname = usePathname();

  const selected = STUDIO_ITEMS.find((item) => pathname === item.href) ?? null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-1.5 leading-none">
                <span className="font-medium">Studio</span>
                <span className="text-xs text-muted-foreground">
                  {selected ? selected.label : "Choose a studio"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) gap-1"
            align="start"
          >
            {STUDIO_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DropdownMenuItem
                  key={item.href}
                  onSelect={() => router.push(item.href)}
                  className="flex flex-col items-start gap-0.5 py-2"
                >
                  <div className="flex w-full items-center">
                    <span className="font-medium">{item.label}</span>
                    {isActive && <Check className="ml-auto size-4" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
