import { eq } from "drizzle-orm";
import type {
  AspectRatio,
  ImageGenOptions,
  ImageGenResult,
  QualityTier,
} from "@/ai/types";
import { generation, media } from "../../../drizzle/schema";
import { db } from "../../lib/db";
import { uploadBase64Image } from "../../lib/r2";
import { applyCreditUsageToGeneratedMedia } from "../../utils/credit-service";

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

function parseSize(size?: string) {
  if (!size) return {};

  const [width, height] = size.split("x").map(Number);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return {};

  return { width, height };
}

function inferAspectRatio(options: ImageGenOptions): AspectRatio | undefined {
  if (options.aspectRatio) return options.aspectRatio;

  const { width, height } = parseSize(options.size);
  if (!width || !height) return undefined;

  return `${width}:${height}` as AspectRatio;
}

export async function createPendingGenerationRecord(input: {
  requestId: string;
  userId: string;
  options: ImageGenOptions;
}) {
  const { width, height } = parseSize(input.options.size);

  await db.insert(generation).values({
    id: input.requestId,
    userId: input.userId,
    prompt: input.options.prompt,
    negativePrompt: input.options.negativePrompt,
    width,
    height,
    qualityTier: toGenerationQualityTier(input.options.quality),
    batchSize: input.options.n ?? 1,
    status: "pending",
    creditsCharged: 0,
  });
}

export async function markGenerationProcessing(requestId: string) {
  await db
    .update(generation)
    .set({
      status: "processing",
      startedAt: new Date(),
    })
    .where(eq(generation.id, requestId));
}

export async function markGenerationFailed(input: {
  requestId: string;
  errorMessage: string;
}) {
  await db
    .update(generation)
    .set({
      status: "failed",
      errorMessage: input.errorMessage,
    })
    .where(eq(generation.id, input.requestId));
}

export async function persistGenerationResult(input: {
  requestId: string;
  userId: string;
  options: ImageGenOptions;
  result: ImageGenResult;
}) {
  const aspectRatio = inferAspectRatio(input.options);

  const uploadedImages = await Promise.all(
    input.result.images.map(async (image, index) => {
      if (!image.base64) {
        throw new Error("Generated image did not include base64 data.");
      }

      const mediaId = crypto.randomUUID();
      const upload = await uploadBase64Image(image.base64, {
        folder: "generations",
        generationId: input.requestId,
        userId: input.userId,
        mimeType: image.mimeType,
        isPublic: true,
        metadata: {
          model: input.result.model,
          index: String(index),
          requestId: input.requestId,
        },
      });

      return {
        id: mediaId,
        userId: input.userId,
        mediaType: "image",
        url: upload.url,
        mimeType: upload.mimeType,
        aspectRatio,
        seed: String(input.options.seed ?? ""),
        width: image.width,
        height: image.height,
        creditUsage: 0,
        fileSizeBytes: upload.sizeBytes,
        visibility: "private",
      } satisfies typeof media.$inferInsert;
    }),
  );

  await db.transaction(async (tx) => {
    if (uploadedImages.length > 0) {
      await tx.insert(media).values(uploadedImages);
    }

    await tx
      .update(generation)
      .set({
        status: "completed",
        mediaId: uploadedImages[0]?.id,
        completedAt: new Date(),
      })
      .where(eq(generation.id, input.requestId));
  });

  await applyCreditUsageToGeneratedMedia({
    requestId: input.requestId,
    mediaIds: uploadedImages.map((image) => image.id),
  });

  return uploadedImages.map((image) => {
    return {
      mediaId: image.id,
      url: image.url,
      mimeType: image.mimeType ?? "image/webp",
      width: image.width,
      height: image.height,
    };
  });
}
