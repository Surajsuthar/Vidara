import { headers } from "next/headers";
import type { User } from "../../drizzle/schema";
import { auth } from "./auth";


/**
 *
 * for server side call
 */
export async function getMyUser(): Promise<User | null> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return session as User | null;
}
