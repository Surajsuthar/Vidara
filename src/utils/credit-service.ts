import { and, eq, gte, sql } from "drizzle-orm";
import { MODEL_REGISTRY, VIDEO_MODEL_REGISTRY } from "@/ai/factory";
import type {
  AspectRatio,
  ImageGenOptions,
  ImageModel,
  QualityTier,
  VideoGenOptions,
  VideoModel,
} from "@/ai/types";
import { db } from "@/lib/db";
import {
  creditTransaction,
  generation,
  media,
  userCredit,
} from "../../drizzle/schema";

export const CREDIT_VALUE_USD = 0.01;
export const DEFAULT_PLATFORM_MARKUP = 3;
export const WELCOME_CREDITS = 20;

const DEFAULT_CREDIT_EXPIRY_DAYS = 365;

type PricingKey = string;
type CreditTransactionType =
  | "grant"
  | "purchase"
  | "debit"
  | "refund"
  | "adjustment";

type ImagePricingRule = {
  mediaType: "image";
  unit: "image";
  prices: Partial<Record<PricingKey, number>> & { default?: number };
};

type VideoPricingRule = {
  mediaType: "video";
  unit: "second" | "video";
  prices: Partial<Record<PricingKey, number>> & { default: number };
};

type PricingRule = ImagePricingRule | VideoPricingRule;

export type CreditEstimate = {
  mediaType: "image" | "video";
  model: ImageModel | VideoModel;
  baseCostUsd: number;
  billedCostUsd: number;
  credits: number;
  quantity: number;
  unit: PricingRule["unit"];
  pricingKey: string;
};

const IMAGE_PRICING: Record<ImageModel, ImagePricingRule> = {
  "openai/dall-e-2": {
    mediaType: "image",
    unit: "image",
    prices: {
      "quality:standard|ratio:256x256": 0.016,
      "quality:standard|ratio:512x512": 0.018,
      "quality:standard|ratio:1024x1024": 0.02,
      default: 0.02,
    },
  },
  "openai/dall-e-3": {
    mediaType: "image",
    unit: "image",
    prices: {
      "quality:standard|ratio:1:1": 0.04,
      "quality:standard|ratio:4:7": 0.08,
      "quality:standard|ratio:7:4": 0.08,
      "quality:hd|ratio:1:1": 0.08,
      "quality:hd|ratio:4:7": 0.12,
      "quality:hd|ratio:7:4": 0.12,
      default: 0.12,
    },
  },
  "openai/gpt-image-1": {
    mediaType: "image",
    unit: "image",
    prices: {
      "quality:low|ratio:1:1": 0.011,
      "quality:low|ratio:2:3": 0.016,
      "quality:low|ratio:3:2": 0.016,
      "quality:medium|ratio:1:1": 0.042,
      "quality:medium|ratio:2:3": 0.063,
      "quality:medium|ratio:3:2": 0.063,
      "quality:high|ratio:1:1": 0.167,
      "quality:high|ratio:2:3": 0.25,
      "quality:high|ratio:3:2": 0.25,
      default: 0.063,
    },
  },
  "openai/gpt-image-1-mini": {
    mediaType: "image",
    unit: "image",
    prices: {
      "quality:low|ratio:1:1": 0.005,
      "quality:low|ratio:2:3": 0.006,
      "quality:low|ratio:3:2": 0.006,
      "quality:medium|ratio:1:1": 0.011,
      "quality:medium|ratio:2:3": 0.015,
      "quality:medium|ratio:3:2": 0.015,
      "quality:high|ratio:1:1": 0.036,
      "quality:high|ratio:2:3": 0.052,
      "quality:high|ratio:3:2": 0.052,
      default: 0.015,
    },
  },
  "openai/gpt-image-1.5": {
    mediaType: "image",
    unit: "image",
    prices: {
      "quality:low|ratio:1:1": 0.009,
      "quality:low|ratio:2:3": 0.013,
      "quality:low|ratio:3:2": 0.013,
      "quality:medium|ratio:1:1": 0.034,
      "quality:medium|ratio:2:3": 0.05,
      "quality:medium|ratio:3:2": 0.05,
      "quality:high|ratio:1:1": 0.133,
      "quality:high|ratio:2:3": 0.2,
      "quality:high|ratio:3:2": 0.2,
      default: 0.05,
    },
  },
  "xai/grok-imagine-image": flatImagePrice(0.05),
  "google/imagen-4.0-fast-generate-001": flatImagePrice(0.02),
  "google/imagen-4.0-generate-001": flatImagePrice(0.04),
  "google/imagen-4.0-ultra-generate-001": flatImagePrice(0.06),
  "google/gemini-2.5-flash-image": flatImagePrice(0.04),
  "google/gemini-3-pro-image-preview": flatImagePrice(0.12),
  "google/gemini-3.1-flash-image-preview": flatImagePrice(0.06),
  "vertex/imagen-3.0-generate-001": flatImagePrice(0.04),
  "vertex/imagen-3.0-generate-002": flatImagePrice(0.04),
  "vertex/imagen-3.0-fast-generate-001": flatImagePrice(0.02),
  "vertex/imagen-4.0-generate-001": flatImagePrice(0.04),
  "vertex/imagen-4.0-fast-generate-001": flatImagePrice(0.02),
  "vertex/imagen-4.0-ultra-generate-001": flatImagePrice(0.06),
  "vertex/gemini-2.5-flash-image": flatImagePrice(0.04),
  "vertex/gemini-3-pro-image-preview": flatImagePrice(0.12),
  "vertex/gemini-3.1-flash-image-preview": flatImagePrice(0.06),
  "fal/flux-dev": flatImagePrice(0.025),
  "fal/flux-pro-ultra": flatImagePrice(0.06),
  "fal/flux-lora": flatImagePrice(0.035),
  "fal/fast-sdxl": flatImagePrice(0.003),
  "fal/hyper-sdxl": flatImagePrice(0.003),
  "fal/ideogram-v2": flatImagePrice(0.03),
  "fal/recraft-v3": flatImagePrice(0.03),
  "fal/stable-diffusion-3.5-large": flatImagePrice(0.04),
  "replicate/flux-schnell": flatImagePrice(0.003),
  "replicate/recraft-v3": flatImagePrice(0.04),
  "deepinfra/flux-1.1-pro": flatImagePrice(0.04),
  "deepinfra/flux-1-schnell": flatImagePrice(0.003),
  "deepinfra/flux-1-dev": flatImagePrice(0.025),
  "deepinfra/flux-pro": flatImagePrice(0.04),
  "deepinfra/sd3.5": flatImagePrice(0.035),
  "deepinfra/sd3.5-medium": flatImagePrice(0.02),
  "deepinfra/sdxl-turbo": flatImagePrice(0.003),
  "bedrock/nova-canvas": flatImagePrice(0.08),
};

