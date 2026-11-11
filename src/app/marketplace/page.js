"use client";
import { useState } from "react";
import Link from "next/link";
import { products, productCategories, productIcons, productLombaTypes, FREE_QUOTA } from "@/data/products";
import { useUser } from "@/lib/auth";
import { useQuota } from "@/lib/quota";
import ProductCard from "@/components/ProductCard";
import Empty from "@/components/Empty";
import PageHero from "@/components/PageHero";

const PRICES = { a: [0, 29999], b: [30000, 44999], c: [45000, Infinity] };
const INIT = { q: "", cat: "", price: "", rating: "", lomba: "", promo: false, sort: "laris" };

export default function Marketplace() {
  const { user } = useUser();
  const { left } = useQuota();
  const premium = user?.plan === "premium";
  const [f, setF] = useState(INIT);
  const [shown, setShown] = useState(9);
  const [showF, setShowF] = useState(false);
  const set = (k, v) => { setF({ ...f, [k]: v }); setShown(9); };

  const list = products
    .filter((p) => {
      const [lo, hi] = PRICES[f.price] || [0, Infinity];
      return (
        (p.title + p.seller + p.category + p.lombaType).toLowerCase().includes(f.q.toLowerCase()) &&
        (!f.cat || p.category === f.cat) && p.price >= lo && p.price <= hi &&
        (!f.rating || p.rating >= Number(f.rating)) && (!f.lomba || p.lombaType === f.lomba) &&
        (!f.promo || p.oldPrice > 0)
      );
    })
    .sort((a, b) =>
      f.sort === "murah" ? a.price - b.price : f.sort === "mahal" ? b.price - a.price :
      f.sort === "rating" ? b.rating - a.rating : b.sold - a.sold);

  const Radio = ({ k, v, label }) => (
    <label className="radio"><input type="radio" name={k} checked={f[k] === v} onChange={() => set(k, v)} />{label}</label>
  );

  return (
    <>
            <PageHero theme="market" title="Marketplace produk digital"
        sub="Esai juara, template, dan materi persiapan lomba dari para juara. Langsung unduh setelah bayar.">
        <input className="big-search" placeholder="Cari produk, penjual, atau jenis lomba…" value={f.q}
          onChange={(e) => set("q", e.target.value)} aria-label="Cari produk" />
        <div className="row">
          <button type="button" className={`chip ${!f.cat ? "on" : ""}`} aria-pressed={!f.cat} onClick={() => set("cat", "")}>Semua</button>
          {productCategories.map((c) => (
            <button key={c} type="button" className={`chip ${f.cat === c ? "on" : ""}`} aria-pressed={f.cat === c}
              onClick={() => set("cat", f.cat === c ? "" : c)}>{productIcons[c]} {c}</button>
          ))}
        </div>
      </PageHero>

      <div className="container section">
        <div className="mk-banner">
          {premium ? (
            <span>⭐ <strong>Akun premium:</strong> sisa kuota akses gratis bulan ini {left} dari {FREE_QUOTA} produk.</span>
          ) : (
            <span>Akun <strong>premium</strong> bisa mengakses {FREE_QUOTA} produk gratis tiap bulan. <Link href="/login"><u>Masuk atau upgrade</u></Link></span>
          )}
        </div>

        <div className="mk-layout">
          <aside>
            <button type="button" className="btn secondary mk-toggle" onClick={() => setShowF(!showF)} aria-expanded={showF}>
              {showF ? "Tutup filter" : "Tampilkan filter"}
            </button>
            <div className={`card mk-side ${showF ? "open" : ""}`}>
              <h4>Harga</h4>
              <Radio k="price" v="" label="Semua harga" />
              <Radio k="price" v="a" label="Di bawah Rp30.000" />
              <Radio k="price" v="b" label="Rp30.000 – Rp44.000" />
              <Radio k="price" v="c" label="Rp45.000 ke atas" />
              <h4>Rating</h4>
              <Radio k="rating" v="" label="Semua rating" />
              <Radio k="rating" v="4.5" label="4,5 ke atas" />
              <Radio k="rating" v="4.8" label="4,8 ke atas" />
              <h4>Jenis lomba</h4>
              <select value={f.lomba} onChange={(e) => set("lomba", e.target.value)} aria-label="Jenis lomba">
                <option value="">Semua jenis lomba</option>
                {productLombaTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <label className="radio"><input type="checkbox" checked={f.promo} onChange={(e) => set("promo", e.target.checked)} />Sedang diskon</label>
              <button type="button" className="btn secondary" onClick={() => { setF(INIT); setShown(9); }}>Reset filter</button>
            </div>
          </aside>

          <div>
            <div className="row between">
              <p className="muted">{list.length} produk ditemukan</p>
              <select style={{ width: "auto" }} value={f.sort} onChange={(e) => set("sort", e.target.value)} aria-label="Urutkan">
                <option value="laris">Terlaris</option><option value="rating">Rating tertinggi</option>
                <option value="murah">Harga terendah</option><option value="mahal">Harga tertinggi</option>
              </select>
            </div>
            {list.length ? (
              <div className="mk-grid">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} free={premium && left > 0} />)}</div>
            ) : <Empty />}
            {shown < list.length && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button className="btn secondary" onClick={() => setShown(shown + 9)}>Muat lebih banyak</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}