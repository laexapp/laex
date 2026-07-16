import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import {
  generateReferralCode,
  normalizeReferralCode,
} from "../utils/referral";

export interface CreateUserProfileData {

  uid: string;

  fullName: string;

  username: string;

  email: string;

  referralCode?: string;

  referredByUid: string;

}

class UserService {

  async createProfile(
    data: CreateUserProfileData
  ): Promise<void> {

    const userReferralCode =
      generateReferralCode();

    await setDoc(
      doc(db, "users", data.uid),
      {

        uid: data.uid,

        fullName:
          data.fullName,

        username:
          data.username.toLowerCase(),

        email:
          data.email.toLowerCase(),

        referralCode:
          userReferralCode,

        referredBy:
          normalizeReferralCode(
            data.referralCode ?? ""
          ),

        referredByUid:
          data.referredByUid,

        directReferrals: 0,

        secondLevelReferrals: 0,

        totalNetwork: 0,

        emailVerified: false,
        
        networkActivated: false,

        role: "user",

        status: "active",

        photoURL: "",

        phoneNumber: "",

        biography: "",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        lastLoginAt:
          serverTimestamp(),

      }
    );

  }

  async updateLastLogin(
    uid: string
  ): Promise<void> {

    await setDoc(
      doc(db, "users", uid),
      {
        lastLoginAt:
          serverTimestamp(),
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