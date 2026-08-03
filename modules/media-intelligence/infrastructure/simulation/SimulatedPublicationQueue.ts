export interface SimulatedJob { id: string; idempotencyKey: string; workspaceId: string; resourceId: string; status: "queued" | "success" | "partial" | "failed" | "cancelled"; attempts: number; }
export class SimulatedPublicationQueue {
  private readonly jobs = new Map<string, SimulatedJob>();
  enqueue(input: Omit<SimulatedJob, "id" | "status" | "attempts">) { const prior = this.jobs.get(input.idempotencyKey); if (prior) return structuredClone(prior); const job: SimulatedJob = { ...input, id: `job_${this.jobs.size + 1}`, status: "queued", attempts: 0 }; this.jobs.set(input.idempotencyKey, job); return structuredClone(job); }
  execute(key: string, scenario: "success" | "partial" | "failed" = "success") { const job = this.jobs.get(key); if (!job) throw new Error("job_not_found"); if (job.status === "success") return structuredClone(job); job.attempts += 1; job.status = scenario; return structuredClone(job); }
  cancel(key: string) { const job = this.jobs.get(key); if (!job) throw new Error("job_not_found"); if (job.status === "success") throw new Error("completed_job_cannot_cancel"); job.status = "cancelled"; return structuredClone(job); }
}

