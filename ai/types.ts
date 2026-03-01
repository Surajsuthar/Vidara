export type processType = "generate" | "edit";

export type resourceType = "text-to-image" | "image-to-image";

export type AspectRatio =
  | "1:1"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16"
  | "3:2"
  | "2:3"
  | "4:5"
  | "5:4"
  | "9:21"
  | "21:9";

export type QualityTier = "low" | "standard" | "hd" | "ultra";

export type ImageOutputFormat = "png" | "webp" | "jpeg";

export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  GROK = "grok",
  KLING = "kling",
  XAI = "xai",
  FAL = "fal",
  REPLICATE = "replicate",
  DEEPINFRE = "deepinfra",
  AMAZON = "amazon",
}

export enum mediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export type googleImageGenModels =
  | "google/imagen-3.0-generate-001"
  | "google/imagen-3.0-fast-generate-001"
  | "google/imagen-4.0-generate-001"
  | "google/imagen-4.0-fast-generate-001"
  | "google/imagen-4.0-ultra-generate-001"
  // Google Vertex (same Imagen models, different auth)
  | "vertex/imagen-3.0-generate-001"
  | "vertex/imagen-4.0-generate-001"
  | "vertex/imagen-4.0-ultra-generate-001";

export type openaiImageGenModels =
  | "openai/dall-e-2"
  | "openai/dall-e-3"
  | "openai/gpt-image-1"
  | "openai/gpt-image-1-mini"
  | "openai/gpt-image-1.5";

export type grokImageGenModels =
  | "grok-imagine-image-pro"
  | "grok-imagine-image"
  | "grok-2-image-1212";

export type klingImageGenModels =
  | "Kling-image-o1"
  | "Kling-v2-1"
  | "Kling-v2"
  | "Kling-v1-5"
  | "Kling-v1";

export type xAiImageGenModel = "xai/grok-2-image";

export type falImageGenModel =
  | "fal/flux-dev"
  | "fal/flux-pro-ultra"
  | "fal/flux-lora"
  | "fal/fast-sdxl"
  | "fal/hyper-sdxl"
  | "fal/ideogram-v2"
  | "fal/recraft-v3"
  | "fal/stable-diffusion-3.5-large";

export type replicateImageGenModel =
  | "replicate/flux-schnell"
  | "replicate/recraft-v3";

export type deepinfraImageGenModel =
  | "deepinfra/flux-1.1-pro"
  | "deepinfra/flux-1-schnell"
  | "deepinfra/flux-1-dev"
  | "deepinfra/flux-pro"
  | "deepinfra/sd3.5"
  | "deepinfra/sd3.5-medium"
  | "deepinfra/sdxl-turbo";

export type amazonImageGenModel = "bedrock/nova-canvas";

export type ImageModel =
  | googleImageGenModels
  | openaiImageGenModels
  | xAiImageGenModel
  | falImageGenModel
  | replicateImageGenModel
  | deepinfraImageGenModel
  | amazonImageGenModel;

type JSONArray = JSONValue[];
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
export type JSONObject = {
  [key: string]: JSONValue | undefined;
};

export interface ImageGenOptions {
  model: ImageModel;
  prompt: string;
  negativePrompt?: string;
  n?: number; // batch size, default 1
  aspectRatio?: AspectRatio;
  width?: number;
  height?: number;
  quality?: QualityTier;
  outputFormat?: ImageOutputFormat;
  seed?: number;
  providerExtras?: JSONObject; // passthrough for provider-specific opts
}

/**
 * What the generator returns
 */
export interface ImageGenResult {
  images: GeneratedImage[];
  model: ImageModel;
  warnings: string[];
  durationMs: number;
}

export interface GeneratedImage {
  base64: string;
  uint8Array: Uint8Array;
  mimeType: string;
  width?: number;
  height?: number;
}

/**
 * Per-model static metadata
 */
export interface ModelMeta {
  displayName: string;
  provider: string;
  supportsAspectRatio: boolean;
  supportsSize: boolean;
  supportedSizes?: string[];
  supportedAspectRatios?: AspectRatio[];
  supportsNegativePrompt: boolean;
  supportsQuality: boolean;
  supportsSeed: boolean;
  maxBatchSize: number;
  defaultAspectRatio: AspectRatio;
}
