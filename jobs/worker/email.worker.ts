import type { Job } from "bullmq";
import { Resend } from "resend";
import { env } from "@/utils/env";
import type { EmailJobData, EmailJobName } from "../types";
import { BaseWorker } from "./BaseWorker";

export type EmailJobResult = {
  messageId: string;
  sentAt: string;
};

export class EmailWorker extends BaseWorker<
  EmailJobData,
  EmailJobResult,
  EmailJobName
> {
  private static instance: EmailWorker;

  private static readonly unrecoverableErrors = [
    "invalid_to",
    "invalid_from",
    "validation_error",
    "missing_required_field",
  ];

  private readonly resend: Resend;

  private constructor() {
    super("email", {
      concurrency: 10,
    });

    this.resend = new Resend(env.RESEND_API_KEY);
  }

  static getInstance(): EmailWorker {
    EmailWorker.instance ??= new EmailWorker();
    return EmailWorker.instance;
  }

  protected async process(
    job: Job<EmailJobData, EmailJobResult, EmailJobName>,
  ): Promise<EmailJobResult> {
    const { from, to, subject, html, text, attachments } = job.data;
    const sender = from ?? env.RESEND_FROM_EMAIL;

    console.log(
      `[EmailWorker] Job ${job.id} sending email | to: ${to} | subject: "${subject}"`,
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
      const errorName = error.name?.toLowerCase() ?? "";
      const isUnrecoverable = EmailWorker.unrecoverableErrors.some((name) =>
        errorName.includes(name),
      );

      if (isUnrecoverable) {
        this.failPermanently(`Unrecoverable Resend error: ${error.message}`);
      }

      throw new Error(`Resend error [${error.name}]: ${error.message}`);
    }

    if (!data?.id) {
      throw new Error("Resend returned no message ID.");
    }

    await job.updateProgress(100);

    console.log(
      `[EmailWorker] Job ${job.id} sent email | messageId: ${data.id} | to: ${to}`,
    );

    return {
      messageId: data.id,
      sentAt: new Date().toISOString(),
    };
  }

  protected onFailed(
    job: Job<EmailJobData, EmailJobResult, EmailJobName> | undefined,
    err: Error,
  ): void {
    super.onFailed(job, err);
    console.error(
      `[EmailWorker] Job ${job?.id ?? "unknown"} failed | to: ${job?.data.to ?? "unknown"} | error: ${err.message}`,
    );
  }
}
