import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Streams permission information for the authenticated user.

export interface UserInfo {
  email: string;
  canAccess: boolean;
  isAdmin: boolean;
}

export function useUserInfo(uid?: string | null) {
  const [info, setInfo] = useState<UserInfo | null | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setInfo(null);
      return;
    }
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(ref, snap => {
      setInfo(snap.exists() ? (snap.data() as UserInfo) : null);
    });
    return () => unsub();
  }, [uid]);

  return info;
}
