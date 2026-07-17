import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import type {
  ReferralUser,
} from "../types/network";

export interface NetworkUser {

  uid: string;

  referredByUid: string;

  networkActivated: boolean;

}

export interface NetworkData {

  fullName: string;

  referralCode: string;

  referredBy: string;

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

}

class NetworkService {

  async activate(
    uid: string
  ): Promise<void> {

    const user =
      await this.getUser(uid);

    if (!user) {
      return;
    }

    if (user.networkActivated) {
      return;
    }

    if (!user.referredByUid) {
      return;
    }

    await this.updateLeader(
      user.referredByUid
    );

    await this.markActivated(uid);

  }

  async getUser(
    uid: string
  ): Promise<NetworkUser | null> {

    const snapshot =
      await getDoc(
        doc(db, "users", uid)
      );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as NetworkUser;

  }

  async getNetwork(
    uid: string
  ): Promise<NetworkData | null> {

    const snapshot =
      await getDoc(
        doc(db, "users", uid)
      );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as NetworkData;

  }

  async getDirectReferrals(
    uid: string
  ): Promise<ReferralUser[]> {

    const snapshot =
      await getDocs(

        query(

          collection(
            db,
            "users"
          ),

          where(
            "referredByUid",
            "==",
            uid
          )

        )

      );

    return snapshot.docs.map(
      (document) => {

        const data =
          document.data();

        return {

          uid:
            document.id,

          fullName:
            data.fullName,

          username:
            data.username,

          email:
            data.email,

          createdAt:
            data.createdAt ?? null,

        };

      }

    );

  }

  async updateLeader(
    leaderUid: string
  ): Promise<void> {

    await updateDoc(
      doc(db, "users", leaderUid),
      {

        directReferrals:
          increment(1),

        totalNetwork:
          increment(1),

      }
    );

  }

  async markActivated(
    uid: string
  ): Promise<void> {

    await updateDoc(
      doc(db, "users", uid),
      {

        networkActivated: true,

      }
    );

  }

}

export const networkService =
  new NetworkService();