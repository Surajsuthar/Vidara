import { getModelMeta } from "./factory";
import { generateBedrock } from "./providers/bedrock";
import { generateDeepInfra } from "./providers/deepinfra";
import { generateFal } from "./providers/fal";
import { generateGoogle } from "./providers/google";
import { generateOpenAI } from "./providers/openai";
import { generateReplicate } from "./providers/replicate";
import { generateXai } from "./providers/xai";
import type { ImageGenOptions, ImageGenResult } from "./types";

export async function generate(opts: ImageGenOptions): Promise<ImageGenResult> {
  const meta = getModelMeta(opts.model);

  validateOptions(opts, meta);
  switch (meta.provider) {
    case "openai":
      return generateOpenAI(opts);
    case "xai":
      return generateXai(opts);
    case "google":
      return generateGoogle(opts, false);
    case "vertex":
      return generateGoogle(opts, true);
    case "fal":
      return generateFal(opts);
    case "replicate":
      return generateReplicate(opts);
    case "deepinfra":
      return generateDeepInfra(opts);
    case "bedrock":
      return generateBedrock(opts);
    default:
      throw new Error(`No adapter found for provider: ${meta.provider}`);
  }
}

function validateOptions(
  opts: ImageGenOptions,
  meta: ReturnType<typeof getModelMeta>,
) {
  if (opts.n && opts.n > meta.maxBatchSize) {
    throw new Error(
      `Model ${opts.model} supports max ${meta.maxBatchSize} images per call. Got ${opts.n}.`,
    );
  }

  if (opts.aspectRatio && !meta.supportsAspectRatio) {
    throw new Error(
      `Model ${opts.model} does not support aspectRatio. Use size instead.`,
    );
  }

  if ((opts.width || opts.height) && !meta.supportsSize) {
    throw new Error(
      `Model ${opts.model} does not support size. Use aspectRatio instead.`,
    );
  }

  if (
    opts.aspectRatio &&
    meta.supportedAspectRatios &&
    !meta.supportedAspectRatios.includes(opts.aspectRatio)
  ) {
    throw new Error(
      `Model ${opts.model} does not support aspectRatio ${opts.aspectRatio}. ` +
        `Supported: ${meta.supportedAspectRatios.join(", ")}`,
    );
  }

  if (opts.negativePrompt && !meta.supportsNegativePrompt) {
    console.warn(
      `Model ${opts.model} does not support negativePrompt — ignoring.`,
    );
  }
}
