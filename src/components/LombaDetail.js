"use client";
import Link from "next/link";
import { useState } from "react";
import { isClosed, daysLeft, fmtDate, feeText } from "@/data/lomba";
import { useNow } from "@/lib/useNow";
import { useCatalog } from "@/lib/listings";
import Poster from "./Poster";
import LombaCard from "./LombaCard";

const TABS = [
  ["tentang", "Tentang"],
  ["jadwal", "Jadwal"],
  ["hadiah", "Hadiah"],
  ["syarat", "Syarat"],
  ["kontak", "Kontak & sumber"],
];
const MEDALS = ["🥇", "🥈", "🥉", "📜"];

export default function LombaDetail({ id }) {
  const now = useNow();
  const { lomba, ready } = useCatalog();
  const l = lomba.find((x) => x.id === Number(id));
  const [tab, setTab] = useState("tentang");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!l) {
    return (
      <div className="container section">
        {ready ? <>Lomba tidak ditemukan. <Link href="/lomba"><u>Kembali</u></Link></> : <span className="muted">Memuat info lomba…</span>}
      </div>
    );
  }

  const closed = isClosed(l, now);
  const d = daysLeft(l, now);
  const related = lomba.filter((x) => x.type === l.type && x.id !== l.id).slice(0, 3);
  const nextStep = now ? l.timeline.findIndex(([, date]) => new Date(date + "T12:00:00") > now) : -1;

  const facts = [
    ["Biaya", feeText(l)],
    ["Peserta", l.level],
    ["Pelaksanaan", l.mode],
    ["Tutup", fmtDate(l.end)],
  ];
  const details = [
    ["Penyelenggara", l.organizer],
    ["Kategori", l.type],
    ["Lokasi", l.province],
    ["Mulai", fmtDate(l.start)],
  ];

  return (
    <div className="container section">
      <Link href="/lomba" className="muted back">← Semua lomba</Link>

      {/* Kartu profil */}
      <section className="card dprofile">
        <div className="dp-poster"><Poster l={l} closed={closed} /></div>

        <div className="dp-body">
          <div className="row">
            <span className="badge">{l.type}</span>
            {closed
              ? <span className="badge gray">Pendaftaran ditutup</span>
              : <span className="badge pink">{d !== null ? `Sisa ${d} hari` : "Dibuka"}</span>}
          </div>

          <h1 className="dp-title">{l.title}</h1>

          <div className="dp-org">
            <span className="dp-avatar" aria-hidden="true">{l.organizer[0]}</span>
            <div>
              <strong>{l.organizer}</strong>
              <p className="muted">❤ {l.likes + (liked ? 1 : 0)} suka · 👁 {l.views.toLocaleString("id-ID")} dilihat</p>
            </div>
          </div>

          <div className="facts">
            {facts.map(([k, v]) => (
              <div key={k} className="fact"><span>{k}</span><strong>{v}</strong></div>
            ))}
          </div>

          {closed && <p className="notice">Pendaftaran sudah ditutup. Info ini ditampilkan sebagai referensi.</p>}

          <div className="row">
            {closed ? (
              <button className="btn" disabled>Pendaftaran ditutup</button>
            ) : (
              <a className="btn" href={l.links[0][1]} target="_blank" rel="noopener noreferrer">Daftar sekarang</a>
            )}
            <button className="btn secondary" onClick={() => setLiked(!liked)} aria-pressed={liked}>
              {liked ? "❤ Disukai" : "🤍 Suka"}
            </button>
            <button className="btn secondary" onClick={() => setSaved(!saved)} aria-pressed={saved}>
              {saved ? "🔖 Tersimpan" : "Simpan"}
            </button>
          </div>
        </div>
      </section>

      {/* Tab informasi */}
      <section className="card" style={{ marginTop: 16 }}>
        <div className="dtabs" role="tablist" aria-label="Informasi lomba">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              className="dtab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="dpanel" role="tabpanel">
          {tab === "tentang" && (
            <>
              <p>{l.desc}</p>
              <div className="info-list">
                {details.map(([k, v]) => (
                  <div key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </>
          )}

          {tab === "jadwal" && (
            <ol className="tl-h">
              {l.timeline.map(([t, date], i) => {
                const done = nextStep === -1 ? !!now : i < nextStep;
                return (
                  <li key={t} className={`${done ? "done" : ""} ${i === nextStep ? "now" : ""}`}>
                    <span className="tl-no">{done ? "✓" : i + 1}</span>
                    <strong>{t}</strong>
                    <span className="muted">{fmtDate(date)}</span>
                    {i === nextStep && <span className="badge pink">Berikutnya</span>}
                  </li>
                );
              })}
            </ol>
          )}

          {tab === "hadiah" && (
            <div className="prize-grid">
              {l.prizes.map((p, i) => {
                const [t, ...rest] = p.split(": ");
                const title = rest.length ? t : "Semua peserta";
                const text = rest.length ? rest.join(": ") : p;
                return (
                  <div key={p} className="prize">
                    <span className="prize-icon">{MEDALS[i] || "🎁"}</span>
                    <strong>{title}</strong>
                    <span className="muted">{text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "syarat" && (
            <ul className="check-grid">
              {l.requirements.map((r) => (
                <li key={r}><span aria-hidden="true">✔</span>{r}</li>
              ))}
            </ul>
          )}

          {tab === "kontak" && (
            <>
              <p>Kontak panitia: <strong>Instagram {l.contact}</strong></p>
              <p className="muted" style={{ margin: "12px 0 8px" }}>Sumber dan tautan resmi</p>
              <div className="link-btns">
                {l.links.map(([name, url]) => (
                  <a key={name} className="btn secondary" href={url} target="_blank" rel="noopener noreferrer">
                    {name} ↗
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="card mentor-cta">
        <div>
          <h3>Butuh mentor untuk lomba ini?</h3>
          <p className="muted">Konsultasi dengan mentor mahasiswa yang pernah juara di kategori {l.type}.</p>
        </div>
        <Link href="/mentor" className="btn">Cari mentor</Link>
      </section>

      {related.length > 0 && (
        <>
          <h2 style={{ margin: "32px 0 16px" }}>Lomba serupa</h2>
          <div className="grid">{related.map((r) => <LombaCard key={r.id} l={r} now={now} />)}</div>
        </>
      )}
    </div>
  );
}