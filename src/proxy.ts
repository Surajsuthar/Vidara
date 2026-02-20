import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const authRoute = ["/auth"];

export const protectedRoute = ["/media", "/settings"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie = getSessionCookie(req);
  console.log("session", sessionCookie);

  if (sessionCookie && authRoute.some((path) => pathname.startsWith(path))) {
    console.log("session cookie", sessionCookie);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
