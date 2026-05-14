import { type JobsOptions, Queue, type QueueOptions } from "bullmq";
import { getRedisOptions } from "./RedisConnection";

type TypedQueue<TJobData, TJobResult, TJobName extends string> = Queue<
  TJobData,
  TJobResult,
  TJobName,
  TJobData,
  TJobResult,
  TJobName
>;

export class BaseQueue<
  TJobData,
  TJobName extends string,
  TJobResult = unknown,
> {
  protected queue: TypedQueue<TJobData, TJobResult, TJobName>;

  constructor(queueName: string, options?: Partial<QueueOptions>) {
    this.queue = new Queue<
      TJobData,
      TJobResult,
      TJobName,
      TJobData,
      TJobResult,
      TJobName
    >(queueName, {
      connection: getRedisOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
      },
      ...options,
    });

    this.queue.on("error", (err) =>
      console.error(`[Queue:${queueName}] Error:`, err),
    );
  }

  async add(jobName: TJobName, data: TJobData, options?: JobsOptions) {
    return this.queue.add(jobName, data, options);
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

  getQueue(): TypedQueue<TJobData, TJobResult, TJobName> {
    return this.queue;
  }
}
