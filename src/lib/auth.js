"use client";
import { useEffect, useState } from "react";
// Auth dummy: disimpan di localStorage. Ganti dengan API/NextAuth saat backend siap.
// User object: { name, email, plan:"free"|"premium", roles:[],
//   mentorStatus:"none"|"pending"|"verified",
//   sellerStatus:"none"|"pending"|"verified",
//   organizerStatus:"none"|"pending"|"verified" }
const KEY = "mentify_user";
export function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => { try { setUser(JSON.parse(localStorage.getItem(KEY))); } catch {} }, []);
  const save = (u) => { if (u) localStorage.setItem(KEY, JSON.stringify(u)); else localStorage.removeItem(KEY); setUser(u); };
  return { user, login: save, logout: () => save(null) };
}
