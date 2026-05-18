import type { Attachment } from "resend";
import type { ImageGenOptions } from "../ai";

export type EmailJobName = "send-email" | "send-welcome-email";
export type GenerationJobName = "generate-image";

export type EmailJobData = {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
};

export type ImageGenerationJobData = {
  requestId: string;
  userId?: string;
  prompt: string;
  options: ImageGenOptions;
};
