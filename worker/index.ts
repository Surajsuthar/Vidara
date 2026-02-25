// src/worker.ts

import { RedisConnection } from "./queue/RedisConnection";
import { WorkerManager } from "./queue/WorkerManager";

const manager = new WorkerManager();
manager.start();

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`[Worker] Received ${signal}, shutting down...`);
  await manager.shutdown();
  await RedisConnection.disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
