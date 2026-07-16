import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import { LAEX_SYSTEM_UID } from "../constants/system";

import {
  normalizeReferralCode,
} from "../utils/referral";

class ReferralService {

  async findOwnerUid(
    referralCode: string
  ): Promise<string> {

    const code =
      normalizeReferralCode(
        referralCode
      );

    if (!code) {

      return LAEX_SYSTEM_UID;

    }

    const snapshot =
      await getDocs(

        query(

          collection(
            db,
            "users"
          ),

          where(
            "referralCode",
            "==",
            code
          ),

          limit(1)

        )

      );

    if (snapshot.empty) {

      return LAEX_SYSTEM_UID;

    }

    return snapshot.docs[0].id;

  }

}

export const referralService =
  new ReferralService();