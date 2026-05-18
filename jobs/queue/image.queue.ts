import type { GenerationJobName, ImageGenerationJobData } from "../types";
import { BaseQueue } from "./BaseQueue";

export const imageQueue = new BaseQueue<
  ImageGenerationJobData,
  GenerationJobName
>("generate");

export async function enqueueImageQueue(
  imageGenerationJobData: ImageGenerationJobData,
) {
  await imageQueue.add("generate-image", imageGenerationJobData, {
    jobId: `generate:${imageGenerationJobData.requestId}`,
  });
}
