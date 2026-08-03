export class MediaIntelligenceError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: number) {
    super(message);
    this.name = "MediaIntelligenceError";
  }
}

export class AuthenticationRequiredError extends MediaIntelligenceError {
  constructor() { super("authentication_required", "Se requiere una sesión autenticada.", 401); }
}

export class WorkspaceAccessDeniedError extends MediaIntelligenceError {
  constructor() { super("workspace_access_denied", "No tienes acceso a este workspace.", 403); }
}

export class CapabilityDeniedError extends MediaIntelligenceError {
  constructor(capability: string) { super("capability_denied", `Falta la capacidad ${capability}.`, 403); }
}

export class ResourceNotFoundError extends MediaIntelligenceError {
  constructor(resource: string) { super("resource_not_found", `${resource} no existe en el workspace autorizado.`, 404); }
}

export class WorkspaceInvariantError extends MediaIntelligenceError {
  constructor(code: string, message: string) { super(code, message, 409); }
}
