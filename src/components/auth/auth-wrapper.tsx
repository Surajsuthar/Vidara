"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { Icons } from "@/lib/icons";

type AuthProvider = "google" | "twitter";

export default function AuthWrapper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSocialLogin = async (provider: AuthProvider) => {
    await signIn.social({
      provider,
      callbackURL: "/",
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError(context) {
          console.log("context.error.message", context.error.message);
          setError(context.error.message);
        },
      },
    });
  };

  return (
    <Card className="w-full max-w-md rounded-none border-white/12 bg-[#0b0b0b]/82 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold md:text-2xl">
          Welcome to Vidara
        </CardTitle>
        <CardDescription className="text-sm text-white/52">
          Continue to generate AI images and short-form video.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            className="w-full gap-2 rounded-none bg-white text-black hover:bg-white/90"
            disabled={loading}
            onClick={() => handleSocialLogin("google")}
          >
            <Icons.GoogleLogo />
            Continue with Google
          </Button>

          <Button
            variant="default"
            className="w-full gap-2 rounded-none bg-white/10 text-white hover:bg-white/15"
            disabled={loading}
            onClick={() => handleSocialLogin("twitter")}
          >
            <Icons.Twitter />
            Continue with Twitter
          </Button>
        </div>
        {error && (
          <div className="mt-4 flex w-full items-center justify-center bg-rose-400/10 p-2 text-destructive">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t border-white/10">
        <div className="w-full py-4 text-center text-sm text-white/58">
          Built in Public by{" "}
          <Link
            href="https://vidara.in"
            target="_blank"
            className="inline-flex items-center gap-1 underline transition hover:text-white"
          >
            VIDARA
            <Icons.Heart />
          </Link>
        </div>
        <div className="text-center text-[10px] leading-5 text-white/42">
          By signing up, you agree to our{" "}
          <Link className="font-bold hover:underline" href="/terms">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="font-bold hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
