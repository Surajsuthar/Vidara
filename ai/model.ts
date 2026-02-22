export type processType = "generate" | "edit";

export type resourceType = "text-to-image" | "image-to-image";

export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  GROK = "grok",
  KLING = "kling",
}

export enum mediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export type googleImageGenModels =
  | "imagen-4.0-generate-001"
  | "imagen-4.0-fast-generate-001"
  | "imagen-4.0-ultra-generate-001"
  | "imagen-3.0-generate-002"
  | "imagen-3.0-generate-001"
  | "imagen-3.0-fast-generate-001"
  | "imagen-3.0-capability-001";

export type openaiImageGenModels =
  | "gpt-image-1.5"
  | "gpt-image-1"
  | "gpt-image-1-mini"
  | "dall-e-2"
  | "dall-e-3";

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

export type ImageModel =
  | googleImageGenModels
  | openaiImageGenModels
  | grokImageGenModels
  | klingImageGenModels;