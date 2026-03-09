import type { JobsOptions } from "bullmq";
import type { ImageGenOptions } from "@/ai/types";
import { BaseQueue } from "../../../worker/queue/BaseQueue";

export type GenerationJobName = "generate-image";

export type GenerationJobData = {
  requestId: string;
  userId?: string;
  prompt: string;
  options: ImageGenOptions;
  notifyChannel?: string;
};

export class GenerationQueue extends BaseQueue<
  GenerationJobData,
  GenerationJobName
> {
  private static instance: GenerationQueue;

  private constructor() {
    super("generation", {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          count: 200,
        },
        removeOnFail: {
          count: 500,
        },
      },
    });
  }

  static getInstance(): GenerationQueue {
    if (!GenerationQueue.instance) {
      GenerationQueue.instance = new GenerationQueue();
    }

    return GenerationQueue.instance;
  }

  async enqueueImageGeneration(
    data: GenerationJobData,
    options?: JobsOptions,
  ) {
    return this.add("generate-image", data, {
      jobId: data.requestId,
      ...options,
    });
  }
}
