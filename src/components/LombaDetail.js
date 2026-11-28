"use client";
import Link from "next/link";
import { useState } from "react";
import { isClosed, daysLeft, fmtDate, feeText, regLink, tlDate } from "@/data/lomba";
import { useNow } from "@/lib/useNow";
import { useCatalog } from "@/lib/listings";
import Poster from "./Poster";
import Lightbox from "./Lightbox";
import LombaCard from "./LombaCard";
import { Em, Icon, emo, Stars } from "@/components/Icon";

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
    ...(l.venue ? [["Tempat", l.venue]] : []),
    ...(l.feeNote ? [["Rincian biaya", l.feeNote]] : []),
  ];

  return (
    <div className="container section">
      <Link href="/lomba" className="muted back">← Semua lomba</Link>

      {/* Kartu profil */}
      <section className="card dprofile">
        <div className="dp-poster">
          {/\.(jpe?g|png)$/i.test(l.poster || "") ? (
            <Lightbox src={l.poster} alt={`Poster ${l.title}`}><Poster l={l} closed={closed} /></Lightbox>
          ) : <Poster l={l} closed={closed} />}
        </div>

        <div className="dp-body">
          <div className="row">
            <span className="badge">{l.type}</span>
            {l.demo && <span className="badge demo">Contoh lengkap</span>}
            {closed
              ? <span className="badge gray">Pendaftaran ditutup</span>
              : <span className="badge pink">{d !== null ? `Sisa ${d} hari` : "Dibuka"}</span>}
          </div>

          <h1 className="dp-title">{l.title}</h1>

          <div className="dp-org">
            <span className="dp-avatar" aria-hidden="true">{l.organizer[0]}</span>
            <div>
              <strong>{l.organizer}</strong>
              <p className="muted"><Em e="❤" /> {l.likes + (liked ? 1 : 0)} suka · <Em e="👁" /> {l.views.toLocaleString("id-ID")} dilihat</p>
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
              <a className="btn" href={regLink(l)} target="_blank" rel="noopener noreferrer">Daftar sekarang</a>
            )}
            <button className="btn secondary" onClick={() => setLiked(!liked)} aria-pressed={liked}>
              {liked ? <><Em e="❤" /> Disukai</> : <><Em e="🤍" /> Suka</>}
            </button>
            <button className="btn secondary" onClick={() => setSaved(!saved)} aria-pressed={saved}>
              {saved ? <><Em e="🔖" /> Tersimpan</> : "Simpan"}
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
              {l.theme && <p className="lm-theme">&ldquo;{l.theme}&rdquo;</p>}
              <p>{l.desc}</p>
              {l.subthemes?.length > 0 && (
                <>
                  <p className="muted" style={{ margin: "14px 0 6px" }}>Subtema</p>
                  <ul className="check-grid">
                    {l.subthemes.map((t) => <li key={t}><span aria-hidden="true"><Icon name="check" /></span>{t}</li>)}
                  </ul>
                </>
              )}
              {l.note && <p className="notice" style={{ marginTop: 14 }}>{l.note}</p>}
              <div className="info-list">
                {details.map(([k, v]) => (
                  <div key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </>
          )}

          {tab === "jadwal" && (
            <ol className="tl-h">
              {l.timeline.map(([t, date, label], i) => {
                const done = nextStep === -1 ? !!now : i < nextStep;
                return (
                  <li key={t} className={`${done ? "done" : ""} ${i === nextStep ? "now" : ""}`}>
                    <span className="tl-no">{done ? <Icon name="check" /> : i + 1}</span>
                    <strong>{t}</strong>
                    <span className="muted">{tlDate([t, date, label])}</span>
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
                    <span className="prize-icon"><Em e={MEDALS[i] || "🎁"} /></span>
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
                <li key={r}><span aria-hidden="true"><Icon name="check" /></span>{r}</li>
              ))}
            </ul>
          )}

          {tab === "kontak" && (
            <>
              {l.contacts?.length ? (
                <ul className="lm-contacts">
                  {l.contacts.map(([k, v], i) => <li key={k + i}><span>{k}</span><strong>{v}</strong></li>)}
                </ul>
              ) : <p>Kontak panitia: <strong>Instagram {l.contact}</strong></p>}
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