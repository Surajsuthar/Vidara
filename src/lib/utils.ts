import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export const roundUpFormat = (count: number) => {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
};

export function getClientInfo(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0] ?? realIp ?? "unknown";
}

export const getSize = (size: string) => {
  if (!size) return undefined;
  const parts = size.split("x");

  if (parts.length !== 2) return undefined;
  const width = Number(parts[0]);
  const height = Number(parts[1]);

  if (isNaN(width) || isNaN(height)) return undefined;

  const imageSize = `${width}x${height}` as `${number}x${number}`;
  return imageSize;
};