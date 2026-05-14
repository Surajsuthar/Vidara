import "dotenv/config";

import { EmailWorker } from "@/jobs/email/EmailWorker";
import { GenerationWorker } from "@/jobs/generation/GenerationWorker";
import { closeDbPool } from "@/lib/db";
import { closeRedisClient } from "./queue/RedisConnection";

const workers = [EmailWorker.getInstance(), GenerationWorker.getInstance()];

console.log(`[Worker] ${workers.length} workers running`);

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`[Worker] Received ${signal}, shutting down...`);
  await Promise.all(workers.map((worker) => worker.close()));
  await closeRedisClient();
  await closeDbPool();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
