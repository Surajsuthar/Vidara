/**
 * AppError - Centralized error handling for a multimodal AI generation app
 * Covers: AI generation, auth (Better Auth), DB (Drizzle), file/media, rate limiting, API errors
 */

export const ErrorCode = {
  // Generic
  UNKNOWN: "UNKNOWN",
  VALIDATION: "VALIDATION",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  RATE_LIMITED: "RATE_LIMITED",
  TIMEOUT: "TIMEOUT",

  // Auth (Better Auth)
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_OAUTH_FAILED: "AUTH_OAUTH_FAILED",
  AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",
  AUTH_ACCOUNT_DISABLED: "AUTH_ACCOUNT_DISABLED",

  // Database (Drizzle)
  DB_CONNECTION: "DB_CONNECTION",
  DB_QUERY: "DB_QUERY",
  DB_NOT_FOUND: "DB_NOT_FOUND",
  DB_DUPLICATE: "DB_DUPLICATE",
  DB_CONSTRAINT: "DB_CONSTRAINT",
  DB_TRANSACTION: "DB_TRANSACTION",

  // AI Generation
  AI_GENERATION_FAILED: "AI_GENERATION_FAILED",
  AI_PROMPT_REJECTED: "AI_PROMPT_REJECTED",
  AI_QUOTA_EXCEEDED: "AI_QUOTA_EXCEEDED",
  AI_MODEL_UNAVAILABLE: "AI_MODEL_UNAVAILABLE",
  AI_CONTENT_FILTERED: "AI_CONTENT_FILTERED",
  AI_INVALID_PROMPT: "AI_INVALID_PROMPT",

  // Image generation
  IMAGE_GENERATION_FAILED: "IMAGE_GENERATION_FAILED",
  IMAGE_SIZE_EXCEEDED: "IMAGE_SIZE_EXCEEDED",
  IMAGE_FORMAT_INVALID: "IMAGE_FORMAT_INVALID",
  IMAGE_UPLOAD_FAILED: "IMAGE_UPLOAD_FAILED",

  // Video generation
  VIDEO_GENERATION_FAILED: "VIDEO_GENERATION_FAILED",
  VIDEO_TOO_LONG: "VIDEO_TOO_LONG",
  VIDEO_PROCESSING_FAILED: "VIDEO_PROCESSING_FAILED",
  VIDEO_UPLOAD_FAILED: "VIDEO_UPLOAD_FAILED",

  // Speech / TTS / STT
  SPEECH_SYNTHESIS_FAILED: "SPEECH_SYNTHESIS_FAILED",
  SPEECH_RECOGNITION_FAILED: "SPEECH_RECOGNITION_FAILED",
  SPEECH_LANGUAGE_UNSUPPORTED: "SPEECH_LANGUAGE_UNSUPPORTED",
  SPEECH_AUDIO_INVALID: "SPEECH_AUDIO_INVALID",

  // File / Storage
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_TYPE_UNSUPPORTED: "FILE_TYPE_UNSUPPORTED",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  STORAGE_QUOTA_EXCEEDED: "STORAGE_QUOTA_EXCEEDED",

  // External API
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  EXTERNAL_API_TIMEOUT: "EXTERNAL_API_TIMEOUT",
  EXTERNAL_API_RATE_LIMITED: "EXTERNAL_API_RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const HTTP_STATUS_MAP: Partial<Record<ErrorCode, number>> = {
  UNKNOWN: 500,
  VALIDATION: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  RATE_LIMITED: 429,
  TIMEOUT: 408,

  AUTH_SESSION_EXPIRED: 401,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_USER_NOT_FOUND: 404,
  AUTH_OAUTH_FAILED: 400,
  AUTH_EMAIL_NOT_VERIFIED: 403,
  AUTH_ACCOUNT_DISABLED: 403,

  DB_CONNECTION: 503,
  DB_QUERY: 500,
  DB_NOT_FOUND: 404,
  DB_DUPLICATE: 409,
  DB_CONSTRAINT: 422,
  DB_TRANSACTION: 500,

  AI_GENERATION_FAILED: 500,
  AI_PROMPT_REJECTED: 400,
  AI_QUOTA_EXCEEDED: 429,
  AI_MODEL_UNAVAILABLE: 503,
  AI_CONTENT_FILTERED: 400,
  AI_INVALID_PROMPT: 400,

  IMAGE_GENERATION_FAILED: 500,
  IMAGE_SIZE_EXCEEDED: 413,
  IMAGE_FORMAT_INVALID: 400,
  IMAGE_UPLOAD_FAILED: 500,

  VIDEO_GENERATION_FAILED: 500,
  VIDEO_TOO_LONG: 400,
  VIDEO_PROCESSING_FAILED: 500,
  VIDEO_UPLOAD_FAILED: 500,

  SPEECH_SYNTHESIS_FAILED: 500,
  SPEECH_RECOGNITION_FAILED: 500,
  SPEECH_LANGUAGE_UNSUPPORTED: 400,
  SPEECH_AUDIO_INVALID: 400,

  FILE_TOO_LARGE: 413,
  FILE_TYPE_UNSUPPORTED: 415,
  FILE_UPLOAD_FAILED: 500,
  FILE_NOT_FOUND: 404,
  STORAGE_QUOTA_EXCEEDED: 429,

  EXTERNAL_API_ERROR: 502,
  EXTERNAL_API_TIMEOUT: 504,
  EXTERNAL_API_RATE_LIMITED: 429,
};

