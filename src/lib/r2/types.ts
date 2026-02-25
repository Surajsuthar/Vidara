export type R2Folder =
  | "generations" // final generated images
  | "thumbnails" // compressed previews
  | "watermarked" // shared images with watermark
  | "temp" // intermediate files, TTL 24h
  | "avatars"; // user profile pictures

export interface R2UploadOptions {
  userId: string;
  generationId?: string;
  folder: R2Folder;
  mimeType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface R2UploadResult {
  key: string;
  url: string; // public CDN URL
  bucket: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface R2DeleteResult {
  key: string;
  deleted: boolean;
  error?: string;
}

export interface R2PresignOptions {
  key: string;
  expiresInSeconds?: number; // default 3600 (1hr)
  bucket?: string;
}
