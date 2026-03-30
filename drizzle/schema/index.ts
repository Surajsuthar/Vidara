import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const chat = pgTable(
  "chat",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull().default("New Chat"),
    totalCreditUsage: integer("total_credit_usages").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("user_id_idx").on(t.userId)],
);

export const chatMetadata = pgTable(
  "chat_metadata",
  {
    id: text("id").primaryKey().notNull(),
    chatId: text("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    mediaId: text("media_id").references(() => media.id),
    parentId: text("parent_id"),
    role: text("role").notNull(),
    prompt: text("prompt").notNull(),
    metaData: jsonb("meta_data").default(sql`'{}'::jsonb`),
    attachments: jsonb("attachments").default(sql`'{}'::jsonb`), // some reference images
    mediaType: varchar("media_type", { enum: ["image", "video"] }).notNull(),
    modelName: text("model_name").notNull(),
    status: varchar("status", {
      enum: ["pending", "processing", "completed", "failed"],
    })
      .default("pending")
      .notNull(),
    aspectRatio: text("aspect_ratio").default("1:1"),
    quality: text("image_quality"),
    resolution: text("resolution"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("chat_status_index").on(t.status),
    index("chat_id_idx").on(t.chatId),
    index("chat_metadata_parentId_idx").on(t.parentId),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "chat_metadata_parent_id_fkey",
    }),
  ],
);

export const media = pgTable(
  "media",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    mediaType: varchar("media_type", { enum: ["image", "video"] }).notNull(),
    url: text("media_url").notNull(), // always R2 URL, never provider URL
    mimeType: text("mime_type"), // "image/png" | "image/webp"
    aspectRatio: text("aspect_ratio"),
    seed: varchar("seed").notNull(),
    width: integer("width"),
    height: integer("height"),
    creditUsage: integer("total_credit_usage"),
    fileSizeBytes: integer("file_size_bytes"),
    visibility: varchar("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("private"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("media_user_idx").on(t.userId),
    index("media_type_idx").on(t.mediaType),
    index("media_visibility_idx").on(t.visibility),
  ],
);

export const generation = pgTable(
  "generation",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    // prompt info
    prompt: text("prompt").notNull(),
    negativePrompt: text("negative_prompt"),

    // generation settings
    width: integer("width"),
    height: integer("height"),
    qualityTier: varchar("quality_tier", {
      enum: ["fast", "low", "standard", "hd", "ultra"],
    }).default("standard"),
    batchSize: integer("batch_size").default(1).notNull(),
    isPriority: boolean("is_priority").default(false).notNull(),

    // output
    mediaId: text("media_id").references(() => media.id), // link to media table on complete

    // job tracking
    status: varchar("status", {
      enum: ["pending", "processing", "completed", "failed", "refunded"],
    })
      .default("pending")
      .notNull(),
    inngestJobId: text("inngest_job_id"),
    errorMessage: text("error_message"),
    creditsCharged: integer("credits_charged").notNull(), // snapshot at time of generation

    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("generation_user_idx").on(t.userId),
    index("generation_status_idx").on(t.status),
    index("generation_created_idx").on(t.createdAt),
  ],
);

export const userCredit = pgTable(
  "user_credits",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    credit: integer("credit").default(20).notNull(),
    expire: timestamp("expire_at").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [uniqueIndex("user_credits_userId_idx").on(t.userId)],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  media: many(media),
  generations: many(generation),
  chat: many(chat),
  userCredit: one(userCredit, {
    fields: [user.id],
    references: [userCredit.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  messages: many(chatMetadata),
}));

export const chatMetadataRelations = relations(
  chatMetadata,
  ({ one, many }) => ({
    chat: one(chat, { fields: [chatMetadata.chatId], references: [chat.id] }),
    media: one(media, {
      fields: [chatMetadata.mediaId],
      references: [media.id],
    }),
    parent: one(chatMetadata, {
      fields: [chatMetadata.parentId],
      references: [chatMetadata.id],
      relationName: "chatMetadata_parent",
    }),
    children: many(chatMetadata, {
      relationName: "chatMetadata_parent",
    }),
  }),
);

export const mediaRelations = relations(media, ({ one, many }) => ({
  user: one(user, { fields: [media.userId], references: [user.id] }),
  chatMetadata: many(chatMetadata),
  generations: many(generation),
}));

export const generationRelations = relations(generation, ({ one }) => ({
  user: one(user, { fields: [generation.userId], references: [user.id] }),
  media: one(media, { fields: [generation.mediaId], references: [media.id] }),
}));

export const userCreditRelations = relations(userCredit, ({ one }) => ({
  user: one(user, { fields: [userCredit.userId], references: [user.id] }),
}));

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
export type Media = InferSelectModel<typeof media>;
export type Generation = InferSelectModel<typeof generation>;
export type UserCredit = InferSelectModel<typeof userCredit>;
