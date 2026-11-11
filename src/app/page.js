import Link from "next/link";
import { mentors, ADMIN_WA } from "@/data/mentors";
import { lomba } from "@/data/lomba";
import { products, FREE_QUOTA } from "@/data/products";
import VideoProfile from "@/components/VideoProfile";
import Stats from "@/components/landing/Stats";
import Explorer from "@/components/landing/Explorer";
import RoleTabs from "@/components/landing/RoleTabs";
import ShowcaseTabs from "@/components/landing/ShowcaseTabs";
import PromoBanner from "@/components/landing/PromoBanner";

// [top %, lebar, tinggi, durasi detik, delay detik, opacity]
const CLOUDS = [
  [10, 190, 48, 70, -12, 0.85], [26, 270, 62, 95, -55, 0.7], [44, 150, 40, 60, -30, 0.8],
  [58, 330, 70, 110, -75, 0.55], [18, 120, 34, 80, -62, 0.6],
];

const ADV = [
  ["🎓", "Mentor mahasiswa terverifikasi", "Setiap mentor melampirkan KTM, sertifikat lomba, dan CV. Kamu bisa melihat prestasi dan ulasan sebelum memesan."],
  ["🔑", "Satu akun untuk semua peran", "Cari mentor, jadi mentor, pasang info lomba, dan jual produk digital tanpa berganti akun."],
  ["🧾", "Harga dan jadwal yang jelas", "Tarif, durasi, jam tersedia, dan rincian biaya tampil sebelum kamu membayar."],
  ["🛟", "Ada tempat bertanya saat bermasalah", "Jika sesi atau pembayaran tidak sesuai kesepakatan, kontak admin Mentify tersedia di halaman pemesanan."],
  ["📚", "Materi dari para juara", `Akun premium mendapat kuota ${FREE_QUOTA} produk gratis tiap bulan, akun free membayar per produk.`],
  ["⏱️", "Status lomba selalu terbarui", "Buka atau tutupnya pendaftaran dihitung otomatis dari tenggat, jadi kamu tidak mendaftar ke lomba yang sudah lewat."],
];

const TILES = [
  ["bt-sky", "", "/mentor", "Cari mentor yang pas", "Filter berdasarkan jenis lomba, kampus, harga, rating, dan ketersediaan akhir pekan.",
    [{ t: "Esai/LKTI" }, { t: "UI/UX" }, { t: "Debat" }, { t: "Rating 4,8+", c: "pink" }]],
  ["bt-white", "", "/mentor", "Pesan sesi tanpa ribet", "Pilih durasi, tanggal, jam, dan metode pembayaran dalam satu alur.",
    [{ t: "60 menit" }, { t: "Google Meet" }, { t: "QRIS", c: "pink" }]],
  ["bt-white", "s2", "/lomba", "Info lomba terbaru", "Status buka atau tutup otomatis, lengkap dengan hitungan hari.",
    [{ t: "H-3", c: "pink" }, { t: "Tutup", c: "gray" }]],
  ["bt-cream", "s2", "/marketplace", "Marketplace materi juara", "Esai juara, template, dan materi persiapan yang siap diunduh.", []],
  ["bt-white", "s2", "/dashboard", "Dashboard satu akun", "Daftar jadi mentor, tambah info lomba, dan jual produk dari satu tempat.", []],
  ["bt-navy", "s6", "/marketplace", "Premium: produk gratis tiap bulan", `Akun premium mendapat kuota ${FREE_QUOTA} produk digital gratis per bulan. Akun free membayar per produk.`, []],
];

const FAQ = [
  ["Siapa yang bisa menjadi mentor?", "Mahasiswa aktif. Kamu perlu melampirkan KTM, sertifikat lomba, dan CV yang kami verifikasi lebih dulu."],
  ["Berapa biaya satu sesi?", "Tiap mentor menentukan tarifnya sendiri. Rincian biaya, termasuk biaya layanan, tampil sebelum kamu membayar."],
  ["Apa bedanya akun free dan premium?", `Akun premium mendapat kuota ${FREE_QUOTA} produk digital gratis per bulan. Akun free membayar untuk setiap produk.`],
  ["Bagaimana jika sesi tidak sesuai kesepakatan?", `Hubungi admin Mentify lewat WhatsApp ${ADMIN_WA.label}. Lakukan pembayaran dan komunikasi lewat Mentify agar terlindungi.`],
  ["Apakah satu akun bisa dipakai untuk semua peran?", "Bisa. Satu akun dapat mencari mentor, menjadi mentor, memasang info lomba, dan menjual produk digital."],
];

