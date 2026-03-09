export type GenerationJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type GenerationImageResult = {
  base64: string;
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
  status: GenerationJobStatus;
  prompt: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  result?: GenerationJobResult;
  error?: GenerationJobError;
};

const generationStatusStore = new Map<string, GenerationJobState>();

function nowIso() {
  return new Date().toISOString();
}

export function createGenerationJobState(input: {
  id: string;
  prompt: string;
  model: string;
}): GenerationJobState {
  const timestamp = nowIso();

  const state: GenerationJobState = {
    id: input.id,
    status: "queued",
    prompt: input.prompt,
    model: input.model,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  generationStatusStore.set(input.id, state);
  return state;
}

export function getGenerationJobState(id: string) {
  return generationStatusStore.get(id);
}

export function setGenerationJobQueued(id: string) {
  const current = generationStatusStore.get(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "queued",
    updatedAt: nowIso(),
  };

  generationStatusStore.set(id, next);
  return next;
}

export function setGenerationJobProcessing(id: string) {
  const current = generationStatusStore.get(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "processing",
    updatedAt: nowIso(),
  };

  generationStatusStore.set(id, next);
  return next;
}

export function setGenerationJobCompleted(
  id: string,
  result: GenerationJobResult,
) {
  const current = generationStatusStore.get(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "completed",
    result,
    error: undefined,
    updatedAt: nowIso(),
  };

  generationStatusStore.set(id, next);
  return next;
}

export function setGenerationJobFailed(id: string, error: GenerationJobError) {
  const current = generationStatusStore.get(id);
  if (!current) return undefined;

  const next: GenerationJobState = {
    ...current,
    status: "failed",
    error,
    updatedAt: nowIso(),
  };

  generationStatusStore.set(id, next);
  return next;
}

export function deleteGenerationJobState(id: string) {
  return generationStatusStore.delete(id);
}

export function listGenerationJobStates() {
  return Array.from(generationStatusStore.values()).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}
