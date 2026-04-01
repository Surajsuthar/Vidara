import z from "zod";
import { generate } from "@/ai/generator";
import type {
  AspectRatio,
  ImageGenOptions,
  ImageModel,
  ImageOutputFormat,
  QualityTier,
} from "@/ai/types";
import { GenerationQueue } from "@/jobs/generation/GenerationQueue";
import {
  createGenerationJobState,
  getGenerationJobState,
} from "@/jobs/generation/status-store";
import { getMyUser } from "@/lib/auth-service";
import { Errors, wrapError } from "@/lib/error";
import { getClientInfo, rateLimit } from "@/lib/utils";

const generateRequestSchema = z.object({
  prompt: z.string().trim().min(1),
  model: z.string().trim().min(1),
  images: z.array(z.string()).optional(),
  negativePrompt: z.string().trim().min(1).optional(),
  n: z.number().int().min(1).max(4).optional(),
  aspectRatio: z
    .enum([
      "1:1",
      "4:3",
      "3:4",
      "16:9",
      "9:16",
      "3:2",
      "2:3",
      "4:5",
      "5:4",
      "9:21",
      "21:9",
      "2:1",
      "1:2",
      "19.5:9",
      "9:19.5",
      "20:9",
      "9:20",
    ] satisfies [AspectRatio, ...AspectRatio[]])
    .optional(),
  size: z.string().trim().min(1).optional(),
  quality: z
    .enum([
      "low",
      "standard",
      "hd",
      "ultra",
      "premium",
      "medium",
      "high",
    ] satisfies [QualityTier, ...QualityTier[]])
    .optional(),
  outputFormat: z
    .enum(["png", "webp", "jpeg"] satisfies [
      ImageOutputFormat,
      ...ImageOutputFormat[],
    ])
    .optional(),
  seed: z.number().int().optional(),
});

export async function GET(req: Request) {
  const userAuth = await getMyUser();

  if (!userAuth) {
    const appError = Errors.unauthorized();
    return Response.json(appError.toResponse(), {
      status: appError.httpStatus,
    });
  }

  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return Response.json({
      success: true,
      data: "Generate route is available.",
    });
  }

  const job = getGenerationJobState(requestId);

  if (!job) {
    const appError = Errors.notFound("Generation job");
    return Response.json(appError.toResponse(), {
      status: appError.httpStatus,
    });
  }

  return Response.json({
    success: true,
    data: "Generation status fetched successfully.",
    job,
  });
}

export async function POST(req: Request) {
  try {
    const userAuth = await getMyUser();

    if (!userAuth) {
      const appError = Errors.unauthorized();
      return Response.json(appError.toResponse(), {
        status: appError.httpStatus,
      });
    }

    const clientIp = getClientInfo(req);
    const { success, remaining, reset, pending } =
      await rateLimit.limit(clientIp);
    void pending;

    if (!success) {
      const retryAfterSeconds = Math.max(
        0,
        Math.ceil((reset - Date.now()) / 1000),
      );
      const appError = Errors.rateLimited();

      return Response.json(appError.toResponse(), {
        status: appError.httpStatus,
        headers: { "Retry-After": retryAfterSeconds.toString() },
      });
    }

    const json = await req.json();
    const parsed = generateRequestSchema.safeParse(json);

    if (!parsed.success) {
      const appError = Errors.validation("Invalid generation payload.", {
        issues: parsed.error.flatten(),
      });

      return Response.json(appError.toResponse(), {
        status: appError.httpStatus,
      });
    }

    const payload: ImageGenOptions = {
      ...parsed.data,
      model: parsed.data.model as ImageModel,
    };

    if (!payload.prompt.trim()) {
      throw Errors.ai.invalidPrompt("Prompt is required.");
    }

    const requestId = crypto.randomUUID();
    createGenerationJobState({
      id: requestId,
      prompt: payload.prompt,
      model: payload.model,
    });

    const queue = GenerationQueue.getInstance();
    await queue.enqueueImageGeneration({
      requestId,
      prompt: payload.prompt,
      options: payload,
    });

    return Response.json(
      {
        success: true,
        data: "Image generation queued successfully.",
        remaining,
        requestId,
        status: "queued",
      },
      {
        status: 202,
      },
    );
  } catch (error) {
    console.log("error", error);
    const appError =
      error instanceof z.ZodError
        ? Errors.validation("Invalid request payload.", {
            issues: error.flatten(),
          })
        : wrapError(error, "IMAGE_GENERATION_FAILED");

    return Response.json(appError.toResponse(), {
      status: appError.httpStatus,
    });
  }
}
