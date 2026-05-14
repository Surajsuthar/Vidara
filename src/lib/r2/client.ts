import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/utils/env";

export const R2_BUCKET = env.R2_BUCKET_NAME;
export const R2_PRIVATE_BUCKET = env.R2_PRIVATE_BUCKET_NAME ?? R2_BUCKET;

class R2ClientSingleton {
  private static instance: R2ClientSingleton | null = null;
  private readonly _client: S3Client;

  private constructor() {
    this._client = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  static getInstance(): R2ClientSingleton {
    if (!R2ClientSingleton.instance) {
      R2ClientSingleton.instance = new R2ClientSingleton();
    }
    return R2ClientSingleton.instance;
  }

  get client(): S3Client {
    return this._client;
  }
}

export const r2Client = R2ClientSingleton.getInstance().client;
