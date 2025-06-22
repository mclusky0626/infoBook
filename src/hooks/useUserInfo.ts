import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

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
      if (snap.exists()) {
        const data = snap.data() as {
          email?: string;
          canAccess?: boolean;
          canaccess?: boolean;
          isAdmin?: boolean;
        };
        setInfo({
          email: data.email ?? "",
          canAccess: data.canAccess ?? data.canaccess ?? false,
          isAdmin: data.isAdmin ?? false,
        });
      } else {
        setInfo(null);
      }
    });
    return () => unsub();
  }, [uid]);

  return info;
}
