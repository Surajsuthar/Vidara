import { xai } from "@ai-sdk/xai";
import { generateImage } from "ai";
import type { ImageGenOptions, ImageGenResult } from "../types";

export async function generateXai(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();

  const { images, warnings } = await generateImage({
    model: xai.image("grok-2-image"),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    size: "1024x768",
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
