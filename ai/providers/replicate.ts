import { replicate } from "@ai-sdk/replicate";
import { generateImage } from "ai";
import type { ImageGenOptions, ImageGenResult } from "../types";

const REPLICATE_MODEL_MAP: Record<string, string> = {
  "replicate/flux-schnell": "black-forest-labs/flux-schnell",
  "replicate/recraft-v3": "recraft-ai/recraft-v3",
};

export async function generateReplicate(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();
  const replicateModelId = REPLICATE_MODEL_MAP[opts.model];
  if (!replicateModelId)
    throw new Error(`Unknown replicate model: ${opts.model}`);

  const { images, warnings } = await generateImage({
    model: replicate.image(replicateModelId),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    aspectRatio: opts.aspectRatio ?? "1:1",
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: { replicate: opts.providerExtras ?? {} },
  });

  return {
    model: opts.model,
    durationMs: Date.now() - start,
    warnings: warnings?.map((w) => String(w)) ?? [],
    images: images.map((img) => ({
      base64: img.base64,
      uint8Array: img.uint8Array,
      mimeType: "image/png",
    })),
  };
}
