"use client";
import { useState } from "react";
import { mentorCategories, mentorCampuses } from "@/data/mentors";
import { useCatalog } from "@/lib/listings";
import MentorCard from "@/components/MentorCard";
import MentorMarquee from "@/components/MentorMarquee";
import Empty from "@/components/Empty";
import PageHero from "@/components/PageHero";

const PRICES = { murah: [0, 64999], sedang: [65000, 79999], tinggi: [80000, Infinity] };

export default function MentorPage() {
  const { mentors } = useCatalog();
  const [f, setF] = useState({ q: "", cat: "", campus: "", price: "", rating: "", top: false, weekend: false, english: false, sort: "rating" });
  const [shown, setShown] = useState(8);
  const set = (k, v) => { setF({ ...f, [k]: v }); setShown(8); };

  const list = mentors
    .filter((m) => {
      const [lo, hi] = PRICES[f.price] || [0, Infinity];
      return (
        (m.name + m.campus + m.major + m.category + m.tags.join(" ")).toLowerCase().includes(f.q.toLowerCase()) &&
        (!f.cat || m.category === f.cat) && (!f.campus || m.campus === f.campus) &&
        m.price >= lo && m.price <= hi &&
        (!f.rating || m.rating >= Number(f.rating)) && (!f.top || m.rating >= 4.8) &&
        (!f.weekend || m.days.includes(0) || m.days.includes(6)) &&
        (!f.english || m.languages.includes("Inggris"))
      );
    })
    .sort((a, b) =>
      // urutan default: mentor yang baru mendaftar tampil di atas
      (f.sort === "rating" && !!b.isNew !== !!a.isNew) ? (b.isNew ? 1 : -1) :
      f.sort === "murah" ? a.price - b.price : f.sort === "mahal" ? b.price - a.price :
      f.sort === "sesi" ? b.sessions - a.sessions : b.rating - a.rating);

  const best = [...mentors].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const Chip = ({ on, onClick, children }) => (
    <button type="button" className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={onClick}>{children}</button>
  );

  return (
    <>
           <PageHero theme="mentor" title="Temukan mentor lomba terbaikmu"
        sub={`${mentors.length} mentor mahasiswa terverifikasi untuk esai, business case, UI/UX, debat, dan desain.`}>
        <input className="big-search" placeholder="Cari nama, kampus, jurusan, atau keahlian…" value={f.q}
          onChange={(e) => set("q", e.target.value)} aria-label="Cari mentor" />
        <div className="lomba-filters">
          <select value={f.cat} onChange={(e) => set("cat", e.target.value)} aria-label="Jenis mentor">
            <option value="">Semua jenis mentor</option>{mentorCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={f.campus} onChange={(e) => set("campus", e.target.value)} aria-label="Kampus">
            <option value="">Semua kampus</option>{mentorCampuses.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={f.price} onChange={(e) => set("price", e.target.value)} aria-label="Harga">
            <option value="">Semua harga</option>
            <option value="murah">Di bawah Rp65.000</option>
            <option value="sedang">Rp65.000 – Rp79.000</option>
            <option value="tinggi">Rp80.000 ke atas</option>
          </select>
          <select value={f.rating} onChange={(e) => set("rating", e.target.value)} aria-label="Rating minimum">
            <option value="">Semua rating</option><option value="4.5">4,5 ke atas</option><option value="4.8">4,8 ke atas</option>
          </select>
        </div>
        <div className="row">
          <Chip on={f.top} onClick={() => set("top", !f.top)}>Rating 4,8+</Chip>
          <Chip on={f.weekend} onClick={() => set("weekend", !f.weekend)}>Tersedia akhir pekan</Chip>
          <Chip on={f.english} onClick={() => set("english", !f.english)}>Bisa bahasa Inggris</Chip>
        </div>
      </PageHero>

      <section className="container section">
        <h2>Mentor dengan rating tertinggi</h2>
        <MentorMarquee items={best} />
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="row between">
          <h2>Semua mentor</h2>
          <select style={{ width: "auto" }} value={f.sort} onChange={(e) => set("sort", e.target.value)} aria-label="Urutkan">
            <option value="rating">Rating tertinggi</option><option value="sesi">Sesi terbanyak</option>
            <option value="murah">Harga terendah</option><option value="mahal">Harga tertinggi</option>
          </select>
        </div>
        <p className="muted" style={{ margin: "4px 0 16px" }}>{list.length} mentor ditemukan</p>
        {list.length ? <div className="grid-s">{list.slice(0, shown).map((m) => <MentorCard key={m.id} m={m} />)}</div> : <Empty />}
        {shown < list.length && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button className="btn secondary" onClick={() => setShown(shown + 8)}>Muat lebih banyak</button>
          </div>
        )}
      </section>
    </>
  );
}