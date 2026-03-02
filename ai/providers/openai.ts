import { openai } from "@ai-sdk/openai";
import { generateImage } from "ai";
import { getSize } from "@/lib/utils";
import type { ImageGenOptions, ImageGenResult, JSONObject } from "../types";

const qualityMap: Record<string, string> = {
  low: "low",
  standard: "standard",
  high: "high",
  medium: "medium",
};

export type style = "vivid" | "natural";

export async function generateOpenAI(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();

  const modelId = opts.model.replace("openai/", "");

  // dall-e-3 & dall-e-2 use size strings, gpt-image-* use quality
  const isLegacy = modelId === "dall-e-2" || modelId === "dall-e-3";

  const size = opts.size ? getSize(opts.size) : undefined;
  
  const providerOptions: JSONObject = {};

  if (!isLegacy && opts.quality) {
    providerOptions.quality = qualityMap[opts.quality] ?? "medium";
  }
  if (modelId === "dall-e-3" && opts.quality === "hd") {
    providerOptions.quality = "hd";
  }
  if (opts.outputFormat) {
    providerOptions.output_format = opts.outputFormat;
  }
  if (opts.providerExtras) {
    Object.assign(providerOptions, opts.providerExtras);
  }

  const { images, warnings } = await generateImage({
    model: openai.image(modelId),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    ...(size ? { size } : {}),
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: { openai: providerOptions },
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
