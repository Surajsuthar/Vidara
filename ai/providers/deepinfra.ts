import { deepinfra } from "@ai-sdk/deepinfra";
import { generateImage } from "ai";
import type { ImageGenOptions, ImageGenResult } from "../types";

const DEEPINFRA_MODEL_MAP: Record<string, string> = {
  "deepinfra/flux-1.1-pro": "black-forest-labs/FLUX-1.1-pro",
  "deepinfra/flux-1-schnell": "black-forest-labs/FLUX-1-schnell",
  "deepinfra/flux-1-dev": "black-forest-labs/FLUX-1-dev",
  "deepinfra/flux-pro": "black-forest-labs/FLUX-pro",
  "deepinfra/sd3.5": "stabilityai/sd3.5",
  "deepinfra/sd3.5-medium": "stabilityai/sd3.5-medium",
  "deepinfra/sdxl-turbo": "stabilityai/sdxl-turbo",
};

export async function generateDeepInfra(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();
  const deepinfraModelId = DEEPINFRA_MODEL_MAP[opts.model];
  if (!deepinfraModelId)
    throw new Error(`Unknown deepinfra model: ${opts.model}`);

  const { images, warnings } = await generateImage({
    model: deepinfra.image(deepinfraModelId),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    aspectRatio: opts.aspectRatio ?? "1:1",
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: {
      deepinfra: {
        ...(opts.negativePrompt
          ? { negative_prompt: opts.negativePrompt }
          : {}),
        ...(opts.providerExtras ?? {}),
      },
    },
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