const USER_MESSAGES: Partial<Record<ErrorCode, string>> = {
  UNKNOWN: "Something went wrong. Please try again.",
  VALIDATION: "Invalid input. Please check your data and try again.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You must be signed in to do that.",
  FORBIDDEN: "You don't have permission to perform this action.",
  RATE_LIMITED: "Too many requests. Please slow down and try again shortly.",
  TIMEOUT: "The request timed out. Please try again.",

  AUTH_SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  AUTH_INVALID_CREDENTIALS: "Incorrect email or password.",
  AUTH_USER_NOT_FOUND: "No account found with that email.",
  AUTH_OAUTH_FAILED: "OAuth sign-in failed. Please try again.",
  AUTH_EMAIL_NOT_VERIFIED: "Please verify your email before continuing.",
  AUTH_ACCOUNT_DISABLED: "Your account has been disabled. Contact support.",

  DB_CONNECTION: "Database unavailable. Please try again later.",
  DB_QUERY: "A database error occurred. Please try again.",
  DB_NOT_FOUND: "Record not found.",
  DB_DUPLICATE: "This already exists. Please use a different value.",
  DB_CONSTRAINT: "Data validation failed. Please review your input.",
  DB_TRANSACTION: "Transaction failed. Your changes were not saved.",

  AI_GENERATION_FAILED: "AI generation failed. Please try again.",
  AI_PROMPT_REJECTED: "Your prompt was rejected. Please try a different one.",
  AI_QUOTA_EXCEEDED: "AI generation quota reached. Please upgrade your plan.",
  AI_MODEL_UNAVAILABLE: "The selected AI model is currently unavailable.",
  AI_CONTENT_FILTERED:
    "Your prompt was flagged by content filters. Please revise it.",
  AI_INVALID_PROMPT: "Invalid prompt. Please provide more details.",

  IMAGE_GENERATION_FAILED: "Image generation failed. Please try again.",
  IMAGE_SIZE_EXCEEDED: "Image size exceeds the allowed limit.",
  IMAGE_FORMAT_INVALID: "Unsupported image format.",
  IMAGE_UPLOAD_FAILED: "Image upload failed. Please try again.",

  VIDEO_GENERATION_FAILED: "Video generation failed. Please try again.",
  VIDEO_TOO_LONG: "Video duration exceeds the maximum allowed length.",
  VIDEO_PROCESSING_FAILED: "Video processing failed. Please try again.",
  VIDEO_UPLOAD_FAILED: "Video upload failed. Please try again.",

  SPEECH_SYNTHESIS_FAILED: "Speech synthesis failed. Please try again.",
  SPEECH_RECOGNITION_FAILED: "Could not recognize speech. Please try again.",
  SPEECH_LANGUAGE_UNSUPPORTED: "The selected language is not supported.",
  SPEECH_AUDIO_INVALID:
    "Invalid audio input. Please provide a valid audio file.",

  FILE_TOO_LARGE: "File is too large. Please upload a smaller file.",
  FILE_TYPE_UNSUPPORTED: "File type is not supported.",
  FILE_UPLOAD_FAILED: "File upload failed. Please try again.",
  FILE_NOT_FOUND: "File not found.",
  STORAGE_QUOTA_EXCEEDED:
    "Storage quota exceeded. Please free up space or upgrade.",

  EXTERNAL_API_ERROR: "An external service error occurred. Please try again.",
  EXTERNAL_API_TIMEOUT: "External service timed out. Please try again.",
  EXTERNAL_API_RATE_LIMITED:
    "External service rate limit hit. Please try again shortly.",
};

