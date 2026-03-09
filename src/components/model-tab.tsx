"use client";

import { ChevronLeft, ChevronRight, Cloud } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/lib/icons";
import { MODEL_REGISTRY } from "../../ai/factory";
import { type ImageModel, ModelProvider } from "../../ai/types";

type ProviderTab = {
  value: ModelProvider;
  icon: typeof Icons.GoogleLogo | typeof Cloud;
  providerIds: string[];
};

const PROVIDER_LABELS: Partial<Record<ModelProvider, string>> = {
  [ModelProvider.GOOGLE]: "Google",
  [ModelProvider.OPENAI]: "OpenAI",
  [ModelProvider.XAI]: "xAI",
  [ModelProvider.FAL]: "Fal",
  [ModelProvider.REPLICATE]: "Replicate",
  [ModelProvider.DEEPINFRE]: "DeepInfra",
  [ModelProvider.AMAZON]: "Amazon Bedrock",
};

const PROVIDER_TABS: ProviderTab[] = [
  {
    value: ModelProvider.GOOGLE,
    icon: Icons.GoogleLogo,
    providerIds: ["google", "vertex"],
  },
  {
    value: ModelProvider.OPENAI,
    icon: Icons.Openai,
    providerIds: ["openai"],
  },
  {
    value: ModelProvider.XAI,
    icon: Icons.xAi,
    providerIds: ["xai"],
  },
  {
    value: ModelProvider.FAL,
    icon: Icons.Falai,
    providerIds: ["fal"],
  },
  {
    value: ModelProvider.REPLICATE,
    icon: Icons.ReplicateAi,
    providerIds: ["replicate"],
  },
  {
    value: ModelProvider.DEEPINFRE,
    icon: Icons.DeepInfra,
    providerIds: ["deepinfra"],
  },
  {
    value: ModelProvider.AMAZON,
    icon: Cloud,
    providerIds: ["bedrock"],
  },
];

function getModelsByProvider(provider: ModelProvider) {
  const providerTab = PROVIDER_TABS.find((tab) => tab.value === provider);
  const providerIds = providerTab?.providerIds ?? [];

  return (
    Object.entries(MODEL_REGISTRY) as [
      ImageModel,
      (typeof MODEL_REGISTRY)[ImageModel],
    ][]
  )
    .filter(([, meta]) => providerIds.includes(meta.provider))
    .map(([id, meta]) => ({ id, label: meta.displayName }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function getProviderForModel(model?: ImageModel): ModelProvider {
  if (!model) return PROVIDER_TABS[0]?.value ?? ModelProvider.GOOGLE;

  const meta = MODEL_REGISTRY[model];
  if (!meta) return PROVIDER_TABS[0]?.value ?? ModelProvider.GOOGLE;

  return (
    PROVIDER_TABS.find((tab) => tab.providerIds.includes(meta.provider))?.value ??
    PROVIDER_TABS[0]?.value ??
    ModelProvider.GOOGLE
  );
}

interface ModeltabProps {
  selectedModel?: ImageModel;
  onSelectModel?: (model: ImageModel) => void;
}

export function Modeltab({ selectedModel, onSelectModel }: ModeltabProps) {
  const derivedProvider = useMemo(
    () => getProviderForModel(selectedModel),
    [selectedModel],
  );
  const [activeProvider, setActiveProvider] =
    useState<ModelProvider>(derivedProvider);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setActiveProvider(derivedProvider);
  }, [derivedProvider]);

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
    <Tabs value={activeProvider} onValueChange={(value) => setActiveProvider(value as ModelProvider)} className="w-full">
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
