"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
// Auth dummy: disimpan di localStorage dan DIBAGI ke semua komponen (navbar, dashboard, login),
// jadi login/logout langsung terlihat di mana-mana dan sesi tetap ada saat pindah halaman / refresh.
// Ganti dengan API/NextAuth saat backend siap.
// User object: { name, email, roles:[], mentorStatus, sellerStatus, organizerStatus }
const KEY = "mentify_user";
const listeners = new Set();
let cache = { raw: undefined, val: null };

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== cache.raw) cache = { raw, val: raw ? JSON.parse(raw) : null };
  } catch { cache = { raw: null, val: null }; }
  return cache.val;
};
const notify = () => listeners.forEach((l) => l());
const subscribe = (cb) => {
  listeners.add(cb);
  const onStorage = (e) => { if (!e.key || e.key === KEY) cb(); }; // sinkron antar tab
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};
const save = (u) => {
  try { if (u) localStorage.setItem(KEY, JSON.stringify(u)); else localStorage.removeItem(KEY); } catch {}
  notify();
};

export function useUser() {
  const user = useSyncExternalStore(subscribe, read, () => null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const logout = useCallback(() => save(null), []);
  return { user, ready, login: save, logout };
}