export interface AppErrorOptions {
  code?: ErrorCode;
  message?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
  retryable?: boolean;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly userMessage: string;
  readonly cause?: unknown;
  readonly context?: Record<string, unknown>;
  readonly retryable: boolean;
  readonly timestamp: string;

  constructor(options: AppErrorOptions = {}) {
    const code = options.code ?? ErrorCode.UNKNOWN;
    const message =
      options.message ?? USER_MESSAGES[code] ?? "An unexpected error occurred.";

    super(message);

    this.name = "AppError";
    this.code = code;
    this.httpStatus = HTTP_STATUS_MAP[code] ?? 500;
    this.userMessage = USER_MESSAGES[code] ?? message;
    this.cause = options.cause;
    this.context = options.context;
    this.retryable = options.retryable ?? this.#isRetryable(code);
    this.timestamp = new Date().toISOString();

    // Preserve stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  #isRetryable(code: ErrorCode): boolean {
    const retryableCodes: ErrorCode[] = [
      ErrorCode.TIMEOUT,
      ErrorCode.RATE_LIMITED,
      ErrorCode.DB_CONNECTION,
      ErrorCode.AI_GENERATION_FAILED,
      ErrorCode.IMAGE_GENERATION_FAILED,
      ErrorCode.VIDEO_GENERATION_FAILED,
      ErrorCode.SPEECH_SYNTHESIS_FAILED,
      ErrorCode.FILE_UPLOAD_FAILED,
      ErrorCode.EXTERNAL_API_ERROR,
      ErrorCode.EXTERNAL_API_TIMEOUT,
      ErrorCode.EXTERNAL_API_RATE_LIMITED,
    ];
    return retryableCodes.includes(code);
  }

  /** Serialize for API responses — never leaks internal details */
  toResponse() {
    return {
      error: {
        code: this.code,
        message: this.userMessage,
        retryable: this.retryable,
        timestamp: this.timestamp,
      },
    };
  }

