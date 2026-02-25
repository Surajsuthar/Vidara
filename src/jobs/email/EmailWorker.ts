// src/jobs/email/EmailWorker.ts
import type { Job } from "bullmq";
import type { Attachment } from "resend";
import { Resend } from "resend";
import { env } from "@/utils/env";
import { BaseWorker } from "../../../worker/queue/BaseWorker";

export type EmailJobData = {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
};

export type EmailJobResult = {
  messageId: string;
  sentAt: string;
};

export class EmailWorker extends BaseWorker<EmailJobData, EmailJobResult> {
  private static instance: EmailWorker;
  private readonly resend: Resend;
  private static readonly UNRECOVERABLE_ERRORS = [
    "invalid_to",
    "invalid_from",
    "validation_error",
    "missing_required_field",
  ];

  private constructor() {
    super("email", {
      concurrency: 10,
    });

    const apiKey = env.RESEND_API_KEY;
    this.resend = new Resend(apiKey);
  }

  static getInstance(): EmailWorker {
    if (!EmailWorker.instance) {
      EmailWorker.instance = new EmailWorker();
    }
    return EmailWorker.instance;
  }

  protected async process(job: Job<EmailJobData>): Promise<EmailJobResult> {
    const { from, to, subject, html, text, attachments } = job.data;

    const sender = from ?? env.RESEND_FROM_EMAIL;

    console.log(
      `[EmailWorker] Job ${job.id} | Sending email to ${to} | subject: "${subject}"`,
    );

    await job.updateProgress(10);

    const { data, error } = await this.resend.emails.send({
      from: sender,
      to,
      subject,
      html: html ?? (text ? `<pre>${text}</pre>` : "<p>No content</p>"),
      text,
      attachments,
    });

    await job.updateProgress(80);

    if (error) {
      const isUnrecoverable = EmailWorker.UNRECOVERABLE_ERRORS.some((e) =>
        error.name?.toLowerCase().includes(e),
      );

      if (isUnrecoverable) {
        this.failPermanently(`Unrecoverable Resend error: ${error.message}`);
      }

      // Recoverable — BullMQ will retry based on backoff config
      throw new Error(`Resend error [${error.name}]: ${error.message}`);
    }

    if (!data?.id) {
      throw new Error("Resend returned no message ID — treating as failure");
    }

    await job.updateProgress(100);

    const result: EmailJobResult = {
      messageId: data.id,
      sentAt: new Date().toISOString(),
    };

    console.log(
      `[EmailWorker] Job ${job.id} | Email sent | messageId: ${data.id} | to: ${to}`,
    );

    return result;
  }

  protected onFailed(job: Job<EmailJobData> | undefined, err: Error): void {
    // Hook for Sentry, Slack alerts, DB logging, etc.
    super.onFailed(job, err);
    console.error(
      `[EmailWorker] Job ${job?.id} permanently failed | to: ${job?.data.to} | error: ${err.message}`,
    );
  }
}
