import {
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

class NetworkService {

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