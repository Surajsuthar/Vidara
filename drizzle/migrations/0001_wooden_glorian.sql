CREATE TABLE "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'New Chat' NOT NULL,
	"total_credit_usages" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"media_id" text,
	"parent_id" text,
	"role" text NOT NULL,
	"prompt" text NOT NULL,
	"meta_data" jsonb DEFAULT '{}'::jsonb,
	"attachments" jsonb DEFAULT '{}'::jsonb,
	"media_type" varchar NOT NULL,
	"model_name" text NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"aspect_ratio" text DEFAULT '1:1',
	"image_quality" text,
	"resolution" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"prompt" text NOT NULL,
	"negative_prompt" text,
	"width" integer,
	"height" integer,
	"quality_tier" varchar DEFAULT 'standard',
	"batch_size" integer DEFAULT 1 NOT NULL,
	"is_priority" boolean DEFAULT false NOT NULL,
	"media_id" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"inngest_job_id" text,
	"error_message" text,
	"credits_charged" integer NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"media_type" varchar NOT NULL,
	"media_url" text NOT NULL,
	"mime_type" text,
	"aspect_ratio" text,
	"width" integer,
	"height" integer,
	"total_credit_usage" integer,
	"file_size_bytes" integer,
	"visibility" varchar DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"credit" integer DEFAULT 20 NOT NULL,
	"expire_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_metadata" ADD CONSTRAINT "chat_metadata_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_status_index" ON "chat_metadata" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_id_idx" ON "chat_metadata" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "chat_metadata_parentId_idx" ON "chat_metadata" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "generation_user_idx" ON "generation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generation_status_idx" ON "generation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "generation_created_idx" ON "generation" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_user_idx" ON "media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "media_type_idx" ON "media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "media_visibility_idx" ON "media" USING btree ("visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "user_credits_userId_idx" ON "user_credits" USING btree ("user_id");