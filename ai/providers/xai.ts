import { xai } from "@ai-sdk/xai";
import { generateImage } from "ai";
import { getSize } from "@/lib/utils";
import type { ImageGenOptions, ImageGenResult } from "../types";

export async function generateXai(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();
  const modelId = opts.model.replace("xai/", "");

  const { images, warnings } = await generateImage({
    model: xai.image(modelId),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    aspectRatio: opts.aspectRatio,
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: { xai: opts.providerExtras ?? {} },
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
