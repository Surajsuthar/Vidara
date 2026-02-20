export interface ImagenGenerateRequest {
  prompt: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
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