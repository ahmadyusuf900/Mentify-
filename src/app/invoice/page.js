"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { findOrder, KINDS } from "@/lib/orders";
import { rupiah } from "@/lib/format";
import Logo from "@/components/Logo";

export default function Invoice() {
  const [o, setO] = useState(undefined);
  useEffect(() => { setO(findOrder(new URLSearchParams(location.search).get("id")) || null); }, []);

  if (o === undefined) return <div className="container section"><p className="muted">Memuat invoice…</p></div>;
  if (o === null) return (
    <div className="container section">
      <h1>Invoice tidak ditemukan</h1>
      <p className="muted">Invoice disimpan di browser ini. <Link href="/dashboard?tab=riwayat"><u>Buka riwayat aktivitas</u></Link></p>
    </div>
  );
  const paid = o.total > 0;
  const date = new Date(o.ts).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  return (
    <div className="container section inv-page">
      <div className="inv-actions no-print">
        <Link className="btn secondary" href="/dashboard?tab=riwayat">← Riwayat</Link>
        <button className="btn" onClick={() => window.print()}>🖨️ Cetak / simpan PDF</button>
      </div>
      <article className="invoice">
        <header className="inv-head">
          <Logo />
          <div className="inv-meta">
            <span className={`inv-stamp ${paid ? "" : "free"}`}>{paid ? "LUNAS" : "GRATIS"}</span>
            <strong>{o.no}</strong>
            <span className="muted">{date}</span>
          </div>
        </header>
        <section className="inv-grid">
          <div><span className="muted">Ditagihkan kepada</span><strong>{o.buyer.name}</strong><span>{o.buyer.email}</span></div>
          <div><span className="muted">Jenis transaksi</span><strong>{KINDS[o.kind].label}</strong><span>{o.method || "—"}</span></div>
        </section>
        <h2 className="inv-title">{o.title}</h2>
        {o.detail && <p className="muted">{o.detail}</p>}
        <table className="inv-table">
          <thead><tr><th>Rincian</th><th>Jumlah</th></tr></thead>
          <tbody>
            {o.items.map((i) => <tr key={i.label}><td>{i.label}</td><td>{i.amount < 0 ? `− ${rupiah(-i.amount)}` : rupiah(i.amount)}</td></tr>)}
          </tbody>
          <tfoot><tr><td>Total dibayar</td><td>{rupiah(o.total)}</td></tr></tfoot>
        </table>
        <p className="muted inv-note">
          Ini adalah invoice simulasi (demo) dan bukan bukti pembayaran resmi. Pertanyaan transaksi: hubungi admin Mentify.
        </p>
      </article>
    </div>
  );
}
