"use client";
import { useState } from "react";
import Link from "next/link";
import { mentors, mentorCategories, priceFor } from "@/data/mentors";
import { lomba, isClosed, daysLeft, fmtDate, feeText } from "@/data/lomba";
import { products, productLombaTypes } from "@/data/products";
import { lombaTypes } from "@/data/lomba";
import { catMeta, CATEGORY_ORDER } from "@/data/categories";
import { rupiah } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import MentorAvatar from "@/components/MentorAvatar";
import Poster from "@/components/Poster";
import ProductCover from "@/components/ProductCover";

// Satu kerangka kartu untuk semua jenis, supaya ukuran dan susunannya sama
function Card({ label, media, badges, title, sub, meta, href, cta, empty = false }) {
  return (
    <article className="xp-card">
      <span className="xp-label">{label}</span>
      <div className="xp-media">{media}</div>
      <div className="xp-badges">{badges}</div>
      <strong className="xp-title">{title}</strong>
      <p className="muted xp-sub">{sub}</p>
      <p className="muted xp-meta">{meta}</p>
      <Link className={`btn xp-btn ${empty ? "secondary" : ""}`} href={href}>{cta}</Link>
    </article>
  );
}

const VISIBLE = 6; // jumlah chip yang tampil sebelum "Lihat lebih banyak lomba"
const ALL = [...new Set([...mentorCategories, ...lombaTypes, ...productLombaTypes])]
  .sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 100) % 100 - (CATEGORY_ORDER.indexOf(b) + 100) % 100);

export default function Explorer() {
  const now = useNow();
  const [cat, setCat] = useState(ALL[0]);
  const [more, setMore] = useState(false);
  const shown = more ? ALL : ALL.slice(0, VISIBLE);

  const m = mentors.filter((x) => x.category === cat).sort((a, b) => b.rating - a.rating)[0];
  const l = lomba.filter((x) => x.type === cat)
    .sort((a, b) => Number(isClosed(a, now)) - Number(isClosed(b, now)) || a.end.localeCompare(b.end))[0];
  const p = products.filter((x) => x.lombaType === cat).sort((a, b) => b.sold - a.sold)[0];
  const closed = l ? isClosed(l, now) : false;
  const d = l ? daysLeft(l, now) : null;

  return (
    <>
      <div className="xp-chips" role="group" aria-label="Pilih jenis lomba">
        {shown.map((c) => {
          const [icon, c1, c2] = catMeta(c);
          const n = lomba.filter((x) => x.type === c).length;
          return (
            <button key={c} type="button" className={`xc ${cat === c ? "on" : ""}`} aria-pressed={cat === c}
              style={{ "--c1": c1, "--c2": c2 }} onClick={() => setCat(c)}>
              <span className="xc-ico" aria-hidden="true">{icon}</span>
              <span className="xc-txt"><strong>{c}</strong><small>{n} lomba</small></span>
            </button>
          );
        })}
      </div>
      {ALL.length > VISIBLE && (
        <div className="xp-more">
          <button type="button" className="btn secondary" onClick={() => setMore(!more)} aria-expanded={more}>
            {more ? "Tampilkan lebih sedikit ▲" : `Lihat lebih banyak lomba (+${ALL.length - VISIBLE}) ▼`}
          </button>
        </div>
      )}

      <div className="xp-grid" key={cat}>
        {m ? (
          <Card label="Mentor" media={<MentorAvatar m={m} />}
            badges={<span className="badge">Mentor {m.category}</span>}
            title={m.name} sub={m.campus}
            meta={`⭐ ${m.rating} · ${m.sessions} sesi · mulai ${rupiah(priceFor(m, 60))}`}
            href={`/mentor/${m.id}`} cta="Lihat profil" />
        ) : (
          <Card label="Mentor" media={<span className="muted">Belum ada</span>} badges={null}
            title="Belum tersedia" sub="Belum ada mentor untuk kategori ini." meta="Coba kategori lain."
            href="/mentor" cta="Lihat semua mentor" empty />
        )}

        {l ? (
          <Card label="Lomba" media={<Poster l={l} closed={closed} />}
            badges={<>
              <span className="badge">{l.type}</span>
              {closed ? <span className="badge gray">Ditutup</span> : <span className="badge pink">{d !== null ? `Sisa ${d} hari` : "Dibuka"}</span>}
            </>}
            title={l.title} sub={l.organizer}
            meta={`${feeText(l)} · tutup ${fmtDate(l.end)}`}
            href={`/lomba/${l.id}`} cta="Lihat info lomba" />
        ) : (
          <Card label="Lomba" media={<span className="muted">Belum ada</span>} badges={null}
            title="Belum tersedia" sub="Belum ada info lomba untuk kategori ini." meta="Coba kategori lain."
            href="/lomba" cta="Lihat semua lomba" empty />
        )}

        {p ? (
          <Card label="Produk" media={<ProductCover p={p} ratio="4/3" />}
            badges={<span className="badge">{p.category}</span>}
            title={p.title} sub={`oleh ${p.seller}`}
            meta={`⭐ ${p.rating} · ${p.sold} terjual · ${rupiah(p.price)}`}
            href={`/marketplace/${p.id}`} cta="Lihat produk" />
        ) : (
          <Card label="Produk" media={<span className="muted">Belum ada</span>} badges={null}
            title="Belum tersedia" sub="Belum ada produk untuk kategori ini." meta="Coba kategori lain."
            href="/marketplace" cta="Ke marketplace" empty />
        )}
      </div>
    </>
  );
}