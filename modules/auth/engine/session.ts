import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase";

export class SessionEngine {

  getCurrentUser(): User | null {

    return auth.currentUser;

  }

  onChange(
    callback: (user: User | null) => void
  ) {

    return onAuthStateChanged(
      auth,
      callback
    );

  }

  isAuthenticated(): boolean {

    return auth.currentUser !== null;

  }

}

export const sessionEngine =
  new SessionEngine();