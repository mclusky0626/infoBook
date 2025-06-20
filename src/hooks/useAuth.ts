import { useEffect, useState } from "react";
import { auth } from "../firebase";
import type { User } from "firebase/auth";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);
  return user;
}
