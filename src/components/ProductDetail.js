"use client";
import Link from "next/link";
import { useState } from "react";
import { products, FREE_QUOTA, PRODUCT_FEE, PROMO } from "@/data/products";
import { mentors, PAYMENTS, ADMIN_WA } from "@/data/mentors";
import { rupiah } from "@/lib/format";
import { useUser } from "@/lib/auth";
import { useQuota } from "@/lib/quota";
import ProductCover from "./ProductCover";
import ProductCard from "./ProductCard";

const TABS = [["desk", "Deskripsi"], ["isi", "Isi produk"], ["ulasan", "Ulasan"]];

export default function ProductDetail({ id }) {
  const p = products.find((x) => x.id === Number(id));
  const { user } = useUser();
  const { ids, left, claim } = useQuota();
  const [tab, setTab] = useState("desk");
  const [via, setVia] = useState("beli");
  const [email, setEmail] = useState("");
  const [promoIn, setPromoIn] = useState("");
  const [promoOk, setPromoOk] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");
  const [payKey, setPayKey] = useState("QRIS");
  const [paySub, setPaySub] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(null);

  if (!p) return <div className="container section">Produk tidak ditemukan. <Link href="/marketplace"><u>Kembali</u></Link></div>;

  const seller = mentors.find((m) => m.name === p.seller);
  const premium = user?.plan === "premium";
  const claimed = ids.includes(p.id);
  const canQuota = premium && left > 0;
  const useQuotaNow = canQuota && via === "kuota";
  const pay = PAYMENTS.find((x) => x.key === payKey);
  const discount = promoOk ? Math.round((p.price * PROMO.pct) / 100) : 0;
  const total = useQuotaNow ? 0 : p.price - discount + PRODUCT_FEE;
  const emailOk = /\S+@\S+\.\S+/.test(email);
  const canSubmit = agree && emailOk && (useQuotaNow || !pay.sub || paySub);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  const applyPromo = () => {
    const ok = promoIn.trim().toUpperCase() === PROMO.code;
    setPromoOk(ok);
    setPromoMsg(ok ? `Kode berlaku, diskon ${PROMO.pct}%.` : "Kode tidak valid.");
  };
  const submit = () => {
    if (useQuotaNow) claim(p.id);
    setDone({ code: `INV-${p.id}${Date.now().toString().slice(-5)}`, free: useQuotaNow });
  };

  const rows = [
    ["Penjual", p.seller], ["Format", p.format], ["Ukuran file", p.size],
    ["Jumlah halaman", `${p.pages} halaman`], ["Bahasa", p.lang], ["Diperbarui", p.updated], ["Cocok untuk", p.lombaType],
  ];

  return (
    <div className="container section">
      <Link href="/marketplace" className="muted back">← Semua produk</Link>

      <div className="mprofile">
        {/* Kartu ID produk */}
        <aside className="idcard">
          <div className="idc-top"><span>MENTIFY</span><span>PRODUCT ID</span></div>
          <div className="pid-cover"><ProductCover p={p} ratio="4/3" /></div>
          <h1 className="idc-name">{p.title}</h1>
          <div className="row" style={{ justifyContent: "center" }}>
            <span className="badge pink">{p.category}</span>
            <span className="badge">✔ Dari mentor terverifikasi</span>
          </div>
          <dl className="idc-rows">
            {rows.map(([k, v]) => <div key={k}><dt className="muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="idc-stats">
            <div><strong>⭐ {p.rating}</strong><span>{p.reviewCount} ulasan</span></div>
            <div><strong>{p.sold}</strong><span>terjual</span></div>
            <div><strong>{p.pages}</strong><span>halaman</span></div>
          </div>
          <div className="pid-price">
            <span className="price">{rupiah(p.price)}</span>
            {p.oldPrice > 0 && <><s className="muted">{rupiah(p.oldPrice)}</s><span className="badge pink">-{disc}%</span></>}
          </div>
          <a href="#checkout" className="btn">Beli sekarang</a>
          <div className="idc-barcode" aria-hidden="true" />
          <span className="idc-code">{p.code}</span>
        </aside>

        <div>
          <section className="card">
            <div className="dtabs" role="tablist" aria-label="Informasi produk">
              {TABS.map(([k, label]) => (
                <button key={k} role="tab" className="dtab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
            <div className="dpanel" role="tabpanel">
              {tab === "desk" && (<>
                <p>{p.desc}</p>
                <h4 className="sub">Cocok untuk</h4>
                <ul className="check-grid">{p.who.map((w) => <li key={w}><span aria-hidden="true">✔</span>{w}</li>)}</ul>
                <h4 className="sub">Penjual</h4>
                <p>{p.seller}{seller ? <> · {seller.campus} · <Link href={`/mentor/${seller.id}`}><u>Lihat profil mentor</u></Link></> : null}</p>
              </>)}

              {tab === "isi" && (<>
                <ul className="check-grid">{p.includes.map((i) => <li key={i}><span aria-hidden="true">📦</span>{i}</li>)}</ul>
                <h4 className="sub">Setelah pembelian</h4>
                <p className="muted">File langsung bisa diunduh dari halaman ini dan dikirim ke email kamu. Pembaruan versi berikutnya gratis.</p>
              </>)}

              {tab === "ulasan" && (<>
                <div className="rate-sum"><strong>⭐ {p.rating}</strong><span className="muted">dari {p.reviewCount} ulasan</span></div>
                {p.reviews.map((r, i) => (
                  <div key={i} className="rv">
                    <div className="row between"><strong>{r.by}</strong><span className="muted">{r.date}</span></div>
                    <span>{"⭐".repeat(r.stars)}</span><p className="muted">{r.text}</p>
                  </div>
                ))}
              </>)}
            </div>
          </section>

          {/* Checkout */}
          <section className="card order" id="checkout">
            <h2>Checkout</h2>

            {done || claimed ? (
              <div className="ostep">
                <p className="badge pink" style={{ justifySelf: "start" }}>{done?.free || claimed ? "Akses dibuka" : "Pesanan diterima"}</p>
                <h3>{done ? `Kode ${done.code}` : "Produk ini sudah kamu klaim"}</h3>
                <div className="summary">
                  <div><span>Produk</span><strong>{p.title}</strong></div>
                  <div><span>Format</span><strong>{p.format} · {p.size}</strong></div>
                  <div className="total"><span>Total dibayar</span><span>{rupiah(done ? done.free ? 0 : total : 0)}</span></div>
                </div>
                <div className="row">
                  <button className="btn">Unduh file</button>
                  <a className="btn secondary" href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer">Hubungi admin</a>
                </div>
                <p className="muted">Simulasi: belum ada transaksi atau file nyata.</p>
              </div>
            ) : (
              <>
                <div className="ostep"><h4>1. Cara akses</h4>
                  {canQuota ? (
                    <div className="pay-grid">
                      <button type="button" className="pay" aria-pressed={via === "kuota"} onClick={() => setVia("kuota")}>
                        <strong>Gratis (kuota premium)</strong><span className="muted">Sisa {left} dari {FREE_QUOTA} bulan ini</span></button>
                      <button type="button" className="pay" aria-pressed={via === "beli"} onClick={() => setVia("beli")}>
                        <strong>Beli {rupiah(p.price)}</strong><span className="muted">Kuota premium tidak terpakai</span></button>
                    </div>
                  ) : premium ? (
                    <p className="notice">Kuota gratis bulan ini sudah habis. Kamu masih bisa membeli produk ini.</p>
                  ) : (
                    <p className="notice">Akun free perlu membayar. <Link href="/login"><u>Upgrade ke premium</u></Link> untuk {FREE_QUOTA} akses gratis per bulan.</p>
                  )}
                </div>

                <div className="ostep"><h4>2. Email penerima file</h4>
                  <input type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" /></div>

                {!useQuotaNow && (<>
                  <div className="ostep"><h4>3. Kode promo (opsional)</h4>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <input placeholder={`Coba ${PROMO.code}`} value={promoIn} onChange={(e) => setPromoIn(e.target.value)} aria-label="Kode promo" />
                      <button type="button" className="btn secondary" onClick={applyPromo}>Pakai</button>
                    </div>
                    {promoMsg && <p className="muted" role="status">{promoMsg}</p>}</div>

                  <div className="ostep"><h4>4. Metode pembayaran</h4>
                    <div className="pay-grid">{PAYMENTS.map((x) => (
                      <button key={x.key} type="button" className="pay" aria-pressed={payKey === x.key}
                        onClick={() => { setPayKey(x.key); setPaySub(""); }}>
                        <strong>{x.key}</strong><span className="muted">{x.note}</span></button>))}</div>
                    {pay.sub && (
                      <select value={paySub} onChange={(e) => setPaySub(e.target.value)} aria-label={`Pilih ${pay.key}`}>
                        <option value="">Pilih {pay.key === "Transfer Bank" ? "bank" : "e-wallet"}</option>
                        {pay.sub.map((s) => <option key={s}>{s}</option>)}
                      </select>)}</div>
                </>)}

                <div className="summary">
                  <div><span>Harga produk</span><span>{rupiah(p.price)}</span></div>
                  {useQuotaNow ? (
                    <div><span>Potongan kuota premium</span><span>-{rupiah(p.price)}</span></div>
                  ) : (<>
                    {discount > 0 && <div><span>Diskon promo ({PROMO.pct}%)</span><span>-{rupiah(discount)}</span></div>}
                    <div><span>Biaya layanan</span><span>{rupiah(PRODUCT_FEE)}</span></div>
                  </>)}
                  <div className="total"><span>Total</span><span>{rupiah(total)}</span></div>
                </div>

                <div className="warn" role="note">
                  <span aria-hidden="true">⚠️</span>
                  <span>Produk digital tidak dapat dikembalikan setelah diunduh, kecuali file rusak atau tidak sesuai deskripsi.
                    Jika ada kendala pembayaran atau file, hubungi admin Mentify di{" "}
                    <a href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer"><strong>WhatsApp {ADMIN_WA.label}</strong></a>.
                    Jangan membagikan file ke pihak lain karena pembelian berlaku untuk satu akun.</span>
                </div>

                <label className="agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>Saya menyetujui syarat dan ketentuan pembelian produk digital.</span></label>

                <button className="btn" disabled={!canSubmit} onClick={submit}>
                  {useQuotaNow ? "Buka akses gratis" : `Bayar ${rupiah(total)}`}
                </button>
              </>
            )}
          </section>
        </div>
      </div>

      {related.length > 0 && (<>
        <h2 style={{ margin: "32px 0 16px" }}>Produk {p.category} lainnya</h2>
        <div className="grid-s">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </>)}
    </div>
  );
}