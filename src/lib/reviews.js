"use client";
import { useEffect, useState } from "react";
// Ulasan buatan pengguna (dummy, localStorage). Satu pesanan = satu ulasan.
const KEY = "mentify_reviews";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const write = (l) => { try { localStorage.setItem(KEY, JSON.stringify(l)); window.dispatchEvent(new Event("mentify-reviews")); } catch {} };

export function addReview({ orderId, type, targetId, rating, text }) {
  let name = "Pengguna";
  try { name = JSON.parse(localStorage.getItem("mentify_user"))?.name || name; } catch {}
  const r = { id: `${Date.now()}`, orderId, type, targetId: Number(targetId), by: name, stars: rating, text: text.trim() || "(tanpa komentar)",
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }), mine: true };
  write([r, ...read().filter((x) => x.orderId !== orderId)]);
  return r;
}

export function useReviews(type, targetId) {
  const [all, setAll] = useState([]);
  useEffect(() => {
    const sync = () => setAll(read());
    sync();
    window.addEventListener("mentify-reviews", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("mentify-reviews", sync); window.removeEventListener("storage", sync); };
  }, []);
  const mine = all.filter((r) => (type ? r.type === type && r.targetId === Number(targetId) : true));
  return { mine, all, byOrder: (id) => all.find((r) => r.orderId === id) };
}

// Gabungkan ulasan bawaan + ulasan pengguna → rating rata-rata & jumlah baru
export function mergeRating(baseRating, baseCount, extra) {
  const n = baseCount + extra.length;
  if (!n) return { rating: 0, count: 0 };
  const sum = baseRating * baseCount + extra.reduce((s, r) => s + r.stars, 0);
  return { rating: Math.round((sum / n) * 10) / 10, count: n };
}
