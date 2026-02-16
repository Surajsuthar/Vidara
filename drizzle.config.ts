import { defineConfig } from "drizzle-kit";
import { env } from "@/utils/env";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
