import Redis from "ioredis";

import { env } from "@/utils/env";

let redis: Redis | undefined;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times: number) => {
        if (times > 10) return null;
        return Math.min(times * 500, 5000);
      },
    });

    redis.on("connect", () => console.log("[Redis] Connected"));
    redis.on("ready", () => console.log("[Redis] Ready"));
    redis.on("error", (err) => console.error("[Redis] Error:", err));
  }

  return redis;
}

export async function closeRedisClient(): Promise<void> {
  if (!redis) return;

  await redis.quit();
  redis = undefined;
}
