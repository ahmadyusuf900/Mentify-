"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { rupiah } from "@/lib/format";
import { nextInvoiceNo } from "@/lib/orders";
import { useUser } from "@/lib/auth";
import { PAYMENTS } from "@/data/mentors";

const hash = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

// QR dummy (bukan QRIS sungguhan): pola acak deterministik + 3 penanda sudut
function Qr({ seed }) {
  const N = 25; let s = hash(seed);
  const rnd = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const finder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  const F = ({ x, y }) => (<g transform={`translate(${x} ${y})`}><rect width="7" height="7" /><rect x="1" y="1" width="5" height="5" fill="#fff" /><rect x="2" y="2" width="3" height="3" /></g>);
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="pc-qr" role="img" aria-label="Kode QR contoh">
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      <g fill="#2F4860">{cells}<F x={0} y={0} /><F x={N - 7} y={0} /><F x={0} y={N - 7} /></g>
    </svg>
  );
}

export function MethodPicker({ value, onChange }) {
  const [key, sub] = value.split(" – ");
  const cur = PAYMENTS.find((p) => p.key === key) || PAYMENTS[0];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div className="pay-grid">
        {PAYMENTS.map((p) => (
          <button key={p.key} type="button" className="pay" aria-pressed={cur.key === p.key} onClick={() => onChange(p.sub ? p.key : p.key)}>
            <strong style={{ fontSize: ".9rem" }}>{p.key}</strong><span className="muted" style={{ fontSize: ".78rem" }}>{p.note}</span>
          </button>
        ))}
      </div>
      {cur.sub && (
        <select value={sub || ""} onChange={(e) => onChange(e.target.value ? `${cur.key} – ${e.target.value}` : cur.key)} aria-label={`Pilih ${cur.key}`}>
          <option value="">Pilih {cur.key === "Transfer Bank" ? "bank" : "e-wallet"}</option>
          {cur.sub.map((x) => <option key={x}>{x}</option>)}
        </select>
      )}
    </div>
  );
}

/**
 * Kartu invoice sebelum bayar → proses → status berhasil.
 * onPay(): dipanggil saat pembayaran (simulasi) selesai; harus membuat order lalu mengembalikannya.
 * success: { title, note, actions(order) } — isi layar berhasil.
 */
export default function PaymentCard({ title, detail, items, method, onBack, onPay, success = {} }) {
  const { user } = useUser();
  const [stage, setStage] = useState("review");
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [info] = useState(() => ({ no: nextInvoiceNo(), exp: new Date(Date.now() + 24 * 3600 * 1000) }));
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const total = items.reduce((s, i) => s + i.amount, 0);
  const [mKey, mSub] = (method || "QRIS").split(" – ");
  const va = `${mSub === "BCA" ? "39" : mSub === "Mandiri" ? "88" : "70"}${String(hash(info.no)).padStart(10, "0")}00`.replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = info.exp.toLocaleString("id-ID", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  const pay = () => {
    setStage("processing");
    timer.current = setTimeout(() => { setOrder(onPay()); setStage("paid"); }, 1500);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(va.replace(/ /g, "")); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} };

  return (
    <div className={`paycard ${stage}`} aria-live="polite">
      <div className="pc-head">
        <span className="pc-ico" aria-hidden="true">{stage === "paid" ? "✅" : "🧾"}</span>
        <div><strong>{stage === "paid" ? "Bukti pembayaran" : "Invoice pembayaran"}</strong><span className="muted">{info.no}</span></div>
        <span className={`badge ${stage === "paid" ? "pink" : ""}`}>{stage === "review" ? "Menunggu pembayaran" : stage === "processing" ? "Memproses…" : "Berhasil"}</span>
      </div>

      {stage === "paid" ? (
        <div className="pc-success">
          <svg viewBox="0 0 52 52" className="pc-check" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg>
          <h3>{success.title || "Pembayaran berhasil"}</h3>
          <p className="muted">{success.note}</p>
          <div className="summary" style={{ width: "100%" }}>
            <div><span>{title}</span><span /></div>
            <div><span>Metode</span><strong>{method}</strong></div>
            <div><span>Waktu</span><strong>{new Date(order.ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</strong></div>
            <div className="total"><span>Total dibayar</span><span>{rupiah(total)}</span></div>
          </div>
          <div className="row" style={{ gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Link className="btn" href={`/invoice?id=${order.id}`}>🧾 Lihat invoice</Link>
            {success.actions?.(order)}
          </div>
        </div>
      ) : (
        <>
          <div><h3 style={{ marginBottom: 2 }}>{title}</h3>{detail && <p className="muted" style={{ fontSize: ".85rem" }}>{detail}</p>}</div>
          <div className="info-list" style={{ marginTop: 0 }}>
            <div><span>Ditagihkan kepada</span><strong>{user?.name || "Pengguna"}</strong></div>
            <div><span>Bayar sebelum</span><strong>{fmtExp}</strong></div>
          </div>
          <div className="summary">
            {items.map((i) => <div key={i.label}><span>{i.label}</span><span>{i.amount < 0 ? `− ${rupiah(-i.amount)}` : rupiah(i.amount)}</span></div>)}
            <div className="total"><span>Total tagihan</span><span>{rupiah(total)}</span></div>
          </div>

          {total > 0 && (
            <div className="pc-how">
              <strong>Metode: {method}</strong>
              {mKey === "QRIS" && (<div className="pc-qrwrap"><Qr seed={info.no} /><p className="muted">Scan dengan aplikasi e-wallet / m-banking apa saja. (QR contoh)</p></div>)}
              {mKey === "Transfer Bank" && (
                <div className="pc-va"><span className="muted">Nomor virtual account {mSub || ""}</span>
                  <div className="row between"><code>{va}</code><button type="button" className="btn secondary hist-btn" onClick={copy}>{copied ? "Tersalin ✓" : "Salin"}</button></div></div>
              )}
              {mKey === "E-Wallet" && <p className="muted">Buka aplikasi {mSub || "e-wallet"} kamu dan setujui permintaan pembayaran {rupiah(total)}.</p>}
            </div>
          )}

          <div className="warn"><span aria-hidden="true">⚠️</span><span>Simulasi: tidak ada uang yang benar-benar ditagih. Tombol di bawah mewakili pembayaran yang sudah kamu lakukan.</span></div>
          <div className="row between" style={{ gap: 8, flexWrap: "wrap" }}>
            {onBack ? <button className="btn secondary" type="button" onClick={onBack} disabled={stage === "processing"}>← Ubah pesanan</button> : <span />}
            <button className="btn" type="button" onClick={pay} disabled={stage === "processing"}>
              {stage === "processing" ? <><span className="spin" aria-hidden="true" /> Memverifikasi pembayaran…</> : total > 0 ? `Saya sudah bayar ${rupiah(total)}` : "Konfirmasi"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
