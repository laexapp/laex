import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export interface LeaderData {

  uid: string;

  fullName: string;

  username: string;

  referralCode: string;

  photoURL: string;

}

class LeaderService {

  async getLeader(
    uid: string
  ): Promise<LeaderData | null> {

    if (!uid) {

      return null;

    }

    const snapshot =
      await getDoc(
        doc(db, "users", uid)
      );

    if (!snapshot.exists()) {

      return null;

    }

    return snapshot.data() as LeaderData;

  }

}

export const leaderService =
  new LeaderService();