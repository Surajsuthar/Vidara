import type { AspectRatio, ImageModel, ModelMeta } from "./types";

const IMAGEN_ASPECT_RATIOS = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
] satisfies AspectRatio[];

const GEMINI_IMAGE_ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
] satisfies AspectRatio[];

const FAL_ASPECT_RATIOS = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
  "9:21",
  "21:9",
] satisfies AspectRatio[];

const XAI_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
  "2:1",
  "1:2",
  "19.5:9",
  "9:19.5",
  "20:9",
  "9:20",
] satisfies AspectRatio[];

const DEEPINFRA_STABILITY_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "1:9",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "9:16",
  "9:21",
] satisfies AspectRatio[];

const REPLICATE_RECRAFT_SIZES = [
  "1024x1024",
  "1365x1024",
  "1024x1365",
  "1536x1024",
  "1024x1536",
  "1820x1024",
  "1024x1820",
  "1024x2048",
  "2048x1024",
  "1434x1024",
  "1024x1434",
  "1024x1280",
  "1280x1024",
  "1024x1707",
  "1707x1024",
];

function imagenMeta(
  displayName: string,
  provider: "google" | "vertex",
  maxBatchSize = 4,
): ModelMeta {
  const isVertexImagen3 =
    provider === "vertex" && displayName.includes("Imagen 3");

  return {
    displayName,
    provider,
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: IMAGEN_ASPECT_RATIOS,
    supportsNegativePrompt: provider === "vertex",
    supportsQuality: false,
    supportsSeed: false,
    editImage: isVertexImagen3,
    maxBatchSize,
    defaultAspectRatio: "1:1",
  };
}

function geminiImageMeta(
  displayName: string,
  provider: "google" | "vertex",
): ModelMeta {
  return {
    displayName,
    provider,
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: GEMINI_IMAGE_ASPECT_RATIOS,
    supportsNegativePrompt: false,
    supportsQuality: false,
    editImage: true,
    supportsSeed: false,
    maxBatchSize: 1,
    defaultAspectRatio: "1:1",
  };
}

function falMeta(
  displayName: string,
  {
    supportsNegativePrompt,
    maxBatchSize,
  }: { supportsNegativePrompt: boolean; maxBatchSize: number },
): ModelMeta {
  return {
    displayName,
    provider: "fal",
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: FAL_ASPECT_RATIOS,
    supportsNegativePrompt,
    supportsQuality: false,
    editImage: true,
    supportsSeed: true,
    maxBatchSize,
    defaultAspectRatio: "1:1",
  };
}

function deepinfraFluxMeta(
  displayName: string,
  maxBatchSize: number,
  supportsNegativePrompt = false,
): ModelMeta {
  return {
    displayName,
    provider: "deepinfra",
    supportsAspectRatio: false,
    supportsSize: false,
    supportsNegativePrompt,
    supportsQuality: false,
    supportsSeed: true,
    maxBatchSize,
    editImage: false,
    defaultAspectRatio: "1:1",
  };
}

function deepinfraStabilityMeta(displayName: string): ModelMeta {
  return {
    displayName,
    provider: "deepinfra",
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: DEEPINFRA_STABILITY_ASPECT_RATIOS,
    supportsNegativePrompt: true,
    supportsQuality: false,
    editImage: false,
    supportsSeed: true,
    maxBatchSize: 4,
    defaultAspectRatio: "1:1",
  };
}

