import { google } from "@ai-sdk/google";
import { vertex } from "@ai-sdk/google-vertex";
import { generateImage } from "ai";
import { getModelMeta } from "../factory";
import type { ImageGenOptions, ImageGenResult, JSONObject } from "../types";

export async function generateGoogle(
  opts: ImageGenOptions,
  useVertex = false,
): Promise<ImageGenResult> {
  const start = Date.now();

  const modelId = opts.model.replace("google/", "").replace("vertex/", "");
  const imageModel = useVertex ? vertex.image(modelId) : google.image(modelId);
  const meta = getModelMeta(opts.model);
  const supportsMultipleImages = !modelId.startsWith("gemini-");

  const providerOptions: JSONObject = {};
  if (opts.negativePrompt && meta.supportsNegativePrompt) {
    providerOptions.negativePrompt = opts.negativePrompt;
  }
  if (opts.providerExtras) {
    Object.assign(providerOptions, opts.providerExtras);
  }

  const { images, warnings } = await generateImage({
    model: imageModel,
    prompt: opts.prompt,
    aspectRatio: opts.aspectRatio ?? "1:1",
    ...(supportsMultipleImages ? { n: opts.n ?? 1 } : {}),
    ...(opts.seed !== undefined && meta.supportsSeed
      ? { seed: opts.seed }
      : {}),
    providerOptions: useVertex
      ? { vertex: providerOptions }
      : { google: providerOptions },
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
