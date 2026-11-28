"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { rupiah } from "@/lib/format";
import { KINDS } from "@/lib/orders";
import { Icon } from "@/components/Icon";

// Popup "Pembayaran Berhasil" (gaya kartu konfirmasi): badge, ringkasan, status, dan tombol lanjut.
export default function PayModal({ o, title, note, actions, onClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop?.();
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; window.__lenis?.start?.(); };
  }, [onClose]);
  if (!mounted) return null;

  const paid = o.total > 0;
  const kind = KINDS[o.kind]?.label || "Transaksi";
  const flow = KINDS[o.kind]?.flow || [];
  const when = new Date(o.ts).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  const rows = [
    ["No. invoice", o.no, "id"],
    ["Untuk", o.title],
    ...(o.meeting ? [["Jadwal", `${o.meeting.date} · ${o.meeting.time} (${o.meeting.platform})`]] : []),
    ["Pemesan", o.buyer?.name || "Pengguna"],
  ];
  const method = o.method || "—";

  return createPortal(
    <div className="pm-overlay" role="dialog" aria-modal="true" aria-labelledby="pm-title" onClick={onClose}>
      <div className="pm-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pm-x" onClick={onClose} aria-label="Tutup"><Icon name="x" size={18} /></button>
        <span className="pm-ring"><span className="pm-ok"><Icon name="check" size={34} /></span></span>
        <span className="pm-badge">{paid ? "PEMBAYARAN BERHASIL" : "AKSES DIBUKA"}</span>
        <h2 id="pm-title">{title || (paid ? "Pembayaran Berhasil!" : "Akses Dibuka!")}</h2>
        {note && <p className="pm-note">{note}</p>}

        <div className="pm-box">
          {rows.map(([k, v, id]) => (
            <div key={k} className="pm-row"><span>{k}</span><strong className={id ? "pm-id" : ""}>{v}</strong></div>
          ))}
          <div className="pm-row pm-total"><span>Total Pembayaran</span><strong>{rupiah(o.total)}</strong></div>
          <div className="pm-row"><span>Status Pembayaran</span><strong className="pm-st ok">{paid ? "Lunas" : "Gratis"}</strong></div>
          {flow[o.step || 0] && <div className="pm-row"><span>Status</span><strong className="pm-st wait">{flow[o.step || 0]}</strong></div>}
        </div>

        <div className="pm-info"><strong>Pembayaran {method.split(" – ")[0]}</strong><span>{method}. Bukti lengkap ada di invoice dan riwayat.</span></div>

        {o.kind === "produk" && actions && <div className="pm-extra">{actions}</div>}
        <div className="pm-btns">
          <Link className="btn pm-main" href="/dashboard?tab=riwayat">Lihat Riwayat</Link>
          <Link className="btn pm-alt" href="/">Kembali ke Beranda</Link>
        </div>
        <button type="button" className="pm-link" onClick={onClose}>Lihat bukti pembayaran lengkap</button>
      </div>
    </div>,
    document.body
  );
}
