export interface UserSession {
  id: string;
  email: string;
  username: string;
  authenticated: boolean;
}

let currentSession: UserSession | null = null;

export function getSession(): UserSession | null {
  return currentSession;
}

export function setSession(
  session: UserSession
): void {
  currentSession = session;
}

export function clearSession(): void {
  currentSession = null;
}

export function isAuthenticated(): boolean {
  return currentSession?.authenticated === true;
}