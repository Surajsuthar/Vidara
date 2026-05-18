import type { EmailJobData } from "../types";
import { BaseQueue } from "./BaseQueue";

export const emailQueue = new BaseQueue<EmailJobData, "send-welcome-email">(
  "email",
);

export async function enqueueWelcomeQueue(emailJobData: EmailJobData) {
  await emailQueue.add("send-welcome-email", emailJobData, {
    jobId: `email: ${emailJobData.to}`,
  });
}
