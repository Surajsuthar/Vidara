import { RedisConnection } from "../../../worker/queue/RedisConnection";

export type GenerationJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type GenerationImageResult = {
  base64?: string;
  url?: string;
  mediaId?: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export type GenerationJobResult = {
  model: string;
  warnings: string[];
  durationMs: number;
  images: GenerationImageResult[];
};

export type GenerationJobError = {
  code: string;
  message: string;
  retryable?: boolean;
  timestamp?: string;
};

export type GenerationJobState = {
  id: string;
  userId?: string;
  status: GenerationJobStatus;
  prompt: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  result?: GenerationJobResult;
  error?: GenerationJobError;
};

const STORE_TTL_SECONDS = 60 * 60 * 24;

function getStoreKey(id: string) {
  return `generation:status:${id}`;
}

async function readState(id: string) {
  const redis = RedisConnection.getInstance();
  const raw = await redis.get(getStoreKey(id));
  if (!raw) return undefined;

  return JSON.parse(raw) as GenerationJobState;
}

async function writeState(state: GenerationJobState) {
  const redis = RedisConnection.getInstance();
  await redis.set(
    getStoreKey(state.id),
    JSON.stringify(state),
    "EX",
    STORE_TTL_SECONDS,
  );
}

function nowIso() {
  return new Date().toISOString();
}

export async function createGenerationJobState(input: {
  id: string;
  userId?: string;
  prompt: string;
  model: string;
}): Promise<GenerationJobState> {
  const timestamp = nowIso();

  const state: GenerationJobState = {
    id: input.id,
    userId: input.userId,
    status: "queued",
    prompt: input.prompt,
    model: input.model,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeState(state);
  return state;
}

export async function getGenerationJobState(id: string) {
  return readState(id);
}

export async function setGenerationJobQueued(id: string) {
  const current = await readState(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "queued",
    updatedAt: nowIso(),
  };

  await writeState(next);
  return next;
}

export async function setGenerationJobProcessing(id: string) {
  const current = await readState(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "processing",
    updatedAt: nowIso(),
  };

  await writeState(next);
  return next;
}

export async function setGenerationJobCompleted(
  id: string,
  result: GenerationJobResult,
) {
  const current = await readState(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "completed",
    result,
    error: undefined,
    updatedAt: nowIso(),
  };

  await writeState(next);
  return next;
}

export async function setGenerationJobFailed(
  id: string,
  error: GenerationJobError,
) {
  const current = await readState(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "failed",
    error,
    updatedAt: nowIso(),
  };

  await writeState(next);
  return next;
}

export async function deleteGenerationJobState(id: string) {
  const redis = RedisConnection.getInstance();
  return redis.del(getStoreKey(id));
}

export async function listGenerationJobStates() {
  const redis = RedisConnection.getInstance();
  const states: GenerationJobState[] = [];
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      "generation:status:*",
      "COUNT",
      100,
    );
    cursor = nextCursor;

    if (keys.length === 0) continue;

    const values = await redis.mget(keys);
    for (const value of values) {
      if (!value) continue;
      states.push(JSON.parse(value) as GenerationJobState);
    }
  } while (cursor !== "0");

  return states.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
