import type { BusinessStateStore } from "../../application/BusinessEngine";
import type { BusinessState } from "../../domain/types";

const emptyState = (): BusinessState => ({ companies: [], customers: [], products: [], inventoryMovements: [], audit: [], idempotency: {} });

export class MemoryBusinessStateStore implements BusinessStateStore {
  private state: BusinessState;
  private queue: Promise<void> = Promise.resolve();
  constructor(seed?: Partial<BusinessState>) { this.state = structuredClone({ ...emptyState(), ...seed }); }
  async transact<T>(operation: (draft: BusinessState) => T | Promise<T>): Promise<T> {
    const previous = this.queue; let release!: () => void; this.queue = new Promise<void>((resolve) => { release = resolve; }); await previous;
    try { const draft = structuredClone(this.state); const result = await operation(draft); this.state = draft; return structuredClone(result); } finally { release(); }
  }
  async snapshot() { return structuredClone(this.state); }
}
