import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { R2_BUCKET, R2_PRIVATE_BUCKET, r2Client } from "./client";
import { generateR2Key, getExtensionFromMime, getPublicUrl } from "./keys";
import type { R2UploadOptions, R2UploadResult } from "./types";

// ─────────────────────────────────────────────────────────────
// 1. Upload from base64 (from Vercel AI SDK response)
// ─────────────────────────────────────────────────────────────
export async function uploadBase64Image(
  base64: string,
  opts: R2UploadOptions,
): Promise<R2UploadResult> {
  const mimeType = opts.mimeType ?? "image/webp";
  const extension = getExtensionFromMime(mimeType);

  // Strip data URL prefix if present (data:image/png;base64,...)
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");

  return uploadBuffer(buffer, { ...opts, mimeType, extension });
}

// ─────────────────────────────────────────────────────────────
// 2. Upload from Uint8Array (from Vercel AI SDK response)
// ─────────────────────────────────────────────────────────────
export async function uploadUint8Array(
  data: Uint8Array,
  opts: R2UploadOptions,
): Promise<R2UploadResult> {
  const mimeType = opts.mimeType ?? "image/webp";
  const extension = getExtensionFromMime(mimeType);
  const buffer = Buffer.from(data);

  return uploadBuffer(buffer, { ...opts, mimeType, extension });
}

// ─────────────────────────────────────────────────────────────
// 3. Upload from URL (download from provider → stream to R2)
//    Never store provider URLs — they expire!
// ─────────────────────────────────────────────────────────────
export async function uploadFromUrl(
  url: string,
  opts: R2UploadOptions,
): Promise<R2UploadResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from provider: ${response.status} ${url}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "image/webp";
  const mimeType = opts.mimeType ?? contentType;
  const extension = getExtensionFromMime(mimeType);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return uploadBuffer(buffer, { ...opts, mimeType, extension });
}

// ─────────────────────────────────────────────────────────────
// 4. Multipart upload for large files (video, future use)
// ─────────────────────────────────────────────────────────────
export async function uploadMultipart(
  stream: ReadableStream,
  opts: R2UploadOptions & { extension: string; contentLength?: number },
): Promise<R2UploadResult> {
  const mimeType = opts.mimeType ?? "video/mp4";
  const key = generateR2Key({
    folder: opts.folder,
    userId: opts.userId,
    generationId: opts.generationId,
    extension: opts.extension,
  });

  const bucket = opts.isPublic === false ? R2_PRIVATE_BUCKET : R2_BUCKET;

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: stream,
      ContentType: mimeType,
      Metadata: buildMetadata(opts),
      ...(opts.contentLength ? { ContentLength: opts.contentLength } : {}),
    },
    queueSize: 4, // 4 parallel uploads
    partSize: 10 * 1024 * 1024, // 10MB parts
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(`[R2] Multipart upload progress: ${JSON.stringify(progress)}`);
  });

  await upload.done();

  // HEAD to get file size
  const head = await r2Client.send(
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
  );

  return {
    key,
    url: getPublicUrl(key),
    bucket: bucket!,
    sizeBytes: head.ContentLength ?? 0,
    mimeType,
    uploadedAt: new Date(),
  };
}

// ─────────────────────────────────────────────────────────────
// Internal: core buffer upload (used by all above)
// ─────────────────────────────────────────────────────────────
async function uploadBuffer(
  buffer: Buffer,
  opts: R2UploadOptions & { mimeType: string; extension: string },
): Promise<R2UploadResult> {
  const key = generateR2Key({
    folder: opts.folder,
    userId: opts.userId,
    generationId: opts.generationId,
    extension: opts.extension,
  });

  const bucket = opts.isPublic === false ? R2_PRIVATE_BUCKET : R2_BUCKET;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: opts.mimeType,
      ContentLength: buffer.byteLength,
      Metadata: buildMetadata(opts),
      // Cache for 1 year — images are immutable (keyed by generationId+timestamp)
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: getPublicUrl(key),
    bucket: bucket!,
    sizeBytes: buffer.byteLength,
    mimeType: opts.mimeType,
    uploadedAt: new Date(),
  };
}

// ─────────────────────────────────────────────────────────────
// Metadata attached to every R2 object (searchable in Cloudflare dashboard)
// ─────────────────────────────────────────────────────────────
function buildMetadata(opts: R2UploadOptions): Record<string, string> {
  return {
    userId: opts.userId,
    generationId: opts.generationId ?? "",
    uploadedAt: new Date().toISOString(),
    ...(opts.metadata ?? {}),
  };
}
