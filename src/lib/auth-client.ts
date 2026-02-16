import { lastLoginMethodClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/utils/env";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [lastLoginMethodClient()],
});
