"use client";

import { ChevronLeft, ChevronRight, Cloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/lib/icons";
import { MODEL_REGISTRY } from "../../ai/factory";
import { type ImageModel, ModelProvider } from "../../ai/types";

const PROVIDER_LABELS: Partial<Record<ModelProvider, string>> = {
  [ModelProvider.OPENAI]: "OpenAI",
  [ModelProvider.XAI]: "xAI",
  [ModelProvider.DEEPINFRE]: "DeepInfra",
};

const PROVIDER_TABS: {
  value: ModelProvider;
  icon: typeof Icons.GoogleLogo | typeof Cloud;
}[] = [
  { value: ModelProvider.GOOGLE, icon: Icons.GoogleLogo },
  { value: ModelProvider.OPENAI, icon: Icons.Openai },
  { value: ModelProvider.XAI, icon: Icons.xAi },
  { value: ModelProvider.FAL, icon: Icons.Falai },
  { value: ModelProvider.REPLICATE, icon: Icons.ReplicateAi },
  { value: ModelProvider.DEEPINFRE, icon: Icons.DeepInfra },
  { value: ModelProvider.AMAZON, icon: Cloud },
];

const PROVIDER_MAP: Partial<Record<ModelProvider, string[]>> = {
  [ModelProvider.GOOGLE]: ["google", "vertex"],
  [ModelProvider.OPENAI]: ["openai"],
  [ModelProvider.XAI]: ["xai"],
  [ModelProvider.FAL]: ["fal"],
  [ModelProvider.REPLICATE]: ["replicate"],
  [ModelProvider.DEEPINFRE]: ["deepinfra"],
  [ModelProvider.AMAZON]: ["bedrock"],
};

function getModelsByProvider(
  provider: ModelProvider,
): { id: ImageModel; label: string }[] {
  const providerIds = PROVIDER_MAP[provider] ?? [];
  return (
    Object.entries(MODEL_REGISTRY) as [
      ImageModel,
      (typeof MODEL_REGISTRY)[ImageModel],
    ][]
  )
    .filter(([, meta]) => providerIds.includes(meta.provider))
    .map(([id, meta]) => ({ id, label: meta.displayName }));
}

interface ModeltabProps {
  selectedModel?: ImageModel;
  onSelectModel?: (model: ImageModel) => void;
}

export function Modeltab({ selectedModel, onSelectModel }: ModeltabProps) {
  const defaultTab = PROVIDER_TABS[0]?.value ?? ModelProvider.GOOGLE;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      {/* Scroll wrapper */}
      <div className="relative flex items-center rounded-lg bg-[#2a2a2a]">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className={`
            absolute left-0 z-10 flex h-full items-center px-1
            rounded-l-lg bg-linear-to-r from-[#2a2a2a] via-[#2a2a2a]/80 to-transparent
            transition-opacity duration-150
            ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <ChevronLeft className="size-3.5 text-white/60" />
        </button>

        {/* Scrollable TabsList */}
        <div
          ref={scrollRef}
          className="flex w-full overflow-x-auto scrollbar-none p-1 gap-1 px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <TabsList className="h-auto w-max min-w-full justify-start rounded-none bg-transparent p-0 gap-1 flex-nowrap">
            {PROVIDER_TABS.map(({ value, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white shrink-0"
              >
                <Icon className="size-3.5 shrink-0" />
                <span>
                  {PROVIDER_LABELS[value] ??
                    value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className={`
            absolute right-0 z-10 flex h-full items-center px-1
            rounded-r-lg bg-linear-to-l from-[#2a2a2a] via-[#2a2a2a]/80 to-transparent
            transition-opacity duration-150
            ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <ChevronRight className="size-3.5 text-white/60" />
        </button>
      </div>

      {/* Tab content */}
      {PROVIDER_TABS.map(({ value }) => {
        const models = getModelsByProvider(value);
        return (
          <TabsContent
            key={value}
            value={value}
            className="mt-2 space-y-0.5 focus-visible:outline-none overflow-y-auto max-h-[280px]"
          >
            {models.map(({ id, label }) => (
              <button
                type="button"
                key={id}
                onClick={() => onSelectModel?.(id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  id === selectedModel
                    ? "text-white bg-white/8"
                    : "text-[#888] hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
