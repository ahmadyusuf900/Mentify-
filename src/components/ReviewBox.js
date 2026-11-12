"use client";
import { useState } from "react";
import { addReview, useReviews } from "@/lib/reviews";

// Form ulasan: bintang 1–5 + komentar. Dipakai di Riwayat dan layar sukses pembelian produk.
export default function ReviewBox({ order }) {
  const { byOrder } = useReviews();
  const done = byOrder(order.id);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  if (!order.target) return null;

  if (done) {
    return (
      <div className="rvbox done">
        <span aria-label={`${done.stars} bintang`}>{"⭐".repeat(done.stars)}</span>
        <p className="muted">“{done.text}” — ulasanmu sudah tampil di halaman {order.target.type === "mentor" ? "mentor" : "produk"}. Terima kasih!</p>
      </div>
    );
  }
  if (!open) return <button className="btn secondary hist-btn" onClick={() => setOpen(true)}>⭐ Beri ulasan</button>;
  return (
    <form className="rvbox" onSubmit={(e) => { e.preventDefault(); addReview({ orderId: order.id, type: order.target.type, targetId: order.target.id, rating, text }); setOpen(false); }}>
      <strong>Ulasan untuk {order.target.name}</strong>
      <div className="stars" role="radiogroup" aria-label="Beri bintang">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} bintang`} className={n <= rating ? "on" : ""} onClick={() => setRating(n)}>★</button>
        ))}
      </div>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ceritakan pengalamanmu (opsional)…" maxLength={400} />
      <div className="row" style={{ gap: 8 }}>
        <button className="btn hist-btn" type="submit">Kirim ulasan</button>
        <button className="btn secondary hist-btn" type="button" onClick={() => setOpen(false)}>Batal</button>
      </div>
    </form>
  );
}