export const MODEL_REGISTRY: Record<ImageModel, ModelMeta> = {
  "openai/dall-e-2": {
    displayName: "DALL-E 2",
    provider: "openai",
    supportsAspectRatio: false,
    supportsSize: true,
    editImage: false,
    supportedSizes: ["256x256", "512x512", "1024x1024"],
    supportsNegativePrompt: false,
    supportsQuality: true,
    quality: ["standard"],
    supportsSeed: false,
    maxBatchSize: 10,
    defualtSize: "512x512",
  },
  "openai/dall-e-3": {
    displayName: "DALL-E 3",
    provider: "openai",
    supportsAspectRatio: false,
    supportsSize: true,
    editImage: false,
    supportedSizes: ["1024x1024", "1792x1024", "1024x1792"],
    supportsNegativePrompt: false,
    supportsQuality: true,
    quality: ["hd", "standard"],
    supportsSeed: false,
    maxBatchSize: 1,
    defualtSize: "1792x1024",
  },
  "openai/gpt-image-1": {
    displayName: "GPT Image 1",
    provider: "openai",
    supportsAspectRatio: false,
    supportsSize: true,
    editImage: true,
    supportedSizes: ["1024x1024", "1536x1024", "1024x1536"],
    supportsNegativePrompt: false,
    supportsQuality: true,
    quality: ["low", "medium", "high"],
    supportsSeed: false,
    maxBatchSize: 1,
    defualtSize: "1024x1024",
  },
  "openai/gpt-image-1-mini": {
    displayName: "GPT Image 1 Mini",
    provider: "openai",
    supportsAspectRatio: false,
    supportsSize: true,
    editImage: true,
    supportedSizes: ["1024x1024", "1536x1024", "1024x1536"],
    supportsNegativePrompt: false,
    supportsQuality: true,
    quality: ["low", "medium", "high"],
    supportsSeed: false,
    maxBatchSize: 1,
    defualtSize: "1024x1024",
  },
  "openai/gpt-image-1.5": {
    displayName: "GPT Image 1.5",
    provider: "openai",
    supportsAspectRatio: false,
    supportsSize: true,
    editImage: true,
    supportedSizes: ["1024x1024", "1536x1024", "1024x1536"],
    supportsNegativePrompt: false,
    supportsQuality: true,
    quality: ["low", "medium", "high"],
    supportsSeed: false,
    maxBatchSize: 1,
    defualtSize: "1024x1024",
  },
  "xai/grok-imagine-image": {
    displayName: "Grok Imagine Image",
    provider: "xai",
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: XAI_ASPECT_RATIOS,
    editImage: true,
    supportsNegativePrompt: false,
    supportsQuality: false,
    supportsSeed: false,
    maxBatchSize: 1,
    defaultAspectRatio: "4:3",
  },
  "google/imagen-4.0-generate-001": imagenMeta("Imagen 4", "google"),
  "google/imagen-4.0-fast-generate-001": imagenMeta("Imagen 4 Fast", "google"),
  "google/imagen-4.0-ultra-generate-001": imagenMeta(
    "Imagen 4 Ultra",
    "google",
    1,
  ),
  "google/gemini-2.5-flash-image": geminiImageMeta(
    "Gemini 2.5 Flash Image",
    "google",
  ),
  "google/gemini-3-pro-image-preview": geminiImageMeta(
    "Gemini 3 Pro Image Preview",
    "google",
  ),
  "google/gemini-3.1-flash-image-preview": geminiImageMeta(
    "Gemini 3.1 Flash Image Preview",
    "google",
  ),
  "vertex/imagen-3.0-generate-001": imagenMeta("Imagen 3 (Vertex)", "vertex"),
  "vertex/imagen-3.0-generate-002": imagenMeta(
    "Imagen 3 v2 (Vertex)",
    "vertex",
  ),
  "vertex/imagen-3.0-fast-generate-001": imagenMeta(
    "Imagen 3 Fast (Vertex)",
    "vertex",
  ),
  "vertex/imagen-4.0-generate-001": imagenMeta("Imagen 4 (Vertex)", "vertex"),
  "vertex/imagen-4.0-fast-generate-001": imagenMeta(
    "Imagen 4 Fast (Vertex)",
    "vertex",
  ),
  "vertex/imagen-4.0-ultra-generate-001": imagenMeta(
    "Imagen 4 Ultra (Vertex)",
    "vertex",
    1,
  ),
  "vertex/gemini-2.5-flash-image": geminiImageMeta(
    "Gemini 2.5 Flash Image (Vertex)",
    "vertex",
  ),
  "vertex/gemini-3-pro-image-preview": geminiImageMeta(
    "Gemini 3 Pro Image Preview (Vertex)",
    "vertex",
  ),
  "vertex/gemini-3.1-flash-image-preview": geminiImageMeta(
    "Gemini 3.1 Flash Image Preview (Vertex)",
    "vertex",
  ),
  "fal/flux-dev": falMeta("FLUX Dev", {
    supportsNegativePrompt: true,
    maxBatchSize: 4,
  }),
  "fal/flux-pro-ultra": falMeta("FLUX Pro Ultra", {
    supportsNegativePrompt: false,
    maxBatchSize: 1,
  }),
  "fal/flux-lora": falMeta("FLUX LoRA", {
    supportsNegativePrompt: true,
    maxBatchSize: 4,
  }),
  "fal/fast-sdxl": falMeta("Fast SDXL", {
    supportsNegativePrompt: true,
    maxBatchSize: 4,
  }),
  "fal/hyper-sdxl": falMeta("Hyper SDXL", {
    supportsNegativePrompt: true,
    maxBatchSize: 4,
  }),
  "fal/ideogram-v2": falMeta("Ideogram v2", {
    supportsNegativePrompt: false,
    maxBatchSize: 1,
  }),
  "fal/recraft-v3": falMeta("Recraft v3 (Fal)", {
    supportsNegativePrompt: false,
    maxBatchSize: 1,
  }),
  "fal/stable-diffusion-3.5-large": falMeta("SD 3.5 Large", {
    supportsNegativePrompt: true,
    maxBatchSize: 4,
  }),
  "replicate/flux-schnell": {
    displayName: "FLUX Schnell",
    provider: "replicate",
    supportsAspectRatio: true,
    supportsSize: false,
    supportedAspectRatios: [
      "1:1",
      "2:3",
      "3:2",
      "4:5",
      "5:4",
      "16:9",
      "9:16",
      "9:21",
      "21:9",
    ],
    supportsNegativePrompt: false,
    supportsQuality: false,
    supportsSeed: true,
    maxBatchSize: 4,
    editImage: true,
    defaultAspectRatio: "1:1",
  },
  "replicate/recraft-v3": {
    displayName: "Recraft v3",
    provider: "replicate",
    supportsAspectRatio: false,
    supportsSize: true,
    supportedSizes: REPLICATE_RECRAFT_SIZES,
    supportsNegativePrompt: false,
    supportsQuality: false,
    supportsSeed: false,
    editImage: true,
    maxBatchSize: 1,
    defualtSize: "1024x1024",
  },
  "deepinfra/flux-1.1-pro": deepinfraFluxMeta("FLUX 1.1 Pro", 1),
  "deepinfra/flux-1-schnell": deepinfraFluxMeta("FLUX Schnell", 4),
  "deepinfra/flux-1-dev": deepinfraFluxMeta("FLUX Dev", 1, true),
  "deepinfra/flux-pro": deepinfraFluxMeta("FLUX Pro", 1),
  "deepinfra/sd3.5": deepinfraStabilityMeta("SD 3.5"),
  "deepinfra/sd3.5-medium": deepinfraStabilityMeta("SD 3.5 Medium"),
  "deepinfra/sdxl-turbo": deepinfraStabilityMeta("SDXL Turbo"),
  "bedrock/nova-canvas": {
    displayName: "Nova Canvas",
    provider: "bedrock",
    supportsAspectRatio: false,
    supportsSize: false,
    supportsNegativePrompt: true,
    supportsQuality: false,
    supportsSeed: true,
    editImage: false,
    maxBatchSize: 1,
    defaultAspectRatio: "1:1",
  },
};

export function getModelMeta(model: ImageModel): ModelMeta {
  const meta = MODEL_REGISTRY[model];
  if (!meta) throw new Error(`Model not found in registry: ${model}`);
  return meta;
}
