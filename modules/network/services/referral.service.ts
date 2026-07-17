import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export interface ReferralUser {

  uid: string;

  fullName: string;

  username: string;

  referralCode: string;

  createdAt: unknown;

}

class ReferralService {

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
      (document) =>
        document.data() as ReferralUser
    );

  }

}

export const referralService =
  new ReferralService();