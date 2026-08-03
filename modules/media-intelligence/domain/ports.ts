import type { ChannelPlatform, TenantContext } from "./types";

export interface ConnectorCommand<TPayload = unknown> {
  tenant: TenantContext;
  idempotencyKey: string;
  platform: ChannelPlatform;
  payload: TPayload;
}

export interface ConnectorResult<TData = unknown> {
  externalReference?: string;
  status: "accepted" | "completed" | "retryable-error" | "terminal-error";
  data?: TData;
  errorCode?: string;
}

export interface MediaConnector<TPublishPayload = unknown, TAnalytics = unknown> {
  readonly platform: ChannelPlatform;
  readonly version: string;
  validate(command: ConnectorCommand<TPublishPayload>): Promise<ConnectorResult>;
  publish(command: ConnectorCommand<TPublishPayload>): Promise<ConnectorResult>;
  analytics(command: ConnectorCommand): Promise<ConnectorResult<TAnalytics>>;
}

export interface AIRequest<TInput = unknown> {
  tenant: TenantContext;
  capability: "transcribe" | "understand" | "generate" | "moderate" | "embed";
  input: TInput;
  policyVersion: string;
}

export interface AIProvider {
  readonly provider: string;
  readonly version: string;
  execute<TInput, TOutput>(request: AIRequest<TInput>): Promise<TOutput>;
}

export interface TaskEnvelope<TPayload = unknown> {
  id: string;
  tenantId: string;
  workspaceId: string;
  type: string;
  payload: TPayload;
  attempts: number;
  notBefore?: string;
  traceId: string;
}

export interface TaskQueue {
  enqueue<TPayload>(task: TaskEnvelope<TPayload>): Promise<void>;
}
