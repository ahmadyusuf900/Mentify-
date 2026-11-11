"use client";
import { useState } from "react";
import Link from "next/link";
import { mentors, mentorCategories, priceFor } from "@/data/mentors";
import { lomba, isClosed, daysLeft, fmtDate, feeText } from "@/data/lomba";
import { products } from "@/data/products";
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

export default function Explorer() {
  const now = useNow();
  const [cat, setCat] = useState(mentorCategories[0]);

  const m = mentors.filter((x) => x.category === cat).sort((a, b) => b.rating - a.rating)[0];
  const l = lomba.filter((x) => x.type === cat)
    .sort((a, b) => Number(isClosed(a, now)) - Number(isClosed(b, now)) || a.end.localeCompare(b.end))[0];
  const p = products.filter((x) => x.lombaType === cat).sort((a, b) => b.sold - a.sold)[0];
  const closed = l ? isClosed(l, now) : false;
  const d = l ? daysLeft(l, now) : null;

  return (
    <>
      <div className="xp-chips" role="group" aria-label="Pilih jenis lomba">
        {mentorCategories.map((c) => (
          <button key={c} type="button" className={`chip ${cat === c ? "on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

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