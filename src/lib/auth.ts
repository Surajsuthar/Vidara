import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { EmailQueue } from "@/jobs/email/EmailQueue";
import { signupTemplate } from "@/jobs/email/template";
import { env } from "@/utils/env";
import { account, session, user, verification } from "../../drizzle/schema";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  rateLimit: {
    max: 100,
    window: 60,
  },
  experimental: {
    joins: true,
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
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        after: async ({ user }) => {
          const createdUser = user as {
            email: string;
            name: string;
          };

          await EmailQueue.getInstance().enqueueWelcomeEmail({
            to: createdUser.email,
            subject: "Welcome to Vidara",
            html: signupTemplate(createdUser.name),
            text: `Welcome ${createdUser.name}. You have successfully signed up to Vidara.`,
          });
        },
      },
    },
  },
  plugins: [lastLoginMethod(), nextCookies()],
  trustedOrigins: ["http://localhost:3000"],
});
