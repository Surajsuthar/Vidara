import {
  type ImageModel,
  ModelProvider,
  mediaType,
  type resourceType,
} from "../../ai/model";

type PricingKey = string;

export const CREDIT_VALUE = 0.01;
export const MARK_UP = 3;

interface IImagePricingMatrix {
  media: mediaType.IMAGE;
  modelName: ImageModel;
  resourceType: resourceType;
  pricing: Record<PricingKey, number>;
}

export const modelPricingMatrix: Partial<
  Record<ModelProvider, IImagePricingMatrix[]>
> = {};

modelPricingMatrix[ModelProvider.OPENAI] = [
  {
    media: mediaType.IMAGE,
    modelName: "gpt-image-1.5",
    resourceType: "text-to-image",
    pricing: {
      "quality:low|ratio:1:1": 0.009,
      "quality:low|ratio:2:3": 0.013,
      "quality:low|ratio:3:2": 0.013,
      "quality:medium|ratio:1:1": 0.034,
      "quality:medium|ratio:2:3": 0.05,
      "quality:medium|ratio:3:2": 0.05,
      "quality:high|ratio:1:1": 0.133,
      "quality:high|ratio:2:3": 0.2,
      "quality:high|ratio:3:2": 0.2,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "gpt-image-1",
    resourceType: "text-to-image",
    pricing: {
      "quality:low|ratio:1:1": 0.011,
      "quality:low|ratio:2:3": 0.016,
      "quality:low|ratio:3:2": 0.016,
      "quality:medium|ratio:1:1": 0.042,
      "quality:medium|ratio:2:3": 0.063,
      "quality:medium|ratio:3:2": 0.063,
      "quality:high|ratio:1:1": 0.167,
      "quality:high|ratio:2:3": 0.25,
      "quality:high|ratio:3:2": 0.25,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "gpt-image-1-mini",
    resourceType: "text-to-image",
    pricing: {
      "quality:low|ratio:1:1": 0.005,
      "quality:low|ratio:2:3": 0.006,
      "quality:low|ratio:3:2": 0.006,
      "quality:medium|ratio:1:1": 0.011,
      "quality:medium|ratio:2:3": 0.015,
      "quality:medium|ratio:3:2": 0.015,
      "quality:high|ratio:1:1": 0.036,
      "quality:high|ratio:2:3": 0.052,
      "quality:high|ratio:3:2": 0.052,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "dall-e-3",
    resourceType: "text-to-image",
    pricing: {
      "quality:standard|ratio:1:1": 0.04,
      "quality:standard|ratio:4:7": 0.08,
      "quality:standard|ratio:7:4": 0.08,
      "quality:hd|ratio:1:1": 0.08,
      "quality:hd|ratio:4:7": 0.12,
      "quality:hd|ratio:7:4": 0.12,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "dall-e-2",
    resourceType: "text-to-image",
    pricing: {
      "quality:standard|ratio:256:256": 0.016,
      "quality:standard|ratio:512:512": 0.018,
      "quality:standard|ratio:1:1": 0.02,
    },
  },
];

modelPricingMatrix[ModelProvider.GOOGLE] = [
  {
    media: mediaType.IMAGE,
    resourceType: "text-to-image",
    modelName: "imagen-3.0-fast-generate-001",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-3.0-generate-002",
    resourceType: "text-to-image",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-3.0-capability-001",
    resourceType: "text-to-image",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-3.0-generate-001",
    resourceType: "text-to-image",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-4.0-fast-generate-001",
    resourceType: "text-to-image",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-4.0-generate-001",
    resourceType: "text-to-image",
    pricing: {
      default: 0.04,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "imagen-4.0-ultra-generate-001",
    resourceType: "text-to-image",
    pricing: {
      default: 0.06,
    },
  },
];

modelPricingMatrix[ModelProvider.GROK] = [
  {
    media: mediaType.IMAGE,
    modelName: "grok-2-image-1212",
    resourceType: "text-to-image",
    pricing: {
      default: 0.07,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "grok-imagine-image",
    resourceType: "text-to-image",
    pricing: {
      default: 0.02,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "grok-imagine-image-pro",
    resourceType: "text-to-image",
    pricing: {
      default: 0.07,
    },
  },
];

modelPricingMatrix[ModelProvider.KLING] = [
  {
    media: mediaType.IMAGE,
    modelName: "Kling-image-o1",
    resourceType: "text-to-image",
    pricing: {
      default: 0.028,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "Kling-v1",
    resourceType: "text-to-image",
    pricing: {
      default: 0.0035,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "Kling-v1-5",
    resourceType: "text-to-image",
    pricing: {
      default: 0.028,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "Kling-v2",
    resourceType: "text-to-image",
    pricing: {
      default: 0.014,
    },
  },
  {
    media: mediaType.IMAGE,
    modelName: "Kling-v2-1",
    resourceType: "text-to-image",
    pricing: {
      default: 0.07,
    },
  },
];

/**
 * Builds a deterministic pricing key from a params object.
 * Keys are sorted alphabetically so that param insertion order doesn't matter.
 *
 * Example: { ratio: "1:1", quality: "high" } → "quality:high|ratio:1:1"
 * Example: {}                                 → "default"
 */
function buildPricingKey(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) return "default";
  return entries.map(([k, v]) => `${k}:${v}`).join("|");
}

/**
 * Returns the base price in USD for a given provider, model, and dynamic params.
 * Throws a descriptive error if the provider, model, or pricing key is not found.
 *
 * Falls back to "default" pricing key if a specific key is not configured.
 * Logs a warning when falling back so misconfigured pricing isn't silently ignored.
 */
export function getBasePrice(params: {
  provider: ModelProvider;
  modelName: ImageModel;
  dynamicParams?: Record<string, string | undefined>;
}): number {
  const providerModels = modelPricingMatrix[params.provider];
  if (!providerModels) {
    throw new Error(`Provider "${params.provider}" is not supported.`);
  }

  const model = providerModels.find((m) => m.modelName === params.modelName);
  if (!model) {
    throw new Error(
      `Model "${params.modelName}" not found under provider "${params.provider}".`,
    );
  }

  const key = buildPricingKey(params.dynamicParams ?? {});
  const price = model.pricing[key];

  if (price !== undefined) return price;

  // Fall back to "default" with a warning so misconfiguration doesn't go unnoticed.
  const defaultPrice = model.pricing["default"];
  if (defaultPrice !== undefined) {
    console.warn(
      `[CreditEngine] Pricing key "${key}" not found for model "${params.modelName}". ` +
        `Falling back to "default" price (${defaultPrice}).`,
    );
    return defaultPrice;
  }

  throw new Error(
    `No pricing configured for model "${params.modelName}" with key "${key}" ` +
      `and no "default" fallback exists.`,
  );
}

/**
 * Converts a base USD price into credits, applying the platform markup.
 *
 * Formula: ceil((basePriceUSD × MARK_UP) / CREDIT_VALUE)
 */
export function calculateCredits(basePriceUSD: number): number {
  const finalPrice = basePriceUSD * MARK_UP;
  return Math.ceil(finalPrice / CREDIT_VALUE);
}

// function test(): void {
//   // Standard parametrized model (OpenAI)
//   const openAiPrice = getBasePrice({
//     provider: ModelProvider.OPENAI,
//     modelName: "gpt-image-1",
//     dynamicParams: { quality: "high", ratio: "1:1" },
//   });
//   const openAiCredits = calculateCredits(openAiPrice);
//   console.log(
//     `gpt-image-1 high 1:1 → $${openAiPrice} → ${openAiCredits} credits`,
//   );

//   // Default-keyed model (Google)
//   const googlePrice = getBasePrice({
//     provider: ModelProvider.GOOGLE,
//     modelName: "imagen-4.0-generate-001",
//   });
//   const googleCredits = calculateCredits(googlePrice);
//   console.log(
//     `imagen-4.0-generate-001 → $${googlePrice} → ${googleCredits} credits`,
//   );

//   // Verify key ordering is param-order-independent
//   const priceA = getBasePrice({
//     provider: ModelProvider.OPENAI,
//     modelName: "dall-e-3",
//     dynamicParams: { ratio: "1:1", quality: "standard" }, // reversed order
//   });
//   const priceB = getBasePrice({
//     provider: ModelProvider.OPENAI,
//     modelName: "dall-e-3",
//     dynamicParams: { quality: "standard", ratio: "1:1" }, // normal order
//   });
//   console.assert(priceA === priceB, "Key ordering must be deterministic");
//   console.log(`dall-e-3 standard 1:1 key-order test passed: $${priceA}`);
// }

// test();
