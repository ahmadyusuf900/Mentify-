"use client";
// Komponen filter bersama: search + satu dropdown kategori + satu dropdown tambahan (opsional)
export default function FilterBar({ q, setQ, cat, setCat, cats, extra }) {
  return (
    <div className="filters">
      <input placeholder="Cari…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari" />
      <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategori">
        <option value="">Semua kategori</option>{cats.map((c) => <option key={c}>{c}</option>)}
      </select>
      {extra}
    </div>
  );
}
