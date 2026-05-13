import Redis, { type RedisOptions } from "ioredis";
import { env } from "@/utils/env";

export class RedisConnection {
  private static instance: Redis;

  private constructor() {}

  static getBullMQOptions() {
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

  static getInstance(): Redis {
    if (!RedisConnection.instance) {
      const options: RedisOptions = RedisConnection.getBullMQOptions();

      RedisConnection.instance = new Redis(options);

      RedisConnection.instance.on("connect", () =>
        console.log("[Redis] Connected"),
      );
      RedisConnection.instance.on("error", (err) =>
        console.error("[Redis] Error:", err),
      );
    }

    return RedisConnection.instance;
  }

  static async disconnect(): Promise<void> {
    if (RedisConnection.instance) {
      await RedisConnection.instance.quit();
    }
  }
}
