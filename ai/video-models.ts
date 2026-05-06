import type {
  AspectRatio,
  VideoModel,
  VideoModelMeta,
  VideoResolution,
} from "./types";

const XAI_VIDEO_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
] satisfies AspectRatio[];

const XAI_VIDEO_RESOLUTIONS = ["480p", "720p"] satisfies VideoResolution[];

const COMMON_VIDEO_ASPECT_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
] satisfies AspectRatio[];

const COMMON_HD_VIDEO_RESOLUTIONS = [
  "1280x720",
  "1920x1080",
] satisfies VideoResolution[];

const SEEDANCE_ASPECT_RATIOS = [
  "16:9",
  "4:3",
  "1:1",
  "3:4",
  "9:16",
  "21:9",
] satisfies AspectRatio[];

const SEEDANCE_RESOLUTIONS = [
  "480p",
  "720p",
  "1280x720",
  "1920x1080",
] satisfies VideoResolution[];

const SEEDANCE_LITE_I2V_RESOLUTIONS = [
  "480p",
  "720p",
] satisfies VideoResolution[];

function falVideoMeta(
  displayName: string,
  {
    supportsImageToVideo,
  }: {
    supportsImageToVideo: boolean;
  },
): VideoModelMeta {
  return {
    displayName,
    provider: "fal",
    supportsTextToVideo: true,
    supportsImageToVideo,
    supportsVideoEditing: false,
    supportsMotionControl: false,
    supportsAspectRatio: true,
    supportedAspectRatios: COMMON_VIDEO_ASPECT_RATIOS,
    defaultAspectRatio: "16:9",
    supportsResolution: false,
    supportsDuration: true,
    defaultDurationSeconds: 5,
    supportsFps: true,
    supportsSeed: true,
    supportsNegativePrompt: false,
    supportsAudioGeneration: false,
    maxVideosPerCall: 1,
  };
}

function veoVideoMeta(
  displayName: string,
  provider: "google" | "vertex",
  {
    supportsAudioGeneration,
    maxVideosPerCall,
  }: {
    supportsAudioGeneration: boolean;
    maxVideosPerCall: number;
  },
): VideoModelMeta {
  return {
    displayName,
    provider,
    supportsTextToVideo: true,
    supportsImageToVideo: false,
    supportsVideoEditing: false,
    supportsMotionControl: false,
    supportsAspectRatio: true,
    supportedAspectRatios: ["16:9", "9:16"],
    defaultAspectRatio: "16:9",
    supportsResolution: true,
    supportedResolutions: COMMON_HD_VIDEO_RESOLUTIONS,
    defaultResolution: "1280x720",
    supportsDuration: true,
    defaultDurationSeconds: 8,
    supportsFps: false,
    supportsSeed: true,
    supportsNegativePrompt: provider === "vertex",
    supportsAudioGeneration,
    maxVideosPerCall,
  };
}

function klingVideoMeta(
  displayName: string,
  {
    supportsTextToVideo,
    supportsImageToVideo,
    supportsMotionControl,
  }: {
    supportsTextToVideo: boolean;
    supportsImageToVideo: boolean;
    supportsMotionControl: boolean;
  },
): VideoModelMeta {
  return {
    displayName,
    provider: "kling",
    supportsTextToVideo,
    supportsImageToVideo,
    supportsVideoEditing: false,
    supportsMotionControl,
    supportsAspectRatio: true,
    supportedAspectRatios: COMMON_VIDEO_ASPECT_RATIOS,
    defaultAspectRatio: "16:9",
    supportsResolution: false,
    supportsDuration: true,
    defaultDurationSeconds: 5,
    supportsFps: false,
    supportsSeed: false,
    supportsNegativePrompt: false,
    supportsAudioGeneration: false,
    maxVideosPerCall: 1,
  };
}

