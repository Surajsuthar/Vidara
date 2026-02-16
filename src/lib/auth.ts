import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "@/utils/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  rateLimit: {
    max: 100,
    window: 60,
  },
  socialProviders: {
    twitter: {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
