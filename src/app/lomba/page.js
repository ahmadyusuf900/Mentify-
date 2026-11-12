"use client";
import { useState } from "react";
import { lombaTypes, lombaLevels, lombaProvinces, isClosed } from "@/data/lomba";
import { useNow } from "@/lib/useNow";
import { useCatalog } from "@/lib/listings";
import LombaCard from "@/components/LombaCard";
import HotMarquee from "@/components/HotMarquee";
import Empty from "@/components/Empty";
import PageHero from "@/components/PageHero";

export default function LombaPage() {
  const now = useNow();
  const { lomba } = useCatalog();
  const [f, setF] = useState({ q: "", level: "", prov: "", cat: "", status: "", pay: "", online: false, sort: "deadline" });
  const [shown, setShown] = useState(9);
  const set = (k, v) => { setF({ ...f, [k]: v }); setShown(9); };

  const list = lomba
    .filter((l) =>
      (l.title + l.organizer + l.type).toLowerCase().includes(f.q.toLowerCase()) &&
      (!f.level || l.levels.includes(f.level)) &&
      (!f.prov || l.province === f.prov) &&
      (!f.cat || l.type === f.cat) &&
      (!f.status || (f.status === "buka") === !isClosed(l, now)) &&
      (!f.pay || (f.pay === "gratis") === (l.fee === 0)) &&
      (!f.online || l.mode.includes("Online")))
    .sort((a, b) => {
      const ca = isClosed(a, now), cb = isClosed(b, now);
      if (ca !== cb) return ca ? 1 : -1; // lomba tutup selalu di bawah
      if (f.sort === "populer") return b.views - a.views;
      if (f.sort === "terbaru") return b.start.localeCompare(a.start);
      return a.end.localeCompare(b.end); // deadline terdekat
    });

  const hot = [...lomba].sort((a, b) => b.views - a.views).slice(0, 8);

  const Sel = ({ k, label, opts }) => (
    <select value={f[k]} onChange={(e) => set(k, e.target.value)} aria-label={label}>
      <option value="">{label}</option>
      {opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  const Chip = ({ on, onClick, children }) => (
    <button type="button" className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={onClick}>{children}</button>
  );

  return (
    <>
            <PageHero theme="lomba" title="Temukan lomba yang cocok untukmu"
        sub={`${lomba.length} info lomba esai, business case, desain, UI/UX, debat, dan lainnya.`}>
        <input className="big-search" placeholder="Cari lomba, penyelenggara, atau kategori…" value={f.q}
          onChange={(e) => set("q", e.target.value)} aria-label="Cari lomba" />
        <div className="lomba-filters">
          <Sel k="level" label="Semua peserta" opts={lombaLevels} />
          <Sel k="prov" label="Semua lokasi" opts={lombaProvinces} />
          <Sel k="cat" label="Semua kategori" opts={lombaTypes} />
          <select value={f.status} onChange={(e) => set("status", e.target.value)} aria-label="Status">
            <option value="">Semua status</option>
            <option value="buka">Masih dibuka</option>
            <option value="tutup">Sudah tutup</option>
          </select>
        </div>
        <div className="row">
          <Chip on={f.pay === "gratis"} onClick={() => set("pay", f.pay === "gratis" ? "" : "gratis")}>Gratis</Chip>
          <Chip on={f.pay === "berbayar"} onClick={() => set("pay", f.pay === "berbayar" ? "" : "berbayar")}>Berbayar</Chip>
          <Chip on={f.online} onClick={() => set("online", !f.online)}>Online</Chip>
        </div>
      </PageHero>

      <section className="container section">
        <h2>Paling banyak dilihat</h2>
        <HotMarquee items={hot} now={now} />
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="row between">
          <h2>Eksplor lomba</h2>
          <select style={{ width: "auto" }} value={f.sort} onChange={(e) => set("sort", e.target.value)} aria-label="Urutkan">
            <option value="deadline">Deadline terdekat</option>
            <option value="populer">Terpopuler</option>
            <option value="terbaru">Terbaru</option>
          </select>
        </div>
        <p className="muted" style={{ margin: "4px 0 16px" }}>{list.length} lomba ditemukan</p>
        {list.length ? (
          <div className="grid">{list.slice(0, shown).map((l) => <LombaCard key={l.id} l={l} now={now} />)}</div>
        ) : (
          <Empty />
        )}
        {shown < list.length && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button className="btn secondary" onClick={() => setShown(shown + 9)}>Muat lebih banyak</button>
          </div>
        )}
      </section>
    </>
  );
}