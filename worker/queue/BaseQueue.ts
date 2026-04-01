import { type JobsOptions, Queue, type QueueOptions } from "bullmq";
import { RedisConnection } from "./RedisConnection";

type QueueAdd<T, R, N extends string> = Queue<T, R, N>["add"];

export abstract class BaseQueue<
  TJobData,
  TResult = unknown,
  NameType extends string = string,
> {
  protected queue: Queue<TJobData, TResult, NameType>;

  constructor(queueName: string, options?: Partial<QueueOptions>) {
    this.queue = new Queue<TJobData, TResult, NameType>(queueName, {
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

  async add(jobName: NameType, data: TJobData, options?: JobsOptions) {
    return this.queue.add(
      jobName as Parameters<QueueAdd<TJobData, TResult, NameType>>[0],
      data as Parameters<QueueAdd<TJobData, TResult, NameType>>[1],
      options,
    );
  }

  async addBulk(
    jobs: { name: NameType; data: TJobData; opts?: JobsOptions }[],
  ) {
    //
    return this.queue.addBulk(jobs as Parameters<typeof this.queue.addBulk>[0]);
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

  getQueue(): Queue<TJobData> {
    return this.queue;
  }
}
