"use client";
import { useEffect, useState } from "react";
import { mentors as M } from "@/data/mentors";
import { lomba as L } from "@/data/lomba";
import { products as P } from "@/data/products";

// Listing buatan pengguna (dummy, localStorage). Tampil di halaman Mentor / Info Lomba / Marketplace.
// SHOW_PENDING = true → tampil segera setelah pembayaran dengan lencana "Menunggu verifikasi".
// Ubah ke false bila ingin tampil HANYA setelah diverifikasi admin.
export const SHOW_PENDING = true;

const KEY = "mentify_listings";
const EMPTY = { mentors: [], lomba: [], products: [] };
const read = () => { try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch { return { ...EMPTY }; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); window.dispatchEvent(new Event("mentify-listings")); } catch {} };

export const nextListingId = (type) => Math.max(1000, ...read()[type].map((x) => x.id)) + 1;
export function addListing(type, obj) { const all = read(); all[type] = [obj, ...all[type]]; write(all); return obj; }
export function setListingStatus(type, test, status) {
  const all = read();
  all[type] = all[type].map((x) => (test(x) ? { ...x, status, ...(type === "mentors" && status === "verified" ? { docs: x.docs.map(([d]) => [d, "Terverifikasi"]) } : {}) } : x));
  write(all);
}
export const clearListings = () => write({ ...EMPTY });
export const ownListings = (type, email) => read()[type].filter((x) => x.owner === email);

export function useCatalog() {
  const [u, setU] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => { setU(read()); setReady(true); };
    sync();
    window.addEventListener("mentify-listings", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("mentify-listings", sync); window.removeEventListener("storage", sync); };
  }, []);
  const ok = (x) => SHOW_PENDING || x.status === "verified";
  return {
    ready,
    mentors: [...M, ...u.mentors.filter(ok)],
    lomba: [...L, ...u.lomba.filter(ok)],
    products: [...P, ...u.products.filter(ok)],
  };
}
