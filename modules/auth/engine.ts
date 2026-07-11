import { UserProfile } from "./types";

export class AuthEngine {
  async login(
    email: string,
    password: string
  ): Promise<UserProfile | null> {
    console.log("Login:", email, password);

    return null;
  }

  async register(
    user: UserProfile
  ): Promise<boolean> {
    console.log("Register:", user);

    return true;
  }

  async logout(): Promise<void> {
    console.log("Logout");
  }

  async currentUser(): Promise<UserProfile | null> {
    return null;
  }
}

export const authEngine = new AuthEngine();