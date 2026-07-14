export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  invitationCode: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
  session?: AuthSession;
}