function seedanceVideoMeta(
  displayName: string,
  {
    supportsTextToVideo,
    supportsImageToVideo,
    supportsAudioGeneration,
    supportsFirstLastFrame,
    supportsReferenceImages,
    supportsDraftMode,
    minDurationSeconds,
    maxDurationSeconds,
    supportedResolutions = SEEDANCE_RESOLUTIONS,
  }: {
    supportsTextToVideo: boolean;
    supportsImageToVideo: boolean;
    supportsAudioGeneration: boolean;
    supportsFirstLastFrame: boolean;
    supportsReferenceImages: boolean;
    supportsDraftMode: boolean;
    minDurationSeconds: number;
    maxDurationSeconds: number;
    supportedResolutions?: VideoResolution[];
  },
): VideoModelMeta {
  return {
    displayName,
    provider: "bytedance",
    supportsTextToVideo,
    supportsImageToVideo,
    supportsVideoEditing: false,
    supportsMotionControl: false,
    supportsAspectRatio: true,
    supportedAspectRatios: SEEDANCE_ASPECT_RATIOS,
    defaultAspectRatio: "16:9",
    supportsResolution: true,
    supportedResolutions,
    defaultResolution: supportedResolutions.includes("1280x720")
      ? "1280x720"
      : "720p",
    supportsDuration: true,
    minDurationSeconds,
    maxDurationSeconds,
    defaultDurationSeconds: 5,
    supportsFps: false,
    supportsSeed: false,
    supportsNegativePrompt: false,
    supportsAudioGeneration,
    supportsFirstLastFrame,
    supportsReferenceImages,
    supportsDraftMode,
    maxVideosPerCall: 1,
  };
}