const avg = Math.round((mentors.reduce((s, m) => s + m.rating, 0) / mentors.length) * 10) / 10;
const STATS = [
  [mentors.length, 0, "", "Mentor mahasiswa"], [lomba.length, 0, "", "Info lomba"],
  [products.length, 0, "", "Produk digital"], [avg, 1, "", "Rating rata-rata mentor"],
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="lp-hero">
        {CLOUDS.map(([top, w, h, dur, delay, op], i) => (
          <span key={i} className="cloud" style={{ top: `${top}%`, width: w, height: h, animationDuration: `${dur}s`, animationDelay: `${delay}s`, opacity: op }} />
        ))}
        <div className="container">
          <span className="lp-tag">Mentor lomba · Info lomba · Produk digital</span>
          <h1>Menang lomba dimulai dari mentor yang tepat</h1>
          <p>Booking mentor mahasiswa berpengalaman, pantau info lomba terbaru, dan beli materi dari para juara. Semua dalam satu akun.</p>
          <div className="cta">
            <Link className="btn" href="/mentor">Cari mentor</Link>
            <Link className="btn ghost" href="/lomba">Lihat info lomba</Link>
          </div>
          <ul className="lp-points">
            <li>✔ Mentor terverifikasi</li><li>✔ Info lomba terkini</li><li>✔ Materi dari juara</li>
          </ul>
        </div>
        <svg className="lp-clouds" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
          <path className="c2" d="M0 140V96a80 44 0 0 1 160 0a60 36 0 0 1 120 0a90 50 0 0 1 180 0a70 40 0 0 1 140 0a55 32 0 0 1 110 0a95 52 0 0 1 190 0a65 38 0 0 1 130 0a75 42 0 0 1 150 0a60 34 0 0 1 120 0a70 40 0 0 1 140 0V140z" />
          <path className="c1" d="M0 140V105a60 38 0 0 1 120 0a90 52 0 0 1 180 0a50 30 0 0 1 100 0a80 46 0 0 1 160 0a70 40 0 0 1 140 0a100 56 0 0 1 200 0a55 32 0 0 1 110 0a75 42 0 0 1 150 0a65 38 0 0 1 130 0a75 42 0 0 1 150 0V140z" />
        </svg>
      </section>

      {/* Banner promo auto-slide ke kiri + menu layanan (gaya Ruangguru) */}
      <PromoBanner />
      <section className="container">
        <nav className="svc-grid" aria-label="Layanan">
          {[["🎓","Cari Mentor","/mentor"],["🏆","Info Lomba","/lomba"],["📚","Marketplace","/marketplace"],["🧑‍🏫","Jadi Mentor","/login"],["📝","Esai Juara","/marketplace"],["🎨","Template","/marketplace"],["📣","Pasang Lomba","/login"],["🛍️","Jual Produk","/login"]].map(([i,l,h])=>(
            <Link key={l} href={h} className="svc"><i>{i}</i>{l}</Link>
          ))}
        </nav>
      </section>

      {/* Statistik */}
      <section className="container"><Stats items={STATS} /></section>

      {/* Showcase: auto-slide tiga tab Mentor / Lomba / Produk */}
      <section className="band">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Temukan yang terbaik</span>
            <h2>Mentor, lomba, dan produk pilihan</h2>
            <p className="muted">Pilih kategori dan jelajahi konten terpilih dari Mentify.</p>
          </div>
          <ShowcaseTabs />
        </div>
      </section>

      {/* Video profil, di tengah */}
      <section className="band band-sky">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Video profil</span>
            <h2>Kenali Mentify dalam 2 menit</h2>
            <p className="muted">Lihat bagaimana mentor, info lomba, dan marketplace bekerja bersama.</p>
          </div>
          <VideoProfile />
        </div>
      </section>

      {/* Keunggulan */}
      <section className="band">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Keunggulan</span>
            <h2>Kenapa memilih Mentify</h2>
            <p className="muted">Dibuat oleh dan untuk mahasiswa yang sering ikut lomba, jadi kami tahu apa yang dibutuhkan.</p>
          </div>
          <div className="adv-grid">
            {ADV.map(([icon, title, desc]) => (
              <article key={title} className="adv-card">
                <span className="adv-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3>
                <p className="muted">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Explorer */}
      <section className="band band-navy">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Mulai dari lombamu</span>
            <h2>Pilih jenis lomba, lihat apa yang kami siapkan</h2>
            <p className="muted">Satu kategori, tiga jalan: mentor yang membimbing, lomba yang bisa diikuti, dan materi untuk belajar.</p>
          </div>
          <Explorer />
        </div>
      </section>

      {/* Fitur */}
      <section className="band">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Fitur</span>
            <h2>Semua yang kamu butuhkan untuk siap lomba</h2>
          </div>
          <div className="bento">
            {TILES.map(([tone, span, href, title, desc, demo]) => (
              <Link key={title} href={href} className={`bt ${tone} ${span}`}>
                <h3>{title}</h3>
                <p className="muted">{desc}</p>
                {demo.length > 0 && <div className="demo-row">{demo.map((d) => <span key={d.t} className={`badge ${d.c || ""}`}>{d.t}</span>)}</div>}
                <span className="bt-go">Coba sekarang →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Solusi per peran */}
      <section className="band band-sky">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Solusi</span>
            <h2>Apa yang Mentify tawarkan untukmu</h2>
          </div>
          <RoleTabs />
        </div>
      </section>

      {/* FAQ */}
      <section className="band">
        <div className="container">
          <div className="lp-head"><span className="eyebrow">FAQ</span><h2>Pertanyaan yang sering muncul</h2></div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p className="muted">{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* Ajakan */}
      <section className="container" style={{ paddingBottom: 8 }}>
        <div className="lp-cta">
          <h2>Mulai persiapan lombamu hari ini</h2>
          <p>Buat akun gratis, lalu cari mentor, pantau lomba, atau jual materi dari pengalamanmu.</p>
          <div className="cta">
            <Link className="btn" href="/login">Buat akun gratis</Link>
            <Link className="btn ghost" href="/mentor">Jelajahi mentor</Link>
          </div>
        </div>
      </section>
    </>
  );
}