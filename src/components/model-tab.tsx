"use client";

import { Cloud } from "lucide-react";
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

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="h-auto w-full justify-start rounded-lg bg-[#2a2a2a] p-1 gap-1 overflow-x-auto flex-nowrap">
        {PROVIDER_TABS.map(({ value, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Icon className="size-3.5 shrink-0" />
            <span>
              {PROVIDER_LABELS[value] ??
                value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
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