const VIDEO_PRICING: Record<VideoModel, VideoPricingRule> = {
  "fal/luma-dream-machine/ray-2": perSecondVideoPrice(0.18),
  "fal/minimax-video": perSecondVideoPrice(0.08),
  "google/veo-2.0-generate-001": perSecondVideoPrice(0.35),
  "vertex/veo-2.0-generate-001": perSecondVideoPrice(0.35),
  "vertex/veo-3.0-generate-001": perSecondVideoPrice(0.5),
  "vertex/veo-3.0-fast-generate-001": perSecondVideoPrice(0.15),
  "vertex/veo-3.1-generate-001": perSecondVideoPrice(0.5),
  "vertex/veo-3.1-fast-generate-001": perSecondVideoPrice(0.15),
  "kling/kling-v2.6-t2v": perSecondVideoPrice(0.1),
  "kling/kling-v2.6-i2v": perSecondVideoPrice(0.1),
  "kling/kling-v2.6-motion-control": perSecondVideoPrice(0.12),
  "replicate/minimax/video-01": perVideoPrice(0.5),
  "xai/grok-imagine-video": perSecondVideoPrice(0.07),
  "bytedance/seedance-1-5-pro-251215": perSecondVideoPrice(0.18),
  "bytedance/seedance-1-0-pro-250528": perSecondVideoPrice(0.12),
  "bytedance/seedance-1-0-pro-fast-251015": perSecondVideoPrice(0.06),
  "bytedance/seedance-1-0-lite-t2v-250428": perSecondVideoPrice(0.04),
  "bytedance/seedance-1-0-lite-i2v-250428": perSecondVideoPrice(0.04),
};

function flatImagePrice(defaultPriceUsd: number): ImagePricingRule {
  return {
    mediaType: "image",
    unit: "image",
    prices: { default: defaultPriceUsd },
  };
}

function perSecondVideoPrice(defaultPriceUsd: number): VideoPricingRule {
  return {
    mediaType: "video",
    unit: "second",
    prices: { default: defaultPriceUsd },
  };
}

function perVideoPrice(defaultPriceUsd: number): VideoPricingRule {
  return {
    mediaType: "video",
    unit: "video",
    prices: { default: defaultPriceUsd },
  };
}

function expiryDate(days = DEFAULT_CREDIT_EXPIRY_DAYS) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function buildPricingKey(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) return "default";
  return entries.map(([key, value]) => `${key}:${value}`).join("|");
}

function normalizeRatio(input: {
  aspectRatio?: AspectRatio;
  size?: string;
  model: ImageModel;
}) {
  if (input.size) return input.size;
  if (input.aspectRatio) return input.aspectRatio;

  const meta = MODEL_REGISTRY[input.model];
  return meta.defaultAspectRatio ?? meta.defualtSize ?? "1:1";
}

