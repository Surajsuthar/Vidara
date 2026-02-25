// src/lib/queue/WorkerManager.ts
import { EmailWorker } from "@/jobs/email/EmailWorker";
// import { ReportWorker } from "@/jobs/report/ReportWorker";

export class WorkerManager {
  private workers: { close(): Promise<void> }[] = [];

  start(): void {
    console.log("[WorkerManager] Starting all workers...");

    this.workers.push(EmailWorker.getInstance());

    console.log(`[WorkerManager] ${this.workers.length} workers running`);
  }

  async shutdown(): Promise<void> {
    console.log("[WorkerManager] Shutting down workers gracefully...");
    await Promise.all(this.workers.map((w) => w.close()));
    console.log("[WorkerManager] All workers closed");
  }
}
