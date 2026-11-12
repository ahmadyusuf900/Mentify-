"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Chibi } from "@/components/HeroArt";

// Tiap slide = satu keluhan nyata + solusi Mentify. Ubah teks di sini.
const SLIDES = [
  { role: "Pencari mentor", ac: "#7DA7D9", hair: "#3a2d5c", outfit: "#7DA7D9", style: "long",
    thought: "Mau ikut lomba esai, tapi nggak tahu harus mulai dari mana…",
    chats: ["Mentornya bisa dipercaya nggak ya? 🤔", "Takut salah pilih 😣"],
    title: "Dapat arahan dari yang pernah juara",
    points: ["Cari mentor by jenis lomba, kampus, harga, dan rating", "Lihat prestasi dan ulasan sebelum memesan", "Booking jadwal dan bayar dalam satu halaman"],
    cta: ["/mentor", "Cari mentor"] },
  { role: "Peserta lomba", ac: "#FF8A65", hair: "#1d2b3a", outfit: "#FF9F7A", style: "spiky",
    thought: "Info lomba nyebar di mana-mana, deadline-nya sering kelewat!",
    chats: ["Kemarin telat daftar lagi 😭", "Poster di story udah hilang…"],
    title: "Semua info lomba, satu tempat",
    points: ["Status buka/tutup dihitung otomatis dari tenggat", "Filter berdasarkan jenis, jenjang, lokasi, dan biaya", "Poster, hadiah, syarat, dan tautan resmi lengkap"],
    cta: ["/lomba", "Lihat info lomba"] },
  { role: "Pemburu materi", ac: "#6FD3A8", hair: "#c2477a", outfit: "#6FD3A8", style: "twin",
    thought: "Pengen lihat contoh esai juara, tapi nggak ada yang mau share…",
    chats: ["Template bagus itu mahal banget 💸", "Mau belajar dari yang menang"],
    title: "Materi langsung dari para juara",
    points: ["Esai juara, template, dan materi siap unduh", "Akun premium dapat kuota produk gratis tiap bulan", "Pembayaran QRIS, transfer, dan e-wallet"],
    cta: ["/marketplace", "Buka marketplace"] },
  { role: "Calon mentor", ac: "#B79AE8", hair: "#2b3a67", outfit: "#B79AE8", style: "bun",
    thought: "Aku pernah juara, tapi bingung gimana cara berbagi ilmunya…",
    chats: ["Pengen nambah uang saku 🙌", "Tapi jadwalnya susah diatur"],
    title: "Ubah pengalaman juara jadi penghasilan",
    points: ["Daftar dengan KTM, sertifikat, dan CV lalu diverifikasi", "Atur tarif dan hari tersedia sendiri", "Pantau sesi, pendapatan, dan level di dashboard"],
    cta: ["/login", "Daftar jadi mentor"] },
  { role: "Penyelenggara", ac: "#FFC94D", hair: "#5a3a24", outfit: "#FFD84D", style: "spiky",
    thought: "Lombaku sepi peserta, promosinya susah banget…",
    chats: ["Udah posting tapi nggak ada yang lihat", "Anggaran promo terbatas 😅"],
    title: "Jangkau peserta yang tepat",
    points: ["Pasang info lomba lengkap dengan poster dan jadwal", "Verifikasi penyelenggara agar dipercaya peserta", "Pantau tayangan dan jumlah pendaftar"],
    cta: ["/login", "Pasang info lomba"] },
  { role: "Penjual produk", ac: "#FF9EBB", hair: "#7a3b2e", outfit: "#FF9EBB", style: "long",
    thought: "Punya template bagus, tapi nggak tahu mau dijual di mana…",
    chats: ["Takut dibajak 😟", "Pembeli susah ditemukan"],
    title: "Buka lapak digitalmu",
    points: ["Aktivasi toko, lalu tambah katalog sendiri", "Pembeli datang dari komunitas peserta lomba", "Pantau penjualan dan omzet tiap produk"],
    cta: ["/login", "Mulai jualan"] },
];

export default function WhyMentify() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(null);
  const n = SLIDES.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (k) => setI((k + n) % n);

  return (
    <div className="wm" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="wm-tabs" role="tablist" aria-label="Pilih peranmu">
        {SLIDES.map((s, k) => (
          <button key={s.role} role="tab" aria-selected={i === k} className="wm-tab" style={{ "--ac": s.ac }} onClick={() => go(k)}>{s.role}</button>
        ))}
      </div>

      <div className="wm-view"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => { if (touch.current == null) return; const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)); touch.current = null; }}>
        <div className="wm-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {SLIDES.map((s, k) => (
            <article key={s.role} className="wm-slide" aria-hidden={i !== k} style={{ "--ac": s.ac }}>
              <div className="wm-scene">
                <div className="wm-thought"><p>{s.thought}</p></div>
                <span className="wm-chat c1">{s.chats[0]}</span>
                <span className="wm-chat c2">{s.chats[1]}</span>
                <svg viewBox="-70 -230 140 240" aria-hidden="true" className="wm-fig">
                  <Chibi x={0} y={0} s={1} hair={s.hair} outfit={s.outfit} style={s.style} flip={k % 2 === 1} />
                </svg>
              </div>
              <div className="wm-card">
                <span className="wm-eyebrow">Solusi Mentify · {s.role}</span>
                <h3>{s.title}</h3>
                <ul>{s.points.map((p) => <li key={p}><span aria-hidden="true">✔</span>{p}</li>)}</ul>
                <div><Link className="btn" href={s.cta[0]} tabIndex={i === k ? 0 : -1}>{s.cta[1]}</Link></div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wm-ctrl">
        <button className="wm-arrow" onClick={() => go(i - 1)} aria-label="Sebelumnya">‹</button>
        <div className="wm-dots">{SLIDES.map((s, k) => <button key={k} aria-label={`Slide ${k + 1}`} className={i === k ? "on" : ""} onClick={() => go(k)} />)}</div>
        <button className="wm-arrow" onClick={() => go(i + 1)} aria-label="Berikutnya">›</button>
      </div>
    </div>
  );
}
