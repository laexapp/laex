import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export interface CreateUserProfileData {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  invitationCode?: string;
}

class UserService {
  async createProfile(
    data: CreateUserProfileData
  ): Promise<void> {

    await setDoc(
      doc(db, "users", data.uid),
      {
        uid: data.uid,

        fullName: data.fullName,

        username: data.username.toLowerCase(),

        email: data.email.toLowerCase(),

        invitationCode:
          data.invitationCode ?? "",

        emailVerified: false,

        role: "user",

        status: "active",

        photoURL: "",

        phoneNumber: "",

        biography: "",

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),

        lastLoginAt: serverTimestamp(),
      }
    );
  }

  async updateLastLogin(
    uid: string
  ): Promise<void> {

    await setDoc(
      doc(db, "users", uid),
      {
        lastLoginAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

  }

  async verifyEmail(
    uid: string
  ): Promise<void> {

    await setDoc(
      doc(db, "users", uid),
      {
        emailVerified: true,
      },
      {
        merge: true,
      }
    );

  }

  async deactivateUser(
    uid: string
  ): Promise<void> {

    await setDoc(
      doc(db, "users", uid),
      {
        status: "inactive",
      },
      {
        merge: true,
      }
    );

  }
}

export const userService =
  new UserService();