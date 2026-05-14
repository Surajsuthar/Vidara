import Redis, { type RedisOptions } from "ioredis";
import { env } from "@/utils/env";

let redis: Redis | undefined;

export function getRedisOptions(): RedisOptions {
  return {
    host: env.REDIS_HOST ?? "localhost",
    port: Number(env.REDIS_PORT ?? 6379),
    password: env.REDIS_PASSWORD,
    tls: {},
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
      if (times > 10) return null;
      return Math.min(times * 500, 5000);
    },
  };
}

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(getRedisOptions());

    redis.on("connect", () => console.log("[Redis] Connected"));
    redis.on("error", (err) => console.error("[Redis] Error:", err));
  }

  return redis;
}

export async function closeRedisClient(): Promise<void> {
  if (!redis) return;

  await redis.quit();
  redis = undefined;
}
