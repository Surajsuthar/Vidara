import { fal } from "@ai-sdk/fal";
import { generateImage } from "ai";
import type { ImageGenOptions, ImageGenResult, JSONObject } from "../types";

const FAL_MODEL_MAP: Record<string, string> = {
  "fal/flux-dev": "fal-ai/flux/dev",
  "fal/flux-pro-ultra": "fal-ai/flux-pro/v1.1-ultra",
  "fal/flux-lora": "fal-ai/flux-lora",
  "fal/fast-sdxl": "fal-ai/fast-sdxl",
  "fal/hyper-sdxl": "fal-ai/hyper-sdxl",
  "fal/ideogram-v2": "fal-ai/ideogram/v2",
  "fal/recraft-v3": "fal-ai/recraft-v3",
  "fal/stable-diffusion-3.5-large": "fal-ai/stable-diffusion-3.5-large",
};

export async function generateFal(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();
  const falModelId = FAL_MODEL_MAP[opts.model];
  if (!falModelId) throw new Error(`Unknown fal model: ${opts.model}`);

  const providerOptions: JSONObject = {
    ...(opts.negativePrompt ? { negative_prompt: opts.negativePrompt } : {}),
    ...(opts.providerExtras ?? {}),
  };

  const { images, warnings } = await generateImage({
    model: fal.image(falModelId),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    aspectRatio: opts.aspectRatio ?? "1:1",
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: { fal: providerOptions },
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
