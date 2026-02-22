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

type AuthProvider = "google" | "github" | "twitter";

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
    <Card className="w-full max-w-md rounded-2xl bg-white/5 dark:bg-white/12 backdrop-blur-xl border border-white/12 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl md:text-2xl font-semibold">
          Hey, Welcome
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Continue with one of the following providers
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full rounded-xl gap-2"
            disabled={loading}
            onClick={() => handleSocialLogin("google")}
          >
            <Icons.GoogleLogo />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-xl gap-2"
            disabled={loading}
            onClick={() => handleSocialLogin("github")}
          >
            <Icons.Github />
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-xl gap-2"
            disabled={loading}
            onClick={() => handleSocialLogin("twitter")}
          >
            <Icons.Twitter />
            Continue with Twitter
          </Button>
        </div>
        {error && (
          <div className="mt-4 p-2 bg-rose-400/10 text-destructive w-full flex items-center justify-center">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t">
        <div className="w-full text-center py-4 text-xs">
          Built in Public by{" "}
          <Link
            href="https://vidara.in"
            target="_blank"
            className="inline-flex items-center gap-1 underline hover:text-foreground transition"
          >
            VIDARA
            <Icons.Heart />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
