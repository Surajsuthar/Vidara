import type { R2Folder } from "./types";

// Key strategy:
// {folder}/{userId}/{YYYY}/{MM}/{DD}/{generationId}-{timestamp}.{ext}
// Example: generations/usr_abc123/2025/02/26/gen_xyz789-1740556800000.webp

export function generateR2Key({
  folder,
  userId,
  generationId,
  extension = "webp",
}: {
  folder: R2Folder;
  userId: string;
  generationId?: string;
  extension?: string;
}): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  const identifier = generationId
    ? `${generationId}-${now.getTime()}`
    : `${crypto.randomUUID()}-${now.getTime()}`;

  return `${folder}/${userId}/${year}/${month}/${day}/${identifier}.${extension}`;
}

export function generateThumbnailKey(originalKey: string): string {
  // generations/usr/2025/02/26/gen-xxx.webp
  // → thumbnails/usr/2025/02/26/gen-xxx_thumb.webp
  return originalKey
    .replace(/^generations\//, "thumbnails/")
    .replace(/(\.[^.]+)$/, "_thumb$1");
}

export function getPublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export function getExtensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/webp": "webp",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
  };
  return map[mimeType] ?? "webp";
}
