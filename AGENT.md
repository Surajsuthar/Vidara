# Vidara Agent Context

This file is a quick orientation guide for the Vidara codebase. It focuses on project structure, runtime flow, major code areas, and the type of code used in each part.

## What This Project Is

Vidara is a Next.js image generation web app. Users authenticate, choose an image model, submit generation prompts, and receive generated images after background processing. The app uses a web/API process for the UI and request intake, plus a separate BullMQ worker process for long-running generation and email jobs.

## Stack

- Framework: Next.js 16 App Router with React 19 and TypeScript.
- Styling/UI: Tailwind CSS 4, shadcn-style local UI components, Radix primitives, lucide-react icons, Sonner toasts.
- Auth: Better Auth with social providers for Twitter/X, Google, and GitHub.
- Database: PostgreSQL via Drizzle ORM.
- Queue/Workers: BullMQ over Redis with a standalone worker entrypoint.
- Image generation: Provider adapter layer under `ai/` for OpenAI, xAI, Google/Vertex, Fal, Replicate, DeepInfra, and Amazon Bedrock.
- Storage: Cloudflare R2 using AWS S3-compatible SDK.
- Email: Resend, queued through BullMQ.
- Tooling: Biome for lint/format, TypeScript strict mode, Drizzle Kit migrations.

## Important Commands

```bash
npm run dev          # Start the Next.js web app
npm run worker:dev   # Start BullMQ workers
npm run build        # Build the Next.js app
npm run lint         # Run Biome checks
npm run format       # Format with Biome
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply Drizzle migrations
```

Local development generally needs both `npm run dev` and `npm run worker:dev` when testing generation or email queues.

## Top-Level Structure

```text
ai/                  Provider-neutral image generation types, model registry, and provider adapters
drizzle/             Database schema and migrations
public/              Static public assets
src/app/             Next.js App Router pages, layouts, and API routes
src/components/      Shared React components and UI primitives
src/context/         React context providers
src/hooks/           Client-side React Query and utility hooks
src/jobs/            Queue definitions and job-specific worker implementations
src/lib/             Auth, DB, R2, app utilities, errors, and shared server helpers
src/utils/           Environment validation, constants, credit helpers
worker/              Standalone worker process and reusable BullMQ base classes
```

## App Routes

The application uses App Router route groups:

- `src/app/page.tsx`: public landing/home page. Redirects signed-in users to `/explore`.
- `src/app/(app)/`: public informational pages such as pricing, about, terms, and privacy policy.
- `src/app/(auth)/auth/page.tsx`: authentication UI.
- `src/app/(dashboard)/layout.tsx`: authenticated dashboard shell with sidebar, header, and generation context.
- `src/app/(dashboard)/explore/page.tsx`: gallery/explore view.
- `src/app/(dashboard)/generate/page.tsx`: generation UI, currently built around `ChatInterface`.
- `src/app/(dashboard)/library/page.tsx`: user library page.
- `src/app/(dashboard)/settings/page.tsx`: user settings page.
- `src/app/api/auth/[...all]/route.ts`: Better Auth route handler.
- `src/app/api/generate/route.ts`: generation request and status API.

## Main Generation Flow

1. The user enters a prompt in `src/components/chat-interface.tsx`.
2. The component builds an `ImageGenOptions` payload from the selected model and model-specific config.
3. `POST /api/generate` in `src/app/api/generate/route.ts` validates auth, rate limits, validates the payload with Zod, creates a generation record, writes a queued status, and enqueues a BullMQ job.
4. `GenerationQueue` enqueues a `generate-image` job on the `generation` queue.
5. `worker/index.ts` starts `GenerationWorker` and `EmailWorker`.
6. `GenerationWorker` marks the job as processing, calls `generate()` from `ai/generator.ts`, persists generated images to R2 and Postgres, then updates Redis job status.
7. The client polls `GET /api/generate?requestId=...` until the job is completed or failed.
8. Completed results are displayed in `ChatInterface`.

## AI Layer

The `ai/` folder is provider-neutral at the top level:

- `ai/types.ts`: shared generation types, model names, aspect ratios, quality tiers, and result shapes.
- `ai/image-models.ts`: `MODEL_REGISTRY`, which describes image model capabilities such as provider, supported sizes, aspect ratios, quality, seeds, and batch limits.
- `ai/video-models.ts`: `VIDEO_MODEL_REGISTRY`, which describes video model capabilities such as provider, text-to-video/image-to-video support, aspect ratios, resolutions, durations, fps, audio, and motion controls.
- `ai/factory.ts`: compatibility exports for image and video model registries and metadata lookup helpers.
- `ai/generator.ts`: validates options against model metadata and dispatches to the correct provider adapter.
- `ai/providers/*.ts`: provider-specific generation implementations.

To add a new model, update the model union in `ai/types.ts`, add image metadata in `ai/image-models.ts` or video metadata in `ai/video-models.ts`, and make sure `ai/generator.ts` can route it to a provider adapter.

## Data Model

The database schema lives in `drizzle/schema/index.ts`.

Core tables:

