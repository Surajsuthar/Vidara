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

let emailQueue: BaseQueue<EmailJobData, EmailJobName> | undefined;

function getEmailQueue() {
  emailQueue ??= new BaseQueue<EmailJobData, EmailJobName>("email");
  return emailQueue;
}

export function enqueueEmail(data: EmailJobData, options?: JobsOptions) {
  return getEmailQueue().add("send-email", data, options);
}

export function enqueueWelcomeEmail(
  data: Omit<EmailJobData, "subject"> & { subject?: string },
  options?: JobsOptions,
) {
  return getEmailQueue().add(
    "send-welcome-email",
    {
      ...data,
      subject: data.subject ?? "Welcome to Vidara",
    },
    options,
  );
}
