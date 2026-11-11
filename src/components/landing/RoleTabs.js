"use client";
import { useState } from "react";
import Link from "next/link";

const ROLES = [
  { key: "mentee", tab: "Pencari mentor", title: "Dapat arahan dari yang pernah menang",
    problem: "Bingung mulai dari mana dan tidak tahu siapa yang bisa dipercaya untuk membimbing.",
    points: [
      "Cari mentor berdasarkan jenis lomba, kampus, harga, dan rating",
      "Lihat profil lengkap, prestasi, dan ulasan sebelum memesan",
      "Pilih tanggal, jam, dan metode pembayaran dalam satu halaman",
      "Hubungi admin jika ada hal yang tidak sesuai kesepakatan",
    ], cta: ["/mentor", "Cari mentor"] },
  { key: "mentor", tab: "Mentor", title: "Ubah pengalaman lomba jadi penghasilan",
    problem: "Punya pengalaman juara, tapi sulit menjangkau peserta dan mengatur jadwal.",
    points: [
      "Daftar dengan KTM, sertifikat lomba, dan CV, lalu menunggu verifikasi",
      "Tentukan tarif dan hari tersedia sendiri",
      "Jual esai juara dan materi sebagai produk digital",
      "Kelola semuanya dari satu dashboard",
    ], cta: ["/dashboard", "Daftar jadi mentor"] },
  { key: "org", tab: "Penyelenggara & kreator", title: "Jangkau peserta dan pembeli yang tepat",
    problem: "Info lomba mudah tenggelam di media sosial dan karya sulit ditemukan pembeli.",
    points: [
      "Pasang info lomba lengkap dengan poster, jadwal, hadiah, dan tautan resmi",
      "Lomba yang lewat tenggat otomatis ditandai tutup",
      "Jual template, esai, dan materi dengan harga yang kamu tentukan",
      "Pengguna premium ikut mengakses produk lewat kuota bulanan",
    ], cta: ["/dashboard", "Buka dashboard"] },
];

export default function RoleTabs() {
  const [k, setK] = useState(ROLES[0].key);
  const r = ROLES.find((x) => x.key === k);
  return (
    <div className="rt">
      <div className="rt-tabs" role="tablist" aria-label="Pilih peranmu">
        {ROLES.map((x) => (
          <button key={x.key} role="tab" className="rt-tab" aria-selected={k === x.key} onClick={() => setK(x.key)}>{x.tab}</button>
        ))}
      </div>
      <div className="rt-panel" role="tabpanel" key={r.key}>
        <h3>{r.title}</h3>
        <p className="rt-problem"><strong>Tantangannya:</strong> {r.problem}</p>
        <h4 className="sub" style={{ margin: 0 }}>Solusi di Mentify</h4>
        <ul className="check-grid">
          {r.points.map((p) => <li key={p}><span aria-hidden="true">✔</span>{p}</li>)}
        </ul>
        <div><Link className="btn" href={r.cta[0]}>{r.cta[1]}</Link></div>
      </div>
    </div>
  );
}