- `user`, `session`, `account`, `verification`: Better Auth tables.
- `chat`: a user-owned chat/thread container.
- `chat_metadata`: prompt/message metadata with optional media links and parent/child relationships.
- `media`: generated or stored media records. URLs should point to R2, not expiring provider URLs.
- `generation`: generation job records, lifecycle status, selected settings, credit snapshot, and media linkage.
- `user_credits`: per-user credit balance and expiration.

Migrations live in `drizzle/migrations/`.

## Queue And Worker Layer

Reusable queue primitives live in `worker/queue/`:

- `RedisConnection.ts`: shared Redis connection for BullMQ and generation status storage.
- `BaseQueue.ts`: typed BullMQ queue wrapper with common defaults.
- `BaseWorker.ts`: typed BullMQ worker wrapper with common lifecycle logging and permanent-failure support.

Job-specific code lives in `src/jobs/`:

- `src/jobs/generation/GenerationQueue.ts`: enqueues image generation jobs.
- `src/jobs/generation/GenerationWorker.ts`: runs model generation, persistence, and status updates.
- `src/jobs/generation/status-store.ts`: stores short-lived generation status in Redis.
- `src/jobs/generation/persistence.ts`: creates generation records, uploads output to R2, and writes media records.
- `src/jobs/email/EmailQueue.ts`: enqueues email jobs.
- `src/jobs/email/EmailWorker.ts`: sends email through Resend.

## Storage Layer

R2 helpers live in `src/lib/r2/`.

- `client.ts`: S3-compatible R2 client and bucket configuration.
- `keys.ts`: object key and public URL generation.
- `upload.ts`: upload helpers for base64, `Uint8Array`, provider URLs, and multipart streams.
- `presign.ts`: presigned URL helpers.
- `delete.ts`: delete helpers.
- `types.ts`: R2 upload option/result types.

Generated images are uploaded to R2 and then stored in the `media` table. The code intentionally avoids storing provider-hosted URLs because they may expire.

## Auth And Server Utilities

- `src/lib/auth.ts`: Better Auth configuration, providers, Drizzle adapter, and signup email hook.
- `src/lib/auth-client.ts`: client-side auth helper.
- `src/lib/auth-service.ts`: server helper for reading the current user.
- `src/lib/db.ts`: Drizzle/Postgres connection.
- `src/lib/error.ts`: app error helpers and response shaping.
- `src/lib/utils.ts`: shared utilities including rate limiting/client info.
- `src/utils/env.ts`: validated environment variables using `@t3-oss/env-core`.

## Frontend Components

- `src/components/chat-interface.tsx`: main prompt input, model selection, image config, generation request, polling, and result display.
- `src/components/model-config.tsx`: model-specific generation controls.
- `src/components/model-tab.tsx`: model selector UI.
- `src/components/masonry-layout.tsx`: gallery-style visual layout.
- `src/components/sidebar/`: dashboard sidebar/header/navigation.
- `src/components/ui/`: local shadcn-style UI primitives.
- `src/components/providers/` and `src/components/sidebar/provider.tsx`: root/dashboard providers.

Most frontend code is client-side React with Tailwind utility classes.

## Environment Dependencies

Required environment variables are validated in `src/utils/env.ts`. The project expects values for:

- Postgres: `DATABASE_URL`
- Auth: `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, social provider credentials
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- AI providers: OpenAI, xAI, Google/Vertex, Fal, Replicate, DeepInfra, AWS/Bedrock
- R2: Cloudflare account, access keys, bucket names, public URL

`.env.example` exists, but `src/utils/env.ts` is the source of truth for what the app validates at runtime.

## Common Change Locations

- Add or modify image models: `ai/types.ts`, `ai/factory.ts`, `ai/providers/*`, `ai/generator.ts`.
- Change generation API behavior: `src/app/api/generate/route.ts`.
- Change background generation processing: `src/jobs/generation/GenerationWorker.ts` and `src/jobs/generation/persistence.ts`.
- Change generation UI: `src/components/chat-interface.tsx`, `src/components/model-config.tsx`, `src/components/model-tab.tsx`.
- Change schema: `drizzle/schema/index.ts`, then generate a migration.
- Change auth behavior: `src/lib/auth.ts`, `src/lib/auth-service.ts`, `src/app/api/auth/[...all]/route.ts`.
- Change dashboard navigation/shell: `src/app/(dashboard)/layout.tsx` and `src/components/sidebar/`.
- Change storage behavior: `src/lib/r2/`.
- Change worker registration: `worker/index.ts`.

## Code Style Notes

- TypeScript is strict and uses path aliases like `@/*` for `src/*` and `@/ai/*` for `ai/*`.
- Formatting and linting are handled by Biome.
- Server-only integrations are kept in `src/lib/`, `src/jobs/`, `worker/`, and `ai/providers/`.
- Client components use `"use client"` and live mostly under `src/components/` and selected app pages.
- Long-running work should go through BullMQ workers instead of blocking API routes.
- Generated media should be persisted to R2 and referenced by database records.

## Current Architecture In One Sentence

Vidara is a typed Next.js app where the browser queues generation requests through an authenticated API, BullMQ workers execute provider-specific image generation, outputs are persisted to R2 and Postgres, and the dashboard polls Redis-backed status until results are ready.