function normalizeQuality(quality?: QualityTier) {
  return quality ?? "standard";
}

function resolvePrice(rule: PricingRule, pricingKey: string) {
  return rule.prices[pricingKey] ?? rule.prices.default;
}

function creditsFromUsd(baseCostUsd: number) {
  return Math.max(
    1,
    Math.ceil((baseCostUsd * DEFAULT_PLATFORM_MARKUP) / CREDIT_VALUE_USD),
  );
}

export function estimateImageGenerationCredits(
  options: ImageGenOptions,
): CreditEstimate {
  const rule = IMAGE_PRICING[options.model];
  if (!rule)
    throw new Error(`No credit pricing configured for ${options.model}.`);

  const pricingKey = buildPricingKey({
    quality: normalizeQuality(options.quality),
    ratio: normalizeRatio(options),
  });
  const unitPriceUsd = resolvePrice(rule, pricingKey);

  if (unitPriceUsd === undefined) {
    throw new Error(
      `No credit pricing configured for ${options.model} using ${pricingKey}.`,
    );
  }

  const quantity = Math.max(1, options.n ?? 1);
  const baseCostUsd = unitPriceUsd * quantity;

  return {
    mediaType: "image",
    model: options.model,
    baseCostUsd,
    billedCostUsd: baseCostUsd * DEFAULT_PLATFORM_MARKUP,
    credits: creditsFromUsd(baseCostUsd),
    quantity,
    unit: "image",
    pricingKey,
  };
}

export function estimateVideoGenerationCredits(
  options: VideoGenOptions,
): CreditEstimate {
  const rule = VIDEO_PRICING[options.model];
  if (!rule)
    throw new Error(`No credit pricing configured for ${options.model}.`);

  const meta = VIDEO_MODEL_REGISTRY[options.model];
  const pricingKey = buildPricingKey({
    resolution: options.resolution ?? meta.defaultResolution,
    ratio: options.aspectRatio ?? meta.defaultAspectRatio,
  });
  const unitPriceUsd = resolvePrice(rule, pricingKey);

  if (unitPriceUsd === undefined) {
    throw new Error(
      `No credit pricing configured for ${options.model} using ${pricingKey}.`,
    );
  }

  const videoCount = Math.max(1, options.n ?? 1);
  const duration =
    rule.unit === "second"
      ? Math.max(1, options.duration ?? meta.defaultDurationSeconds ?? 5)
      : 1;
  const quantity = videoCount * duration;
  const baseCostUsd = unitPriceUsd * quantity;

  return {
    mediaType: "video",
    model: options.model,
    baseCostUsd,
    billedCostUsd: baseCostUsd * DEFAULT_PLATFORM_MARKUP,
    credits: creditsFromUsd(baseCostUsd),
    quantity,
    unit: rule.unit,
    pricingKey,
  };
}

export function estimateGenerationCredits(input: {
  mediaType: "image";
  options: ImageGenOptions;
}): CreditEstimate;
export function estimateGenerationCredits(input: {
  mediaType: "video";
  options: VideoGenOptions;
}): CreditEstimate;
export function estimateGenerationCredits(input: {
  mediaType: "image" | "video";
  options: ImageGenOptions | VideoGenOptions;
}): CreditEstimate {
  return input.mediaType === "image"
    ? estimateImageGenerationCredits(input.options as ImageGenOptions)
    : estimateVideoGenerationCredits(input.options as VideoGenOptions);
}

export async function getOrCreateUserCredit(userId: string) {
  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(userCredit)
      .values({
        id: crypto.randomUUID(),
        userId,
        credit: WELCOME_CREDITS,
        expire: expiryDate(),
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      await tx.insert(creditTransaction).values({
        id: crypto.randomUUID(),
        userId,
        type: "grant",
        credits: WELCOME_CREDITS,
        balanceAfter: created.credit,
        description: "Welcome credits",
      });

      return created;
    }

    const [record] = await tx
      .select()
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .limit(1);

    if (!record) throw new Error("Unable to create user credit record.");
    return record;
  });
}

export async function grantCredits(input: {
  userId: string;
  credits: number;
  type?: Extract<CreditTransactionType, "grant" | "purchase" | "adjustment">;
  description?: string;
}) {
  const credits = Math.floor(input.credits);
  if (credits <= 0) throw new Error("Credits must be greater than zero.");

  return db.transaction(async (tx) => {
    await tx
      .insert(userCredit)
      .values({
        id: crypto.randomUUID(),
        userId: input.userId,
        credit: 0,
        expire: expiryDate(),
      })
      .onConflictDoNothing();

    const [updated] = await tx
      .update(userCredit)
      .set({
        credit: sql`${userCredit.credit} + ${credits}`,
        expire: expiryDate(),
      })
      .where(eq(userCredit.userId, input.userId))
      .returning();

    if (!updated) throw new Error("Unable to add credits.");

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId: input.userId,
      type: input.type ?? "grant",
      credits,
      balanceAfter: updated.credit,
      description: input.description ?? "Credits added",
    });

    return updated;
  });
}

