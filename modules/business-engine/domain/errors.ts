export class AccessDeniedError extends Error {
  constructor() { super("Resource not found or access denied"); }
}
export class CapabilityDeniedError extends Error {
  constructor(capability: string) { super(`Missing capability: ${capability}`); }
}
export class BusinessInvariantError extends Error {}
