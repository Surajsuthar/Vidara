import type { Job } from "bullmq";
import { generate } from "@/ai/generator";
import type { ImageGenOptions, ImageGenResult } from "@/ai/types";
import {
  setGenerationJobCompleted,
  setGenerationJobFailed,
  setGenerationJobProcessing,
} from "./status-store";
import { BaseWorker } from "../../../worker/queue/BaseWorker";

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

    if (!prompt.trim()) {
      this.failPermanently("Prompt is required for generation jobs.");
    }

    console.log(
      `[GenerationWorker] Job ${job.id} | requestId: ${requestId} | userId: ${
        userId ?? "anonymous"
      } | model: ${options.model}`,
    );

    setGenerationJobProcessing(requestId);

    await job.updateProgress(10);

    const result = await generate({
      ...options,
      prompt,
    });

    await job.updateProgress(100);

    setGenerationJobCompleted(requestId, {
      model: result.model,
      warnings: result.warnings,
      durationMs: result.durationMs,
      images: result.images.map((image) => ({
        base64: image.base64,
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
    if (job?.data.requestId) {
      setGenerationJobFailed(job.data.requestId, {
        code: "IMAGE_GENERATION_FAILED",
        message: err.message,
      });
    }

    super.onFailed(job, err);
    console.error(
      `[GenerationWorker] Job ${job?.id} failed | requestId: ${job?.data.requestId} | error: ${err.message}`,
    );
  }
}
