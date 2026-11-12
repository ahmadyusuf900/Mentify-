"use client";
import { useEffect, useState } from "react";
// Riwayat aktivitas + invoice (dummy, localStorage). Saat backend siap, ganti isi fungsi ini dengan panggilan API.
import { setListingStatus } from "@/lib/listings";
const KEY = "mentify_orders";

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); window.dispatchEvent(new Event("mentify-orders")); } catch {} };
const me = () => { try { return JSON.parse(localStorage.getItem("mentify_user")) || {}; } catch { return {}; } };

// kind → ikon, label, dan alur status (urut). step = indeks status saat ini.
export const KINDS = {
  booking:   { icon: "🎓", label: "Booking mentor",   flow: ["Menunggu konfirmasi mentor", "Dikonfirmasi", "Sesi selesai"] },
  produk:    { icon: "📚", label: "Beli produk",      flow: ["Lunas, siap diunduh"] },
  kuota:     { icon: "⭐", label: "Klaim kuota premium", flow: ["Akses dibuka"] },
  mentor:    { icon: "🧑‍🏫", label: "Pendaftaran mentor", flow: ["Dibayar · menunggu verifikasi", "Terverifikasi"] },
  seller:    { icon: "🛒", label: "Aktivasi toko",     flow: ["Dibayar · menunggu verifikasi", "Terverifikasi"] },
  organizer: { icon: "🏆", label: "Daftar penyelenggara", flow: ["Menunggu verifikasi", "Terverifikasi"] },
  lomba:     { icon: "📣", label: "Info lomba",        flow: ["Dibayar · menunggu review", "Tayang"] },
  katalog:   { icon: "🧩", label: "Produk katalog",    flow: ["Menunggu review", "Tayang"] },
};

export const nextInvoiceNo = () => {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `INV/MTF/${day}/${String(read().length + 1).padStart(4, "0")}`;
};

export function addOrder({ kind, title, detail = "", items = [], method = "", ref = "", step = 0, target = null, listing = null }) {
  const list = read();
  const ts = new Date();
  const total = items.reduce((s, i) => s + i.amount, 0);
  const id = `${ts.getTime()}${Math.floor(Math.random() * 90 + 10)}`;
  const o = {
    id, kind, title, detail, items, total, method, ref, step, target, listing,
    no: nextInvoiceNo(),
    ts: ts.toISOString(),
    buyer: { name: me().name || "Pengguna", email: me().email || "-" },
  };
  write([o, ...list]);
  return o;
}

const bump = (o) => {
  const step = Math.min(o.step + 1, KINDS[o.kind].flow.length - 1);
  // Langkah terakhir (verifikasi/tayang) membuat listing buatan pengguna berstatus "verified"
  if (o.listing && step === KINDS[o.kind].flow.length - 1) setListingStatus(o.listing.type, (x) => x.id === o.listing.id, "verified");
  return { ...o, step };
};
export const advanceOrder = (id) => write(read().map((o) => (o.id === id ? bump(o) : o)));
// Dipakai tombol "simulasikan disetujui admin": majukan order terbaru dengan jenis tertentu
export const advanceLatest = (kind) => {
  const list = read();
  const i = list.findIndex((o) => o.kind === kind);
  if (i >= 0) { list[i] = bump(list[i]); write(list); }
};
export const clearOrders = () => write([]);
export const findOrder = (id) => read().find((o) => o.id === id);

export function useOrders() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const sync = () => setList(read());
    sync();
    window.addEventListener("mentify-orders", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("mentify-orders", sync); window.removeEventListener("storage", sync); };
  }, []);
  return list;
}
