export type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";

export type ImageQuality = "Low" | "High" | "Medium";

export interface ImagenGenerateRequest {
  prompt: string;
  aspectRatio?: AspectRatio;
  negativePrompt?: string;
  seed?: number;
  sampleCount?: number;
}

export interface ImagenImage {
  mimeType: string;
  bytesBase64Encoded: string;
}

export interface ImagenGenerateResponse {
  images: ImagenImage[];
}

export class client {}