export async function reserveCreditsForImageGeneration(input: {
  requestId: string;
  userId: string;
  options: ImageGenOptions;
}) {
  const estimate = estimateImageGenerationCredits(input.options);
  const credits = estimate.credits;

  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(userCredit)
      .values({
        id: crypto.randomUUID(),
        userId: input.userId,
        credit: WELCOME_CREDITS,
        expire: expiryDate(),
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      await tx.insert(creditTransaction).values({
        id: crypto.randomUUID(),
        userId: input.userId,
        type: "grant",
        credits: WELCOME_CREDITS,
        balanceAfter: created.credit,
        description: "Welcome credits",
      });
    }

    const [updated] = await tx
      .update(userCredit)
      .set({ credit: sql`${userCredit.credit} - ${credits}` })
      .where(
        and(
          eq(userCredit.userId, input.userId),
          gte(userCredit.credit, credits),
        ),
      )
      .returning();

    if (!updated) {
      throw new InsufficientCreditsError(credits);
    }

    await tx.insert(generation).values({
      id: input.requestId,
      userId: input.userId,
      prompt: input.options.prompt,
      negativePrompt: input.options.negativePrompt,
      width: parseSize(input.options.size).width,
      height: parseSize(input.options.size).height,
      qualityTier: toGenerationQualityTier(input.options.quality),
      batchSize: input.options.n ?? 1,
      status: "pending",
      creditsCharged: credits,
    });

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId: input.userId,
      generationId: input.requestId,
      type: "debit",
      credits: -credits,
      balanceAfter: updated.credit,
      description: `${estimate.model} ${estimate.mediaType} generation`,
    });

    return {
      estimate,
      balance: updated.credit,
    };
  });
}

export async function refundGenerationCredits(input: {
  requestId: string;
  reason?: string;
}) {
  return db.transaction(async (tx) => {
    const [record] = await tx
      .select()
      .from(generation)
      .where(eq(generation.id, input.requestId))
      .limit(1);

    if (!record || record.creditsCharged <= 0 || record.status === "refunded") {
      return null;
    }

    const [updated] = await tx
      .update(userCredit)
      .set({ credit: sql`${userCredit.credit} + ${record.creditsCharged}` })
      .where(eq(userCredit.userId, record.userId))
      .returning();

    if (!updated) throw new Error("Unable to refund credits.");

    await tx
      .update(generation)
      .set({ status: "refunded", errorMessage: input.reason })
      .where(eq(generation.id, input.requestId));

    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      userId: record.userId,
      generationId: input.requestId,
      type: "refund",
      credits: record.creditsCharged,
      balanceAfter: updated.credit,
      description: input.reason ?? "Generation failed",
    });

    return updated;
  });
}

export async function applyCreditUsageToGeneratedMedia(input: {
  requestId: string;
  mediaIds: string[];
}) {
  if (input.mediaIds.length === 0) return;

  const [record] = await db
    .select({
      creditsCharged: generation.creditsCharged,
    })
    .from(generation)
    .where(eq(generation.id, input.requestId))
    .limit(1);

  if (!record) return;

  const baseCredits = Math.floor(record.creditsCharged / input.mediaIds.length);
  const remainder = record.creditsCharged % input.mediaIds.length;

  await db.transaction(async (tx) => {
    for (const [index, mediaId] of input.mediaIds.entries()) {
      await tx
        .update(media)
        .set({ creditUsage: baseCredits + (index < remainder ? 1 : 0) })
        .where(eq(media.id, mediaId));
    }
  });
}

function parseSize(size?: string) {
  if (!size) return {};

  const [width, height] = size.split("x").map(Number);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return {};

  return { width, height };
}

const GENERATION_QUALITY_TIERS = [
  "fast",
  "low",
  "standard",
  "hd",
  "ultra",
] as const;

type GenerationQualityTier = (typeof GENERATION_QUALITY_TIERS)[number];

function toGenerationQualityTier(quality?: QualityTier): GenerationQualityTier {
  if (!quality) return "standard";
  return GENERATION_QUALITY_TIERS.includes(quality as GenerationQualityTier)
    ? (quality as GenerationQualityTier)
    : "standard";
}

export class InsufficientCreditsError extends Error {
  readonly requiredCredits: number;

  constructor(requiredCredits: number) {
    super(`Insufficient credits. This generation requires ${requiredCredits}.`);
    this.name = "InsufficientCreditsError";
    this.requiredCredits = requiredCredits;
  }
}
