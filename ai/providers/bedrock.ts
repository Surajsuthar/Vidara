import { bedrock } from "@ai-sdk/amazon-bedrock";
import { generateImage } from "ai";
import type { ImageGenOptions, ImageGenResult } from "../types";

export async function generateBedrock(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();

  const size =
    opts.width && opts.height
      ? (`${opts.width}x${opts.height}` as `${number}x${number}`)
      : "1024x1024";

  const { images, warnings } = await generateImage({
    model: bedrock.image("amazon.nova-canvas-v1:0"),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    size,
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: {
      bedrock: {
        ...(opts.negativePrompt ? { negativeText: opts.negativePrompt } : {}),
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
