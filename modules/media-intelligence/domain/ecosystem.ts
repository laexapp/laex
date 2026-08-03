import type { TenantContext } from "./types";

export type EcosystemCapability = "creator-os" | "community" | "academy" | "analytics" | "projects" | "conversational-ai";

export interface EcosystemRequest<TPayload = unknown> {
  tenant: TenantContext;
  capability: EcosystemCapability;
  operation: string;
  payload: TPayload;
  traceId: string;
}

export interface EcosystemResult<TData = unknown> {
  status: "accepted" | "completed" | "unavailable" | "rejected";
  data?: TData;
  message?: string;
}

export interface MediaEcosystemBridge {
  readonly capability: EcosystemCapability;
  execute<TPayload, TData>(request: EcosystemRequest<TPayload>): Promise<EcosystemResult<TData>>;
}

export class UnavailableEcosystemBridge implements MediaEcosystemBridge {
  constructor(readonly capability: EcosystemCapability) {}
  async execute<TPayload, TData>(request: EcosystemRequest<TPayload>): Promise<EcosystemResult<TData>> {
    void request;
    return { status: "unavailable", message: "Integración preparada para una misión futura." };
  }
}
