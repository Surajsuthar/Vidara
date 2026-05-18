import type { JobsOptions } from "bullmq";
import type { ImageGenOptions } from "@/ai/types";
import { BaseQueue } from "../../../jobs/queue/BaseQueue";

export type GenerationJobName = "generate-image";

export type GenerationJobData = {
  requestId: string;
  userId?: string;
  prompt: string;
  options: ImageGenOptions;
  notifyChannel?: string;
};

let generationQueue:
  | BaseQueue<GenerationJobData, GenerationJobName>
  | undefined;

function getGenerationQueue() {
  generationQueue ??= new BaseQueue<GenerationJobData, GenerationJobName>(
    "generation",
    {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: { count: 200 },
        removeOnFail: { count: 500 },
      },
    },
  );

  return generationQueue;
}

export function enqueueImageGeneration(
  data: GenerationJobData,
  options?: JobsOptions,
) {
  return getGenerationQueue().add("generate-image", data, {
    jobId: data.requestId,
    ...options,
  });
}
