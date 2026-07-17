import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export interface NetworkData {

  fullName: string;

  referralCode: string;

  referredBy: string;

  directReferrals: number;

  secondLevelReferrals: number;

  totalNetwork: number;

}

class NetworkService {

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

  async addDirectReferral(
    uid: string
  ): Promise<void> {

    await updateDoc(
      doc(db, "users", uid),
      {
        directReferrals:
          increment(1),
      }
    );

  }

}

export const networkService =
  new NetworkService();