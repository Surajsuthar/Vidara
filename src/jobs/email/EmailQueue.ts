import type { JobsOptions } from "bullmq";
import type { Attachment } from "resend";
import { BaseQueue } from "../../../worker/queue/BaseQueue";

export type EmailJobName = "send-email" | "send-welcome-email";

export type EmailJobData = {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
};

export class EmailQueue extends BaseQueue<EmailJobData, EmailJobName> {
  private static instance: EmailQueue;

  private constructor() {
    super("email");
  }

  static getInstance(): EmailQueue {
    if (!EmailQueue.instance) {
      EmailQueue.instance = new EmailQueue();
    }

    return EmailQueue.instance;
  }

  async enqueueEmail(data: EmailJobData, options?: JobsOptions) {
    return this.add("send-email", data, options);
  }

  async enqueueWelcomeEmail(
    data: Omit<EmailJobData, "subject"> & { subject?: string },
    options?: JobsOptions,
  ) {
    return this.add(
      "send-welcome-email",
      {
        ...data,
        subject: data.subject ?? "Welcome to Vidara",
      },
      options,
    );
  }
}
