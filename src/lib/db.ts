import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/utils/env";
import * as schema from "../../drizzle/schema";

const globalForDb = globalThis as typeof globalThis & {
  __vidaraDbPool?: Pool;
};

export const dbPool =
  globalForDb.__vidaraDbPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DATABASE_POOL_MAX,
    idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__vidaraDbPool = dbPool;
}

dbPool.on("error", (error) => {
  console.error("[Database] Unexpected idle client error:", error);
});

export const db = drizzle(dbPool, { schema });

export async function closeDbPool() {
  await dbPool.end();

  if (globalForDb.__vidaraDbPool === dbPool) {
    globalForDb.__vidaraDbPool = undefined;
  }
}
