import {
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export interface NetworkUser {

  uid: string;

  referredByUid: string;

  networkActivated: boolean;

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