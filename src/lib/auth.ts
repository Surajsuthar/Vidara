import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { grantCredits, WELCOME_CREDITS } from "@/utils/credit-service";
import { env } from "@/utils/env";
import { account, session, user, verification } from "../../drizzle/schema";
import { enqueueWelcomeQueue } from "../../jobs/queue/email.queue";
import { db } from "./db";
import { signupTemplate } from "./template";

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
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
        after: async (createdUser) => {
          const results = await Promise.allSettled([
            grantCredits({
              userId: createdUser.id,
              credits: WELCOME_CREDITS,
              type: "grant",
              description: "Welcome credits",
            }),
            enqueueWelcomeQueue({
              to: createdUser.email,
              subject: "Welcome to Vidara",
              html: signupTemplate(createdUser.name),
              text: `Welcome ${createdUser.name}. You have successfully signed up to Vidara.`,
            }),
          ]);

          for (const result of results) {
            if (result.status === "rejected") {
              console.error(
                "[Auth] Post-signup side effect failed:",
                result.reason,
              );
            }
          }
        },
      },
    },
  },
  plugins: [lastLoginMethod(), nextCookies()],
  trustedOrigins: ["http://localhost:3000"],
});
