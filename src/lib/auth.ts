import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/utils/env";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
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
