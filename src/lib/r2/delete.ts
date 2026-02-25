import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { R2_BUCKET, r2Client } from "./client";
import type { R2DeleteResult } from "./types";

// ─────────────────────────────────────────────────────────────
// Delete a single object
// ─────────────────────────────────────────────────────────────
export async function deleteObject(
  key: string,
  bucket = R2_BUCKET,
): Promise<R2DeleteResult> {
  try {
    await r2Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    return { key, deleted: true };
  } catch (err) {
    console.error(`[R2] Failed to delete ${key}:`, err);
    return { key, deleted: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────
// Bulk delete up to 1000 objects in one API call
// ─────────────────────────────────────────────────────────────
export async function deleteObjects(
  keys: string[],
  bucket = R2_BUCKET,
): Promise<R2DeleteResult[]> {
  if (keys.length === 0) return [];

  // R2 supports max 1000 per call — chunk automatically
  const CHUNK_SIZE = 1000;
  const results: R2DeleteResult[] = [];

  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunk = keys.slice(i, i + CHUNK_SIZE);
    try {
      const response = await r2Client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: chunk.map((key) => ({ Key: key })),
            Quiet: false,
          },
        }),
      );

      // Collect successes
      response.Deleted?.forEach(({ Key }) => {
        if (Key) results.push({ key: Key, deleted: true });
      });

      // Collect failures
      response.Errors?.forEach(({ Key, Message }) => {
        if (Key) results.push({ key: Key, deleted: false, error: Message });
      });
    } catch (err) {
      // If entire chunk fails, mark all as failed
      //biome-ignore lint: ling
      chunk.forEach((key) =>
        results.push({ key, deleted: false, error: String(err) }),
      );
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// Delete generation + its thumbnail atomically
// ─────────────────────────────────────────────────────────────
export async function deleteGenerationFiles(
  imageKey: string,
  thumbnailKey?: string,
): Promise<R2DeleteResult[]> {
  const keys = [imageKey, ...(thumbnailKey ? [thumbnailKey] : [])];
  return deleteObjects(keys);
}
