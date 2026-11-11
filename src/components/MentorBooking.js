"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { mentors, DAYS, DURATIONS, FORMATS, PAYMENTS, ADMIN_WA, ADMIN_FEE, priceFor } from "@/data/mentors";
import { rupiah } from "@/lib/format";
import { useNow } from "@/lib/useNow";
import MentorAvatar from "./MentorAvatar";
import MentorCard from "./MentorCard";

const TABS = [["tentang", "Tentang"], ["prestasi", "Prestasi"], ["cv", "CV & verifikasi"], ["ulasan", "Ulasan"]];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function MentorBooking({ id }) {
  const now = useNow();
  const m = mentors.find((x) => x.id === Number(id));
  const [tab, setTab] = useState("tentang");
  const [dur, setDur] = useState(60);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [fmt, setFmt] = useState(FORMATS[0]);
  const [payKey, setPayKey] = useState("QRIS");
  const [paySub, setPaySub] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(null);

  // 10 tanggal terdekat yang sesuai hari tersedia mentor
  const dates = useMemo(() => {
    if (!now || !m) return [];
    const out = [];
    for (let i = 1; out.length < 10 && i <= 28; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      if (m.days.includes(d.getDay())) out.push(d);
    }
    return out;
  }, [now, m]);

  if (!m) return <div className="container section">Mentor tidak ditemukan. <Link href="/mentor"><u>Kembali</u></Link></div>;

  const pay = PAYMENTS.find((p) => p.key === payKey);
  const price = priceFor(m, dur);
  const total = price + ADMIN_FEE;
  const dateObj = dates.find((d) => ymd(d) === date);
  const dateLabel = dateObj ? dateObj.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) : "";
  const booked = (d, idx) => (m.id * 7 + d.getDate() * 3 + idx * 5) % 6 === 0; // contoh slot terisi
  const canSubmit = date && slot && agree && (!pay.sub || paySub);
  const related = mentors.filter((x) => x.category === m.category && x.id !== m.id).slice(0, 4);

  const submit = () => setDone({ code: `ORD-${m.id}${Date.now().toString().slice(-5)}` });
  const reset = () => { setDone(null); setDate(""); setSlot(""); setAgree(false); setNote(""); };

  const rows = [
    ["Kampus", m.campus], ["Jurusan", m.major], ["Angkatan", m.year],
    ["Bergabung", m.joined], ["Bahasa", m.languages.join(", ")], ["Respon", m.response],
  ];

  return (
    <div className="container section">
      <Link href="/mentor" className="muted back">← Semua mentor</Link>

      <div className="mprofile">
        {/* Kartu ID */}
        <aside className="idcard">
          <div className="idc-top"><span>MENTIFY</span><span>MENTOR ID</span></div>
          <div className="idc-photo"><MentorAvatar m={m} size="xl" /></div>
          <h1 className="idc-name">{m.name}</h1>
          <div className="row" style={{ justifyContent: "center" }}>
            <span className="badge pink">Mentor {m.category}</span>
            <span className="badge">✔ Terverifikasi</span>
          </div>
          <dl className="idc-rows">
            {rows.map(([k, v]) => <div key={k}><dt className="muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="idc-stats">
            <div><strong>⭐ {m.rating}</strong><span>{m.reviewCount} ulasan</span></div>
            <div><strong>{m.sessions}</strong><span>sesi</span></div>
            <div><strong>{m.students}</strong><span>mentee</span></div>
          </div>
          <p className="price">Mulai {rupiah(priceFor(m, 60))} / 60 menit</p>
          <a href="#pesan" className="btn">Pesan sesi</a>
          <div className="idc-barcode" aria-hidden="true" />
          <span className="idc-code">{m.code}</span>
        </aside>

        <div>
          {/* Tab informasi */}
          <section className="card">
            <div className="dtabs" role="tablist" aria-label="Informasi mentor">
              {TABS.map(([k, label]) => (
                <button key={k} role="tab" className="dtab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
            <div className="dpanel" role="tabpanel">
              {tab === "tentang" && (<>
                <p>{m.bio}</p>
                <h4 className="sub">Keahlian</h4>
                <div className="row">{m.tags.map((t) => <span key={t} className="badge">{t}</span>)}</div>
                <h4 className="sub">Yang bisa dibantu</h4>
                <ul className="check-grid">{m.help.map((h) => <li key={h}><span aria-hidden="true">✔</span>{h}</li>)}</ul>
                <h4 className="sub">Format sesi</h4>
                <p className="muted">Online via {FORMATS.join(", ")}. Jadwal tersedia: {m.days.map((d) => DAYS[d]).join(", ")}.</p>
              </>)}

              {tab === "prestasi" && (<>
                <ul className="check-grid">{m.achievements.map((a) => <li key={a}><span aria-hidden="true">🏆</span>{a}</li>)}</ul>
                <h4 className="sub">Pendidikan</h4>
                <p>{m.major}, {m.campus} (angkatan {m.year})</p>
              </>)}

              {tab === "cv" && (<>
                <h4 className="sub" style={{ marginTop: 0 }}>Ringkasan CV</h4>
                <div className="info-list">
                  <div><span>Pendidikan</span><strong>{m.major} · {m.year}</strong></div>
                  <div><span>Pengalaman lomba</span><strong>{m.achievements.length} prestasi</strong></div>
                  <div><span>Keahlian</span><strong>{m.tags.join(", ")}</strong></div>
                  <div><span>Pengalaman mentoring</span><strong>{m.sessions} sesi</strong></div>
                </div>
                <h4 className="sub">Dokumen terverifikasi</h4>
                <ul className="check-grid">
                  {m.docs.map(([d, s]) => <li key={d}><span aria-hidden="true">✔</span><span>{d}<br /><span className="badge">{s}</span></span></li>)}
                </ul>
                <p style={{ marginTop: 12 }}>
                  <button className="btn secondary" disabled>Unduh CV lengkap (PDF)</button>
                  <span className="muted"> Contoh, aktif setelah backend terhubung.</span>
                </p>
              </>)}

              {tab === "ulasan" && (<>
                <div className="rate-sum"><strong>⭐ {m.rating}</strong><span className="muted">dari {m.reviewCount} ulasan</span></div>
                {m.reviews.map((r, i) => (
                  <div key={i} className="rv">
                    <div className="row between"><strong>{r.by}</strong><span className="muted">{r.date}</span></div>
                    <span>{"⭐".repeat(r.stars)}</span><p className="muted">{r.text}</p>
                  </div>
                ))}
              </>)}
            </div>
          </section>

          {/* Pesan sesi */}
          <section className="card order" id="pesan">
            <h2>Pesan sesi dengan {m.name.split(" ")[0]}</h2>

            {done ? (
              <div className="ostep">
                <p className="badge pink" style={{ justifySelf: "start" }}>Pesanan diterima</p>
                <h3>Kode pesanan {done.code}</h3>
                <div className="summary">
                  <div><span>Jadwal</span><strong>{dateLabel}, {slot} WIB</strong></div>
                  <div><span>Durasi & format</span><strong>{dur} menit · {fmt}</strong></div>
                  <div><span>Pembayaran</span><strong>{payKey}{paySub ? ` – ${paySub}` : ""}</strong></div>
                  <div className="total"><span>Total</span><span>{rupiah(total)}</span></div>
                </div>
                <p className="muted">Selesaikan pembayaran, lalu tautan sesi dikirim ke email kamu. (Simulasi, belum ada transaksi nyata.)</p>
                <div className="row">
                  <button className="btn secondary" onClick={reset}>Pesan sesi lain</button>
                  <a className="btn" href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer">Hubungi admin</a>
                </div>
              </div>
            ) : (
              <>
                <div className="ostep"><h4>1. Pilih durasi</h4>
                  <div className="chips">{DURATIONS.map((d) => (
                    <button key={d} type="button" className={`chip ${dur === d ? "on" : ""}`} aria-pressed={dur === d} onClick={() => setDur(d)}>
                      {d} menit · {rupiah(priceFor(m, d))}</button>))}</div></div>

                <div className="ostep"><h4>2. Pilih tanggal</h4>
                  {dates.length ? (
                    <div className="chips">{dates.map((d) => (
                      <button key={ymd(d)} type="button" className={`chip ${date === ymd(d) ? "on" : ""}`} aria-pressed={date === ymd(d)}
                        onClick={() => { setDate(ymd(d)); setSlot(""); }}>
                        {d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</button>))}</div>
                  ) : <p className="muted">Memuat jadwal…</p>}</div>

                <div className="ostep"><h4>3. Pilih jam (WIB)</h4>
                  {dateObj ? (
                    <div className="slot-grid">{m.slots.map((s, idx) => (
                      <button key={s} type="button" className={`chip ${slot === s ? "on" : ""}`} disabled={booked(dateObj, idx)}
                        aria-pressed={slot === s} onClick={() => setSlot(s)}>{s}</button>))}</div>
                  ) : <p className="muted">Pilih tanggal terlebih dahulu.</p>}</div>

                <div className="ostep"><h4>4. Format sesi</h4>
                  <div className="chips">{FORMATS.map((f) => (
                    <button key={f} type="button" className={`chip ${fmt === f ? "on" : ""}`} aria-pressed={fmt === f} onClick={() => setFmt(f)}>{f}</button>))}</div></div>

                <div className="ostep"><h4>5. Metode pembayaran</h4>
                  <div className="pay-grid">{PAYMENTS.map((p) => (
                    <button key={p.key} type="button" className="pay" aria-pressed={payKey === p.key}
                      onClick={() => { setPayKey(p.key); setPaySub(""); }}>
                      <strong>{p.key}</strong><span className="muted">{p.note}</span></button>))}</div>
                  {pay.sub && (
                    <select value={paySub} onChange={(e) => setPaySub(e.target.value)} aria-label={`Pilih ${pay.key}`}>
                      <option value="">Pilih {pay.key === "Transfer Bank" ? "bank" : "e-wallet"}</option>
                      {pay.sub.map((s) => <option key={s}>{s}</option>)}
                    </select>)}</div>

                <div className="ostep"><h4>6. Catatan untuk mentor (opsional)</h4>
                  <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: saya ingin review naskah LKTI bab 2, lomba tutup 10 Desember." /></div>

                <div className="summary">
                  <div><span>Sesi {dur} menit</span><span>{rupiah(price)}</span></div>
                  <div><span>Biaya layanan</span><span>{rupiah(ADMIN_FEE)}</span></div>
                  <div className="total"><span>Total</span><span>{rupiah(total)}</span></div>
                </div>

                <div className="warn" role="note">
                  <span aria-hidden="true">⚠️</span>
                  <span>Jika terjadi hal yang tidak sesuai kesepakatan (mentor tidak hadir, jadwal diubah sepihak, atau kendala pembayaran),
                    segera hubungi admin Mentify di <a href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer"><strong>WhatsApp {ADMIN_WA.label}</strong></a>.
                    Sebaiknya lakukan seluruh pembayaran dan komunikasi lewat Mentify agar kamu terlindungi.</span>
                </div>

                <label className="agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>Saya menyetujui syarat dan ketentuan serta kebijakan penjadwalan ulang.</span></label>

                <button className="btn" disabled={!canSubmit} onClick={submit}>Pesan & bayar {rupiah(total)}</button>
              </>
            )}
          </section>
        </div>
      </div>

      {related.length > 0 && (<>
        <h2 style={{ margin: "32px 0 16px" }}>Mentor {m.category} lainnya</h2>
        <div className="grid-s">{related.map((r) => <MentorCard key={r.id} m={r} />)}</div>
      </>)}
    </div>
  );
}