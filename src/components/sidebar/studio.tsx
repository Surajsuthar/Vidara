"use client";

import { Check, ChevronsUpDown, ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { getStudioItemByMode, STUDIO_ITEMS } from "@/lib/studio-config";

export function Studio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = getStudioItemByMode(searchParams.get("studio"));

  const handleSelect = (item: (typeof STUDIO_ITEMS)[number]) => {
    router.push(item.href);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="border border-white/10 bg-white/[0.04] text-white data-[state=open]:bg-white/10 data-[state=open]:text-white hover:bg-white/8 hover:text-white"
            >
              <div className="flex aspect-square size-8 items-center justify-center border border-white/10 bg-black/30 text-[#f5b86f]">
                {selected ? (
                  <selected.icon className="size-4" />
                ) : (
                  <ImageIcon className="size-4" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 leading-none">
                <span className="font-medium">Studio</span>
                <span className="text-xs text-white/48">
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
              const isActive = item.key === selected.key;
              return (
                <DropdownMenuItem
                  key={item.label}
                  onSelect={() => handleSelect(item)}
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
