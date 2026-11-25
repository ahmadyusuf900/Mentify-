"use client";
import Link from "next/link";
import { useState } from "react";
import { rupiah } from "@/lib/format";
import { KINDS } from "@/lib/orders";
import { COMMISSION } from "@/data/mentors";
import { Icon } from "@/components/Icon";

// Struk "Pembayaran Diterima" — layar hasil setelah bayar (gaya struk e-wallet, disesuaikan untuk Mentify).
export default function Receipt({ o, children, compact = false }) {
  const [shared, setShared] = useState(false);
  const paid = o.total > 0;
  const comm = ["booking", "produk"].includes(o.kind) && paid ? Math.round(o.total * COMMISSION) : 0;
  const date = new Date(o.ts).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  const rows = [
    ["Dari", o.buyer?.name || "Pengguna", "user"],
    ["Ke", o.to || "Mentify", "store"],
    ["Jenis transaksi", KINDS[o.kind]?.label || "Transaksi"],
    ["Metode bayar", o.method || "—"],
    ["Waktu", date],
    ["No. invoice", o.no],
  ];
  const share = async () => {
    const text = `Bukti pembayaran Mentify ${o.no} · ${o.title} · ${rupiah(o.total)}`;
    try { if (navigator.share) await navigator.share({ text }); else await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 1800); } catch {}
  };
  return (
    <div className={`rcp ${compact ? "compact" : ""}`}>
      <div className="rcp-top">
        <span className="rcp-ok"><Icon name="check" size={30} /></span>
        <p>{paid ? "Pembayaran Diterima" : "Akses Dibuka"}</p>
        <strong className="rcp-amt"><small>Rp</small> {o.total.toLocaleString("id-ID")}</strong>
        <span className="rcp-title">{o.title}</span>
      </div>

      <div className="rcp-card">
        {rows.map(([k, v, ic]) => (
          <div key={k} className="rcp-row"><span>{k}</span><strong>{ic && <i className="rcp-dot"><Icon name={ic} size={13} /></i>}{v}</strong></div>
        ))}

        {o.meeting && (
          <div className="rcp-meet">
            <span className="rcp-meet-h"><Icon name="calendar" /> Jadwal sesi online</span>
            <strong>{o.meeting.date} · {o.meeting.time}</strong>
            <span>via {o.meeting.platform}</span>
            <a className="btn" href={o.meeting.link} target="_blank" rel="noopener noreferrer">Buka ruang {o.meeting.platform}</a>
            <small className="muted">Link aktif setelah mentor mengonfirmasi. Contoh link demo.</small>
          </div>
        )}

        <div className="rcp-sep" />
        {o.items.map((i) => (
          <div key={i.label} className="rcp-row"><span>{i.label}</span><strong>{i.amount < 0 ? `− ${rupiah(-i.amount)}` : rupiah(i.amount)}</strong></div>
        ))}
        <div className="rcp-row"><span>Biaya transaksi</span><strong className="rcp-free">GRATIS</strong></div>
        {comm > 0 && <div className="rcp-row sub"><span>Komisi Mentify {COMMISSION * 100}% (dipotong dari pihak penjual)</span><span>{rupiah(comm)}</span></div>}
        <div className="rcp-row total"><span>Jumlah total</span><strong>{rupiah(o.total)}</strong></div>
      </div>

      <div className="rcp-act">
        <button className="btn secondary" onClick={share}>{shared ? "Tersalin ✓" : "Bagikan"}</button>
        <Link className="btn" href={`/invoice?id=${o.id}`}>Lihat invoice</Link>
      </div>
      {children}
    </div>
  );
}
