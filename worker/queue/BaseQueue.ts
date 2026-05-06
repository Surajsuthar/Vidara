import { type JobsOptions, Queue, type QueueOptions } from "bullmq";
import { RedisConnection } from "./RedisConnection";

export abstract class BaseQueue<
  TJobData,
  TJobName extends string,
  TJobResult = unknown,
> {
  protected queue: Queue<TJobData, TJobResult>;

  constructor(queueName: string, options?: Partial<QueueOptions>) {
    this.queue = new Queue<TJobData, TJobResult>(queueName, {
      connection: RedisConnection.getInstance(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
        removeOnFail: { count: 500 }, // Keep last 500 failed jobs
      },
      ...options,
    });

    this.queue.on("error", (err) =>
      console.error(`[Queue:${queueName}] Error:`, err),
    );
  }

  async add(jobName: TJobName, data: TJobData, options?: JobsOptions) {
    return this.queue.add(
      jobName as unknown as Parameters<typeof this.queue.add>[0],
      data as Parameters<typeof this.queue.add>[1],
      options,
    );
  }

  async getJobCounts() {
    return this.queue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    );
  }

  async pause() {
    return this.queue.pause();
  }

  async resume() {
    return this.queue.resume();
  }

  async obliterate() {
    return this.queue.obliterate({ force: true });
  }

  getQueue(): Queue<TJobData, TJobResult> {
    return this.queue;
  }
}