export const VIDEO_MODEL_REGISTRY: Record<VideoModel, VideoModelMeta> = {
  "fal/luma-dream-machine/ray-2": falVideoMeta("Luma Ray 2", {
    supportsImageToVideo: true,
  }),
  "fal/minimax-video": falVideoMeta("Minimax Video", {
    supportsImageToVideo: false,
  }),
  "bytedance/seedance-1-5-pro-251215": seedanceVideoMeta("Seedance 1.5 Pro", {
    supportsTextToVideo: true,
    supportsImageToVideo: true,
    supportsAudioGeneration: true,
    supportsFirstLastFrame: true,
    supportsReferenceImages: false,
    supportsDraftMode: true,
    minDurationSeconds: 4,
    maxDurationSeconds: 12,
  }),
  "bytedance/seedance-1-0-pro-250528": seedanceVideoMeta("Seedance 1.0 Pro", {
    supportsTextToVideo: true,
    supportsImageToVideo: true,
    supportsAudioGeneration: false,
    supportsFirstLastFrame: true,
    supportsReferenceImages: false,
    supportsDraftMode: false,
    minDurationSeconds: 2,
    maxDurationSeconds: 12,
  }),
  "bytedance/seedance-1-0-pro-fast-251015": seedanceVideoMeta(
    "Seedance 1.0 Pro Fast",
    {
      supportsTextToVideo: true,
      supportsImageToVideo: true,
      supportsAudioGeneration: false,
      supportsFirstLastFrame: false,
      supportsReferenceImages: false,
      supportsDraftMode: false,
      minDurationSeconds: 2,
      maxDurationSeconds: 12,
    },
  ),
  "bytedance/seedance-1-0-lite-t2v-250428": seedanceVideoMeta(
    "Seedance 1.0 Lite Text to Video",
    {
      supportsTextToVideo: true,
      supportsImageToVideo: false,
      supportsAudioGeneration: false,
      supportsFirstLastFrame: false,
      supportsReferenceImages: false,
      supportsDraftMode: false,
      minDurationSeconds: 2,
      maxDurationSeconds: 12,
    },
  ),
  "bytedance/seedance-1-0-lite-i2v-250428": seedanceVideoMeta(
    "Seedance 1.0 Lite Image to Video",
    {
      supportsTextToVideo: false,
      supportsImageToVideo: true,
      supportsAudioGeneration: false,
      supportsFirstLastFrame: true,
      supportsReferenceImages: true,
      supportsDraftMode: false,
      minDurationSeconds: 2,
      maxDurationSeconds: 12,
      supportedResolutions: SEEDANCE_LITE_I2V_RESOLUTIONS,
    },
  ),
  "google/veo-2.0-generate-001": veoVideoMeta("Veo 2", "google", {
    supportsAudioGeneration: false,
    maxVideosPerCall: 4,
  }),
  "vertex/veo-3.1-generate-001": veoVideoMeta("Veo 3.1 (Vertex)", "vertex", {
    supportsAudioGeneration: true,
    maxVideosPerCall: 1,
  }),
  "vertex/veo-3.1-fast-generate-001": veoVideoMeta(
    "Veo 3.1 Fast (Vertex)",
    "vertex",
    {
      supportsAudioGeneration: true,
      maxVideosPerCall: 1,
    },
  ),
  "vertex/veo-3.0-generate-001": veoVideoMeta("Veo 3.0 (Vertex)", "vertex", {
    supportsAudioGeneration: true,
    maxVideosPerCall: 1,
  }),
  "vertex/veo-3.0-fast-generate-001": veoVideoMeta(
    "Veo 3.0 Fast (Vertex)",
    "vertex",
    {
      supportsAudioGeneration: true,
      maxVideosPerCall: 1,
    },
  ),
  "vertex/veo-2.0-generate-001": veoVideoMeta("Veo 2 (Vertex)", "vertex", {
    supportsAudioGeneration: false,
    maxVideosPerCall: 4,
  }),
  "kling/kling-v2.6-t2v": klingVideoMeta("Kling v2.6 Text to Video", {
    supportsTextToVideo: true,
    supportsImageToVideo: false,
    supportsMotionControl: false,
  }),
  "kling/kling-v2.6-i2v": klingVideoMeta("Kling v2.6 Image to Video", {
    supportsTextToVideo: false,
    supportsImageToVideo: true,
    supportsMotionControl: false,
  }),
  "kling/kling-v2.6-motion-control": klingVideoMeta(
    "Kling v2.6 Motion Control",
    {
      supportsTextToVideo: false,
      supportsImageToVideo: true,
      supportsMotionControl: true,
    },
  ),
  "replicate/minimax/video-01": {
    displayName: "Minimax Video 01",
    provider: "replicate",
    supportsTextToVideo: true,
    supportsImageToVideo: false,
    supportsVideoEditing: false,
    supportsMotionControl: false,
    supportsAspectRatio: false,
    supportsResolution: false,
    supportsDuration: false,
    supportsFps: false,
    supportsSeed: false,
    supportsNegativePrompt: false,
    supportsAudioGeneration: false,
    maxVideosPerCall: 1,
  },
  "xai/grok-imagine-video": {
    displayName: "Grok Imagine Video",
    provider: "xai",
    supportsTextToVideo: true,
    supportsImageToVideo: true,
    supportsVideoEditing: true,
    supportsMotionControl: false,
    supportsAspectRatio: true,
    supportedAspectRatios: XAI_VIDEO_ASPECT_RATIOS,
    defaultAspectRatio: "16:9",
    supportsResolution: true,
    supportedResolutions: XAI_VIDEO_RESOLUTIONS,
    defaultResolution: "480p",
    supportsDuration: true,
    minDurationSeconds: 1,
    maxDurationSeconds: 15,
    defaultDurationSeconds: 5,
    supportsFps: false,
    supportsSeed: false,
    supportsNegativePrompt: false,
    supportsAudioGeneration: false,
    maxVideosPerCall: 1,
  },
};

export function getVideoModelMeta(model: VideoModel): VideoModelMeta {
  const meta = VIDEO_MODEL_REGISTRY[model];
  if (!meta) throw new Error(`Video model not found in registry: ${model}`);
  return meta;
}
