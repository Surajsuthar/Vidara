import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2_BUCKET, r2Client } from "./client";
import type { R2PresignOptions } from "./types";

// ─────────────────────────────────────────────────────────────
// Generate a signed URL for private bucket access
// Use when: watermarked images, user-private files, admin downloads
// ─────────────────────────────────────────────────────────────
export async function getPresignedUrl({
  key,
  expiresInSeconds = 3600, // 1 hour default
  bucket = R2_BUCKET,
}: R2PresignOptions): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });
}

// ─────────────────────────────────────────────────────────────
// Presigned URL presets for different use cases
// ─────────────────────────────────────────────────────────────
export const presignedFor = {
  // Short-lived — for secure image display (private gallery)
  display: (key: string) => getPresignedUrl({ key, expiresInSeconds: 900 }), // 15 min
  // Medium — for download links
  download: (key: string) => getPresignedUrl({ key, expiresInSeconds: 3600 }), // 1 hr
  // Long — for sharing links (watermarked)
  share: (key: string) => getPresignedUrl({ key, expiresInSeconds: 86400 }), // 24 hr
  // Admin — for internal review
  admin: (key: string) => getPresignedUrl({ key, expiresInSeconds: 604800 }), // 7 days
};
