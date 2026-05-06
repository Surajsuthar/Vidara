import { sanitizePrompt } from "@/lib/prompt-sanitizer";
import { getModelMeta, getVideoModelMeta } from "./factory";
import { generateBedrock } from "./providers/bedrock";
import { generateDeepInfra } from "./providers/deepinfra";
import { generateFal } from "./providers/fal";
import { generateGoogle } from "./providers/google";
import { generateOpenAI } from "./providers/openai";
import { generateReplicate } from "./providers/replicate";
import { generateXai } from "./providers/xai";
import type {
  ImageGenOptions,
  ImageGenResult,
  VideoGenOptions,
  VideoGenResult,
} from "./types";

export type AiGenerationInput =
  | {
      mediaType: "image";
      options: ImageGenOptions;
    }
  | {
      mediaType: "video";
      options: VideoGenOptions;
    };

export type AiGenerationResult<
  T extends AiGenerationInput = AiGenerationInput,
> = T extends { mediaType: "image" }
  ? ImageGenResult
  : T extends { mediaType: "video" }
    ? VideoGenResult
    : ImageGenResult | VideoGenResult;

export async function generateImage(
  options: ImageGenOptions,
): Promise<ImageGenResult> {
  const promptSafety = sanitizePrompt(options.prompt);
  if (!promptSafety.ok) {
    throw new Error(promptSafety.reason);
  }

  const opts: ImageGenOptions = {
    ...options,
    prompt: promptSafety.prompt,
  };
  const meta = getModelMeta(opts.model);

  validateImageOptions(opts, meta);

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

export async function generateVideo(
  options: VideoGenOptions,
): Promise<VideoGenResult> {
  const promptSafety = sanitizePrompt(options.prompt);
  if (!promptSafety.ok) {
    throw new Error(promptSafety.reason);
  }

  getVideoModelMeta(options.model);
  throw new Error(
    "Video generation provider adapters are not implemented yet.",
  );
}

export async function generate<T extends AiGenerationInput>(
  input: T,
): Promise<AiGenerationResult<T>> {
  switch (input.mediaType) {
    case "image":
      return generateImage(input.options) as Promise<AiGenerationResult<T>>;
    case "video":
      return generateVideo(input.options) as Promise<AiGenerationResult<T>>;
    default: {
      const exhaustiveCheck: never = input;
      throw new Error(
        `Unsupported generation media type: ${JSON.stringify(exhaustiveCheck)}`,
      );
    }
  }
}

function validateImageOptions(
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

  if (opts.size && !meta.supportsSize) {
    throw new Error(
      `Model ${opts.model} does not support size. Use aspectRatio instead.`,
    );
  }

  if (
    opts.size &&
    meta.supportedSizes &&
    !meta.supportedSizes.includes(opts.size)
  ) {
    throw new Error(
      `Model ${opts.model} does not support size ${opts.size}. ` +
        `Supported: ${meta.supportedSizes.join(", ")}`,
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
      `Model ${opts.model} does not support negativePrompt - ignoring.`,
    );
  }

  if (opts.quality && !meta.supportsQuality) {
    console.warn(`Model ${opts.model} does not support quality - ignoring.`);
  }

  if (opts.quality && meta.quality && !meta.quality.includes(opts.quality)) {
    throw new Error(
      `Model ${opts.model} does not support quality ${opts.quality}. ` +
        `Supported: ${meta.quality.join(", ")}`,
    );
  }

  if (opts.seed !== undefined && !meta.supportsSeed) {
    console.warn(`Model ${opts.model} does not support seed - ignoring.`);
  }
}

export type {
  ImageGenOptions,
  ImageGenResult,
  VideoGenOptions,
  VideoGenResult,
} from "./types";
