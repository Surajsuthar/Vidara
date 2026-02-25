import {
  type Job,
  UnrecoverableError,
  Worker,
  type WorkerOptions,
} from "bullmq";
import { RedisConnection } from "./RedisConnection";

export abstract class BaseWorker<TJobData, TJobResult = void> {
  protected worker: Worker<TJobData, TJobResult>;
  private readonly workerName: string;

  constructor(queueName: string, options?: Partial<WorkerOptions>) {
    this.workerName = queueName;

    this.worker = new Worker<TJobData, TJobResult>(
      queueName,
      (job) => this.process(job),
      {
        connection: RedisConnection.getInstance(),
        concurrency: 5,
        ...options,
      },
    );

    this.registerListeners();
  }

  // Subclasses implement this
  protected abstract process(job: Job<TJobData>): Promise<TJobResult>;

  // Subclasses can override for custom error handling
  protected onFailed(job: Job<TJobData> | undefined, err: Error): void {
    console.error(
      `[Worker:${this.workerName}] Job ${job?.id} failed:`,
      err.message,
    );
  }

  // Mark a job as permanently failed (no retries)
  protected failPermanently(message: string): never {
    throw new UnrecoverableError(message);
  }

  private registerListeners(): void {
    this.worker.on("completed", (job) => {
      console.log(`[Worker:${this.workerName}] Job ${job.id} completed`);
    });

    this.worker.on("failed", (job, err) => {
      this.onFailed(job, err);
    });

    this.worker.on("error", (err) => {
      console.error(`[Worker:${this.workerName}] Worker error:`, err);
    });

    this.worker.on("stalled", (jobId) => {
      console.warn(`[Worker:${this.workerName}] Job ${jobId} stalled`);
    });
  }

  async close(): Promise<void> {
    await this.worker.close();
  }

  getWorker(): Worker<TJobData, TJobResult> {
    return this.worker;
  }
}
