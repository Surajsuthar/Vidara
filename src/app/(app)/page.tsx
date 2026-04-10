"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import MasonryGallery from "@/components/masonry-layout";
import { Button } from "@/components/ui/button";
import { useGithub } from "@/hooks/use-github-count";

export default function AppPage() {
  const { stargazers_count } = useGithub();

  return (
    <main className="min-h-screen w-full flex flex-col">
      <header className="fixed top-4 left-4 right-4 sm:left-0 sm:right-0 z-50">
        <div className="max-w-6xl mx-auto backdrop-blur-lg  border shadow-xl rounded-none py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 md:h-16">
            <div className="flex space-x-3 items-center">
              <span className="text-xl sm:text-2xl font-bold bg-clip-text">
                Vidara
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="shadow-lg rounded-none bg-blue-700/90 hover:bg-blue-700/60 flex hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300 text-xs sm:text-sm"
              >
                <Link
                  href={"https://github.com/Surajsuthar/dev-notify"}
                  target="_blank"
                  className="p-1 flex space-x-2 items-center"
                >
                  <Github className="w-4 h-4" />
                  <p>{stargazers_count}</p>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="shadow-lg rounded-none bg-blue-700/90 hover:bg-blue-700/60 flex hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300 text-xs sm:text-sm"
              >
                <Link
                  href={"/auth"}
                  target="_blank"
                  className="p-1 flex space-x-2 items-center"
                >
                  <p>Login here!</p>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div>
        <MasonryGallery />
      </div>
    </main>
  );
}
