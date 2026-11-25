"use client";
import Link from "next/link";
import { useState } from "react";
import { PROMO } from "@/data/products";
import { PAYMENTS, ADMIN_WA } from "@/data/mentors";
import { rupiah } from "@/lib/format";
import { addOrder } from "@/lib/orders";
import { useCatalog } from "@/lib/listings";
import { useReviews, mergeRating } from "@/lib/reviews";
import PaymentCard from "./PaymentCard";
import ReviewBox from "./ReviewBox";
import ProductCover from "./ProductCover";
import ProductCard from "./ProductCard";
import { Em, Icon, emo, Stars } from "@/components/Icon";

const TABS = [["desk", "Deskripsi"], ["isi", "Isi produk"], ["ulasan", "Ulasan"]];

export default function ProductDetail({ id }) {
  const { products, mentors, ready } = useCatalog();
  const { mine } = useReviews("produk", id);
  const [stage, setStage] = useState("form");
  const p = products.find((x) => x.id === Number(id));
  const [tab, setTab] = useState("desk");
  const [email, setEmail] = useState("");
  const [promoIn, setPromoIn] = useState("");
  const [promoOk, setPromoOk] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");
  const [payKey, setPayKey] = useState("QRIS");
  const [paySub, setPaySub] = useState("");
  const [agree, setAgree] = useState(false);

  if (!p) return !ready ? <div className="container section muted">Memuat produk…</div> : <div className="container section">Produk tidak ditemukan. <Link href="/marketplace"><u>Kembali</u></Link></div>;

  const seller = mentors.find((m) => m.name === p.seller);
  const pay = PAYMENTS.find((x) => x.key === payKey);
  const discount = promoOk ? Math.round((p.price * PROMO.pct) / 100) : 0;
  const total = p.price - discount;
  const emailOk = /\S+@\S+\.\S+/.test(email);
  const canSubmit = agree && emailOk && (!pay.sub || paySub);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  const applyPromo = () => {
    const ok = promoIn.trim().toUpperCase() === PROMO.code;
    setPromoOk(ok);
    setPromoMsg(ok ? `Kode berlaku, diskon ${PROMO.pct}%.` : "Kode tidak valid.");
  };
  const methodStr = `${payKey}${paySub ? ` – ${paySub}` : ""}`;
  const items = [{ label: p.title, amount: p.price }, ...(discount ? [{ label: `Diskon promo ${PROMO.pct}%`, amount: -discount }] : [])];
  const submit = () => {
    return addOrder({
      kind: "produk", to: p.seller, title: p.title, detail: `${p.category} · ${p.format} · oleh ${p.seller}`,
      items, method: methodStr, ref: `/marketplace/${p.id}`, target: { type: "produk", id: p.id, name: p.title },
    });
  };
  const pr = mergeRating(p.rating, p.reviewCount, mine);

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
            {p.demo && <span className="badge demo">Contoh lengkap</span>}
            <span className="badge"><Icon name="check" /> Dari mentor terverifikasi</span>
          </div>
          <dl className="idc-rows">
            {rows.map(([k, v]) => <div key={k}><dt className="muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="idc-stats">
            <div><strong>{pr.count ? <><Em e="⭐" /> {pr.rating}</> : <><Em e="🆕" /> Baru</>}</strong><span>{pr.count} ulasan</span></div>
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
                <ul className="check-grid">{p.who.map((w) => <li key={w}><span aria-hidden="true"><Icon name="check" /></span>{w}</li>)}</ul>
                <h4 className="sub">Penjual</h4>
                <p>{p.seller}{seller ? <> · {seller.campus} · <Link href={`/mentor/${seller.id}`}><u>Lihat profil mentor</u></Link></> : null}</p>
              </>)}

              {tab === "isi" && (<>
                <ul className="check-grid">{p.includes.map((i) => <li key={i}><span aria-hidden="true"><Em e="📦" /></span>{i}</li>)}</ul>
                <h4 className="sub">Setelah pembelian</h4>
                <p className="muted">File langsung bisa diunduh dari halaman ini dan dikirim ke email kamu. Pembaruan versi berikutnya gratis.</p>
              </>)}

              {tab === "ulasan" && (<>
                <div className="rate-sum"><strong>{pr.count ? <><Em e="⭐" /> {pr.rating}</> : <><Em e="🆕" /> Produk baru</>}</strong><span className="muted">dari {pr.count} ulasan</span></div>
                {pr.count === 0 && <p className="muted">Belum ada ulasan. Beli lalu beri ulasan dari Riwayat.</p>}
                {[...mine, ...p.reviews].map((r, i) => (
                  <div key={i} className={`rv ${r.mine ? "mine" : ""}`}>
                    <div className="row between"><strong>{r.by}</strong><span className="muted">{r.date}</span></div>
                    <span><Stars n={r.stars} /></span><p className="muted">{r.text}</p>
                  </div>
                ))}
              </>)}
            </div>
          </section>

          {/* Checkout */}
          <section className="card order" id="checkout">
            <h2>Checkout</h2>

            {stage === "pay" ? (
              <PaymentCard
                title={p.title} detail={`${p.category} · ${p.format} · oleh ${p.seller}`}
                items={items} method={methodStr} onBack={() => setStage("form")} onPay={submit}
                success={{
                  title: "Pembayaran berhasil",
                  note: "File sudah bisa diunduh dan dikirim ke email kamu. Bagaimana produknya? Beri ulasan agar membantu pembeli lain.",
                  actions: (o) => (<>
                    <a className="btn secondary" href={p.file || "#"} download={!!p.file}>Unduh file</a>
                    <a className="btn secondary" href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer">Hubungi admin</a>
                    <div style={{ flexBasis: "100%" }}><ReviewBox order={o} /></div>
                  </>),
                }}
              />
            ) : (
              <>
                <div className="ostep"><h4>1. Email penerima file</h4>
                  <input type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" /></div>

                <>
                  <div className="ostep"><h4>2. Kode promo (opsional)</h4>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <input placeholder={`Coba ${PROMO.code}`} value={promoIn} onChange={(e) => setPromoIn(e.target.value)} aria-label="Kode promo" />
                      <button type="button" className="btn secondary" onClick={applyPromo}>Pakai</button>
                    </div>
                    {promoMsg && <p className="muted" role="status">{promoMsg}</p>}</div>

                  <div className="ostep"><h4>3. Metode pembayaran</h4>
                    <div className="pay-grid">{PAYMENTS.map((x) => (
                      <button key={x.key} type="button" className="pay" aria-pressed={payKey === x.key}
                        onClick={() => { setPayKey(x.key); setPaySub(""); }}>
                        <strong>{x.key}</strong><span className="muted">{x.note}</span></button>))}</div>
                    {pay.sub && (
                      <select value={paySub} onChange={(e) => setPaySub(e.target.value)} aria-label={`Pilih ${pay.key}`}>
                        <option value="">Pilih {pay.key === "Transfer Bank" ? "bank" : "e-wallet"}</option>
                        {pay.sub.map((s) => <option key={s}>{s}</option>)}
                      </select>)}</div>
                </>

                <div className="summary">
                  <div><span>Harga produk</span><span>{rupiah(p.price)}</span></div>
                  {discount > 0 && <div><span>Diskon promo ({PROMO.pct}%)</span><span>-{rupiah(discount)}</span></div>}
                  <div><span>Biaya transaksi</span><span>Gratis</span></div>
                  <div className="total"><span>Total</span><span>{rupiah(total)}</span></div>
                </div>

                <div className="warn" role="note">
                  <span aria-hidden="true"><Em e="⚠️" /></span>
                  <span>Produk digital tidak dapat dikembalikan setelah diunduh, kecuali file rusak atau tidak sesuai deskripsi.
                    Jika ada kendala pembayaran atau file, hubungi admin Mentify di{" "}
                    <a href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer"><strong>WhatsApp {ADMIN_WA.label}</strong></a>.
                    Jangan membagikan file ke pihak lain karena pembelian berlaku untuk satu akun.</span>
                </div>

                <label className="agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>Saya menyetujui syarat dan ketentuan pembelian produk digital.</span></label>

                <button className="btn" disabled={!canSubmit} onClick={() => setStage("pay")}>
                  Lanjut ke pembayaran · {rupiah(total)}
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