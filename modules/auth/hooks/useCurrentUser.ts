"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/src/lib/firebase";

export interface CurrentUser {

  uid: string;

  fullName: string;

  referralCode: string;

}

export function useCurrentUser() {

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {

          if (!firebaseUser) {

            setUser(null);

            return;

          }

          const snapshot =
            await getDoc(
              doc(
                db,
                "users",
                firebaseUser.uid
              )
            );

          if (!snapshot.exists()) {

            setUser(null);

            return;

          }

          setUser(
            snapshot.data() as CurrentUser
          );

        }
      );

    return unsubscribe;

  }, []);

  return user;

}