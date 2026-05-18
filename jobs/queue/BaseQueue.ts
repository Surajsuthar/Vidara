import { Queue, type QueueOptions } from "bullmq";
import { getRedisClient } from "../RedisConnection";

export type BaseQueueOptions = Omit<QueueOptions, "connection"> &
  Partial<Pick<QueueOptions, "connection">>;

const defaultQueueOptions: QueueOptions = {
  connection: getRedisClient(),
  skipVersionCheck: true,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  },
};

function mergeQueueOptions(options?: BaseQueueOptions): QueueOptions {
  return {
    ...defaultQueueOptions,
    ...options,
    connection: options?.connection ?? defaultQueueOptions.connection,
    defaultJobOptions: {
      ...defaultQueueOptions.defaultJobOptions,
      ...options?.defaultJobOptions,
    },
  };
}

export class BaseQueue<
  DataType,
  NameType extends string,
  ResultType = unknown,
> extends Queue<DataType, ResultType, NameType> {
  constructor(queueName: string, options?: BaseQueueOptions) {
    super(queueName, mergeQueueOptions(options));
  }
}
