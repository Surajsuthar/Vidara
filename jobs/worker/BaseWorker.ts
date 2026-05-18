import {
  type Job,
  UnrecoverableError,
  Worker,
  type WorkerOptions,
} from "bullmq";
import { getRedisClient } from "../RedisConnection";

type BaseWorkerOptions = Omit<WorkerOptions, "connection"> &
  Partial<Pick<WorkerOptions, "connection">>;

type WorkerJob<DataType, ResultType, NameType extends string> = Job<
  DataType,
  ResultType,
  NameType
>;

export abstract class BaseWorker<
  DataType,
  ResultType = unknown,
  NameType extends string = string,
> {
  private readonly worker: Worker<DataType, ResultType, NameType>;

  protected constructor(queueName: string, options?: BaseWorkerOptions) {
    this.worker = new Worker<DataType, ResultType, NameType>(
      queueName,
      (job) => this.process(job),
      {
        connection: getRedisClient(),
        ...options,
      },
    );

    this.worker.on("completed", (job, result) => {
      this.onCompleted(job, result);
    });

    this.worker.on("failed", (job, err) => {
      this.onFailed(job, err);
    });

    this.worker.on("error", (err) => {
      this.onError(err);
    });
  }

  async close(): Promise<void> {
    await this.worker.close();
  }

  protected failPermanently(message: string): never {
    throw new UnrecoverableError(message);
  }

  protected abstract process(
    job: WorkerJob<DataType, ResultType, NameType>,
  ): Promise<ResultType>;

  protected onCompleted(
    job: WorkerJob<DataType, ResultType, NameType>,
    _result: ResultType,
  ): void {
    console.log(`[${this.constructor.name}] Job ${job.id} completed`);
  }

  protected onFailed(
    job: WorkerJob<DataType, ResultType, NameType> | undefined,
    err: Error,
  ): void {
    console.error(
      `[${this.constructor.name}] Job ${job?.id ?? "unknown"} failed: ${err.message}`,
    );
  }

  protected onError(err: Error): void {
    console.error(`[${this.constructor.name}] Worker error: ${err.message}`);
  }
}