  /** Full details for logging */
  toLog() {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      httpStatus: this.httpStatus,
      retryable: this.retryable,
      context: this.context,
      cause:
        this.cause instanceof Error
          ? {
              name: this.cause.name,
              message: this.cause.message,
              stack: this.cause.stack,
            }
          : this.cause,
      stack: this.stack,
      timestamp: this.timestamp,
    };
  }

  toString() {
    return `[AppError ${this.code}] ${this.message}`;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export const Errors = {
  // Generic
  unknown: (cause?: unknown, context?: Record<string, unknown>) =>
    new AppError({ code: ErrorCode.UNKNOWN, cause, context }),

  validation: (message?: string, context?: Record<string, unknown>) =>
    new AppError({ code: ErrorCode.VALIDATION, message, context }),

  notFound: (resource?: string) =>
    new AppError({
      code: ErrorCode.NOT_FOUND,
      message: resource ? `${resource} not found.` : undefined,
    }),

  unauthorized: () => new AppError({ code: ErrorCode.UNAUTHORIZED }),

  forbidden: () => new AppError({ code: ErrorCode.FORBIDDEN }),

  rateLimited: (retryAfterMs?: number) =>
    new AppError({
      code: ErrorCode.RATE_LIMITED,
      context: retryAfterMs ? { retryAfterMs } : undefined,
    }),

  // Auth
  auth: {
    sessionExpired: () =>
      new AppError({ code: ErrorCode.AUTH_SESSION_EXPIRED }),
    invalidCredentials: () =>
      new AppError({ code: ErrorCode.AUTH_INVALID_CREDENTIALS }),
    userNotFound: () => new AppError({ code: ErrorCode.AUTH_USER_NOT_FOUND }),
    oauthFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.AUTH_OAUTH_FAILED, cause }),
    emailNotVerified: () =>
      new AppError({ code: ErrorCode.AUTH_EMAIL_NOT_VERIFIED }),
    accountDisabled: () =>
      new AppError({ code: ErrorCode.AUTH_ACCOUNT_DISABLED }),
  },

  // DB
  db: {
    connection: (cause?: unknown) =>
      new AppError({ code: ErrorCode.DB_CONNECTION, cause }),
    query: (cause?: unknown, context?: Record<string, unknown>) =>
      new AppError({ code: ErrorCode.DB_QUERY, cause, context }),
    notFound: (resource?: string) =>
      new AppError({
        code: ErrorCode.DB_NOT_FOUND,
        message: resource ? `${resource} not found.` : undefined,
      }),
    duplicate: (field?: string) =>
      new AppError({
        code: ErrorCode.DB_DUPLICATE,
        context: field ? { field } : undefined,
      }),
    constraint: (cause?: unknown) =>
      new AppError({ code: ErrorCode.DB_CONSTRAINT, cause }),
    transaction: (cause?: unknown) =>
      new AppError({ code: ErrorCode.DB_TRANSACTION, cause }),
  },

  // AI
  ai: {
    generationFailed: (cause?: unknown, context?: Record<string, unknown>) =>
      new AppError({ code: ErrorCode.AI_GENERATION_FAILED, cause, context }),
    promptRejected: (reason?: string) =>
      new AppError({
        code: ErrorCode.AI_PROMPT_REJECTED,
        context: reason ? { reason } : undefined,
      }),
    quotaExceeded: () => new AppError({ code: ErrorCode.AI_QUOTA_EXCEEDED }),
    modelUnavailable: (model?: string) =>
      new AppError({
        code: ErrorCode.AI_MODEL_UNAVAILABLE,
        context: model ? { model } : undefined,
      }),
    contentFiltered: () =>
      new AppError({ code: ErrorCode.AI_CONTENT_FILTERED }),
    invalidPrompt: (reason?: string) =>
      new AppError({
        code: ErrorCode.AI_INVALID_PROMPT,
        context: reason ? { reason } : undefined,
      }),
  },

  // Image
  image: {
    generationFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.IMAGE_GENERATION_FAILED, cause }),
    sizeExceeded: (maxSizeBytes?: number) =>
      new AppError({
        code: ErrorCode.IMAGE_SIZE_EXCEEDED,
        context: maxSizeBytes ? { maxSizeBytes } : undefined,
      }),
    formatInvalid: (format?: string) =>
      new AppError({
        code: ErrorCode.IMAGE_FORMAT_INVALID,
        context: format ? { format } : undefined,
      }),
    uploadFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.IMAGE_UPLOAD_FAILED, cause }),
  },

  // Video
  video: {
    generationFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.VIDEO_GENERATION_FAILED, cause }),
    tooLong: (maxDurationSecs?: number) =>
      new AppError({
        code: ErrorCode.VIDEO_TOO_LONG,
        context: maxDurationSecs ? { maxDurationSecs } : undefined,
      }),
    processingFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.VIDEO_PROCESSING_FAILED, cause }),
    uploadFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.VIDEO_UPLOAD_FAILED, cause }),
  },

  // Speech
  speech: {
    synthesisFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.SPEECH_SYNTHESIS_FAILED, cause }),
    recognitionFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.SPEECH_RECOGNITION_FAILED, cause }),
    languageUnsupported: (lang?: string) =>
      new AppError({
        code: ErrorCode.SPEECH_LANGUAGE_UNSUPPORTED,
        context: lang ? { language: lang } : undefined,
      }),
    audioInvalid: () => new AppError({ code: ErrorCode.SPEECH_AUDIO_INVALID }),
  },

  // File
  file: {
    tooLarge: (maxBytes?: number) =>
      new AppError({
        code: ErrorCode.FILE_TOO_LARGE,
        context: maxBytes ? { maxBytes } : undefined,
      }),
    typeUnsupported: (type?: string) =>
      new AppError({
        code: ErrorCode.FILE_TYPE_UNSUPPORTED,
        context: type ? { type } : undefined,
      }),
    uploadFailed: (cause?: unknown) =>
      new AppError({ code: ErrorCode.FILE_UPLOAD_FAILED, cause }),
    notFound: (filename?: string) =>
      new AppError({
        code: ErrorCode.FILE_NOT_FOUND,
        context: filename ? { filename } : undefined,
      }),
    storageQuotaExceeded: () =>
      new AppError({ code: ErrorCode.STORAGE_QUOTA_EXCEEDED }),
  },

  // External API
  externalApi: {
    error: (service: string, cause?: unknown) =>
      new AppError({
        code: ErrorCode.EXTERNAL_API_ERROR,
        cause,
        context: { service },
      }),
    timeout: (service: string) =>
      new AppError({
        code: ErrorCode.EXTERNAL_API_TIMEOUT,
        context: { service },
      }),
    rateLimited: (service: string, retryAfterMs?: number) =>
      new AppError({
        code: ErrorCode.EXTERNAL_API_RATE_LIMITED,
        context: { service, retryAfterMs },
      }),
  },
};

