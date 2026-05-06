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
  | "1:9"
  | "21:9"
  | "2:1"
  | "1:2"
  | "19.5:9"
  | "9:19.5"
  | "20:9"
  | "9:20";

export type QualityTier =
  | "low"
  | "standard"
  | "hd"
  | "ultra"
  | "premium"
  | "medium"
  | "high";

export type ImageOutputFormat = "png" | "webp" | "jpeg";

export type VideoResolution = "480p" | "720p" | "1280x720" | "1920x1080";

export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  XAI = "xai",
  FAL = "fal",
  BYTEDANCE = "bytedance",
  KLING = "kling",
  REPLICATE = "replicate",
  DEEPINFRA = "deepinfra",
  AMAZON = "amazon",
}

export enum mediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export type googleImageGenModels =
  | "google/imagen-4.0-generate-001"
  | "google/imagen-4.0-fast-generate-001"
  | "google/imagen-4.0-ultra-generate-001"
  | "google/gemini-2.5-flash-image"
  | "google/gemini-3-pro-image-preview"
  | "google/gemini-3.1-flash-image-preview";

export type vertexImageGenModels =
  | "vertex/imagen-3.0-generate-001"
  | "vertex/imagen-3.0-generate-002"
  | "vertex/imagen-3.0-fast-generate-001"
  | "vertex/imagen-4.0-generate-001"
  | "vertex/imagen-4.0-fast-generate-001"
  | "vertex/imagen-4.0-ultra-generate-001"
  | "vertex/gemini-2.5-flash-image"
  | "vertex/gemini-3-pro-image-preview"
  | "vertex/gemini-3.1-flash-image-preview";

export type openaiImageGenModels =
  | "openai/dall-e-2"
  | "openai/dall-e-3"
  | "openai/gpt-image-1"
  | "openai/gpt-image-1-mini"
  | "openai/gpt-image-1.5";

export type xAiImageGenModel = "xai/grok-imagine-image";

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

export type falVideoGenModel =
  | "fal/luma-dream-machine/ray-2"
  | "fal/minimax-video";

export type googleVideoGenModel = "google/veo-2.0-generate-001";

export type vertexVideoGenModel =
  | "vertex/veo-3.1-generate-001"
  | "vertex/veo-3.1-fast-generate-001"
  | "vertex/veo-3.0-generate-001"
  | "vertex/veo-3.0-fast-generate-001"
  | "vertex/veo-2.0-generate-001";

export type klingVideoGenModel =
  | "kling/kling-v2.6-t2v"
  | "kling/kling-v2.6-i2v"
  | "kling/kling-v2.6-motion-control";

export type replicateVideoGenModel = "replicate/minimax/video-01";

export type xAiVideoGenModel = "xai/grok-imagine-video";

export type byteDanceVideoGenModel =
  | "bytedance/seedance-1-5-pro-251215"
  | "bytedance/seedance-1-0-pro-250528"
  | "bytedance/seedance-1-0-pro-fast-251015"
  | "bytedance/seedance-1-0-lite-t2v-250428"
  | "bytedance/seedance-1-0-lite-i2v-250428";

export type ImageModel =
  | googleImageGenModels
  | vertexImageGenModels
  | openaiImageGenModels
  | xAiImageGenModel
  | falImageGenModel
  | replicateImageGenModel
  | deepinfraImageGenModel
  | amazonImageGenModel;

export type VideoModel =
  | falVideoGenModel
  | googleVideoGenModel
  | vertexVideoGenModel
  | klingVideoGenModel
  | replicateVideoGenModel
  | xAiVideoGenModel
  | byteDanceVideoGenModel;

type JSONArray = JSONValue[];
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
export type JSONObject = {
  [key: string]: JSONValue | undefined;
};

export interface ImageGenOptions {
  model: ImageModel;
  prompt: string;
  images?: string[];
  negativePrompt?: string;
  n?: number; // batch size, default 1
  aspectRatio?: AspectRatio;
  size?: string;
  quality?: QualityTier;
  outputFormat?: ImageOutputFormat;
  seed?: number;
  providerExtras?: JSONObject; // passthrough for provider-specific opts
}

export interface VideoGenOptions {
  model: VideoModel;
  prompt: string;
  image?: string;
  videoUrl?: string;
  negativePrompt?: string;
  n?: number;
  aspectRatio?: AspectRatio;
  resolution?: VideoResolution;
  duration?: number;
  fps?: number;
  seed?: number;
  providerExtras?: JSONObject;
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
  base64?: string;
  uint8Array?: Uint8Array;
  url?: string;
  mediaId?: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface VideoGenResult {
  videos: GeneratedVideo[];
  model: VideoModel;
  warnings: string[];
  durationMs: number;
}

export interface GeneratedVideo {
  base64?: string;
  uint8Array?: Uint8Array;
  url?: string;
  mediaId?: string;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
}

/**
 * Per-model static metadata
 */
export interface ModelMeta {
  displayName: string;
  provider: string;
  editImage: boolean;
  supportsAspectRatio: boolean;
  supportsSize: boolean;
  supportedSizes?: string[];
  supportedAspectRatios?: AspectRatio[];
  supportsNegativePrompt: boolean;
  supportsQuality: boolean;
  quality?: QualityTier[];
  supportsSeed: boolean;
  maxBatchSize: number;
  defaultAspectRatio?: AspectRatio;
  defualtSize?: string;
}

export interface VideoModelMeta {
  displayName: string;
  provider: string;
  supportsTextToVideo: boolean;
  supportsImageToVideo: boolean;
  supportsVideoEditing: boolean;
  supportsMotionControl: boolean;
  supportsAspectRatio: boolean;
  supportedAspectRatios?: AspectRatio[];
  defaultAspectRatio?: AspectRatio;
  supportsResolution: boolean;
  supportedResolutions?: VideoResolution[];
  defaultResolution?: VideoResolution;
  supportsDuration: boolean;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  defaultDurationSeconds?: number;
  supportsFps: boolean;
  supportsSeed: boolean;
  supportsNegativePrompt: boolean;
  supportsAudioGeneration: boolean;
  supportsFirstLastFrame?: boolean;
  supportsReferenceImages?: boolean;
  supportsDraftMode?: boolean;
  maxVideosPerCall: number;
}
