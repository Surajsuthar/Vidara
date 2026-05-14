import type { Job } from "bullmq";
import type { ImageGenOptions, ImageGenResult } from "@/ai/types";
import { sanitizePrompt } from "@/lib/prompt-sanitizer";
import { refundGenerationCredits } from "@/utils/credit-service";
import { generateImage } from "../../../ai";
import { BaseWorker } from "../../../worker/queue/BaseWorker";
import {
  markGenerationFailed,
  markGenerationProcessing,
  persistGenerationResult,
} from "./persistence";
import {
  setGenerationJobCompleted,
  setGenerationJobFailed,
  setGenerationJobProcessing,
} from "./status-store";

export type GenerationJobData = {
  requestId: string;
  userId?: string;
  prompt: string;
  options: ImageGenOptions;
};

export type GenerationJobResult = {
  requestId: string;
  status: "completed";
  result: ImageGenResult;
  completedAt: string;
};

export class GenerationWorker extends BaseWorker<
  GenerationJobData,
  GenerationJobResult
> {
  private static instance: GenerationWorker;

  private constructor() {
    super("generation", {
      concurrency: 3,
    });
  }

  static getInstance(): GenerationWorker {
    if (!GenerationWorker.instance) {
      GenerationWorker.instance = new GenerationWorker();
    }
    return GenerationWorker.instance;
  }

  protected async process(
    job: Job<GenerationJobData>,
  ): Promise<GenerationJobResult> {
    const { requestId, userId, prompt, options } = job.data;

    const promptSafety = sanitizePrompt(prompt);

    if (!promptSafety.ok) {
      this.failPermanently(promptSafety.reason);
    }

    if (!promptSafety.prompt) {
      this.failPermanently("Prompt is required for generation jobs.");
    }

    if (!userId) {
      this.failPermanently("User id is required for generation jobs.");
    }

    console.log(
      `[GenerationWorker] Job ${job.id} | requestId: ${requestId} | userId: ${
        userId ?? "anonymous"
      } | model: ${options.model}`,
    );

    await setGenerationJobProcessing(requestId);
    await markGenerationProcessing(requestId);

    await job.updateProgress(10);

    const result = await generateImage({
      ...options,
      prompt: promptSafety.prompt,
    });

    await job.updateProgress(80);

    const persistedImages = await persistGenerationResult({
      requestId,
      userId,
      options: {
        ...options,
        prompt: promptSafety.prompt,
      },
      result,
    });

    await job.updateProgress(100);

    await setGenerationJobCompleted(requestId, {
      model: result.model,
      warnings: result.warnings,
      durationMs: result.durationMs,
      images: persistedImages.map((image) => ({
        mediaId: image.mediaId,
        url: image.url,
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
      })),
    });

    const payload: GenerationJobResult = {
      requestId,
      status: "completed",
      result,
      completedAt: new Date().toISOString(),
    };

    console.log(
      `[GenerationWorker] Job ${job.id} completed | requestId: ${requestId} | images: ${result.images.length}`,
    );

    return payload;
  }

  protected onFailed(
    job: Job<GenerationJobData> | undefined,
    err: Error,
  ): void {
    const maxAttempts = job?.opts.attempts ?? 1;
    if (job && job.attemptsMade < maxAttempts) {
      super.onFailed(job, err);
      console.error(
        `[GenerationWorker] Job ${job.id} attempt ${job.attemptsMade}/${maxAttempts} failed | requestId: ${job.data.requestId} | error: ${err.message}`,
      );
      return;
    }

    if (job?.data.requestId) {
      void (async () => {
        await setGenerationJobFailed(job.data.requestId, {
          code: "IMAGE_GENERATION_FAILED",
          message: err.message,
        });
        await markGenerationFailed({
          requestId: job.data.requestId,
          errorMessage: err.message,
        });
        await refundGenerationCredits({
          requestId: job.data.requestId,
          reason: err.message,
        });
      })().catch((statusError) => {
        console.error(
          `[GenerationWorker] Failed to persist failure state | requestId: ${job.data.requestId} | error: ${
            statusError instanceof Error ? statusError.message : statusError
          }`,
        );
      });
    }

    super.onFailed(job, err);
    console.error(
      `[GenerationWorker] Job ${job?.id} failed | requestId: ${job?.data.requestId} | error: ${err.message}`,
    );
  }
}