// ─── Catch & Wrap (normalize unknown errors) ──────────────────────────────────

export function wrapError(error: unknown, fallbackCode?: ErrorCode): AppError {
  if (isAppError(error)) return error;

  if (error instanceof Error) {
    // Drizzle ORM error patterns
    if (
      error.message.includes("duplicate key") ||
      error.message.includes("unique constraint")
    ) {
      return Errors.db.duplicate();
    }
    if (
      error.message.includes("foreign key") ||
      error.message.includes("violates")
    ) {
      return Errors.db.constraint(error);
    }
    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("connect ETIMEDOUT")
    ) {
      return Errors.db.connection(error);
    }

    // Timeout patterns
    if (error.message.includes("timeout") || error.name === "AbortError") {
      return new AppError({ code: ErrorCode.TIMEOUT, cause: error });
    }

    return new AppError({
      code: fallbackCode ?? ErrorCode.UNKNOWN,
      message: error.message,
      cause: error,
    });
  }

  return new AppError({
    code: fallbackCode ?? ErrorCode.UNKNOWN,
    cause: error,
  });
}

// ─── Next.js API Route Handler ────────────────────────────────────────────────

// import type { NextRequest } from "next/server";

// type RouteHandler = (req: NextRequest, ...args: unknown[]) => Promise<Response>;

// export function withErrorHandler(handler: RouteHandler): RouteHandler {
//   return async (req, ...args) => {
//     try {
//       return await handler(req, ...args);
//     } catch (error) {
//       const appError = wrapError(error);

//       // Log internally (swap for your logger: pino, winston, etc.)
//       console.error("[AppError]", appError.toLog());

//       return Response.json(appError.toResponse(), {
//         status: appError.httpStatus,
//       });
//     }
//   };
// }

// ─── Server Action Handler ────────────────────────────────────────────────────

// export type ActionResult<T> =
//   | { success: true; data: T }
//   | { success: false; error: ReturnType<AppError["toResponse"]>["error"] };

// export async function safeAction<T>(
//   fn: () => Promise<T>,
// ): Promise<ActionResult<T>> {
//   try {
//     const data = await fn();
//     return { success: true, data };
//   } catch (error) {
//     const appError = wrapError(error);
//     console.error("[SafeAction]", appError.toLog());
//     return { success: false, error: appError.toResponse().error };
//   }
// }

// ─── Client-side helpers ──────────────────────────────────────────────────────

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) return error.userMessage;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

export function isRetryableError(error: unknown): boolean {
  return isAppError(error) ? error.retryable : false;
}
