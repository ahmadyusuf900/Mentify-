import Link from "next/link";
import { mentors, ADMIN_WA } from "@/data/mentors";
import { lomba } from "@/data/lomba";
import { products, FREE_QUOTA } from "@/data/products";
import VideoProfile from "@/components/VideoProfile";
import Explorer from "@/components/landing/Explorer";
import WhyMentify from "@/components/landing/WhyMentify";
import ShowcaseTabs from "@/components/landing/ShowcaseTabs";
import PromoBanner from "@/components/landing/PromoBanner";
import HeroScene from "@/components/landing/HeroScene";
import SkyClouds from "@/components/landing/SkyClouds";
import { catMeta, CATEGORY_ORDER } from "@/data/categories";
import { Em, Icon, emo, Stars } from "@/components/Icon";

const ADV = [
  ["🎓", "Mentor mahasiswa terverifikasi", "Setiap mentor melampirkan KTM, sertifikat lomba, dan CV. Kamu bisa melihat prestasi dan ulasan sebelum memesan.", "yellow", "tk-s4"],
  ["🔑", "Satu akun, semua peran", "Cari mentor, jadi mentor, pasang info lomba, dan jual produk digital tanpa berganti akun.", "sky", "tk-s2"],
  ["🧾", "Harga dan jadwal jelas", "Tarif, durasi, jam tersedia, dan rincian biaya tampil sebelum kamu membayar.", "mint", "tk-s2"],
  ["🛟", "Ada tempat bertanya", "Jika sesi atau pembayaran tidak sesuai kesepakatan, kontak admin Mentify tersedia di halaman pemesanan.", "rose", "tk-s2"],
  ["📚", "Materi dari para juara", `Akun premium mendapat kuota ${FREE_QUOTA} produk gratis tiap bulan, akun free membayar per produk.`, "lilac", "tk-s2"],
  ["⏱️", "Status lomba selalu terbarui", "Buka atau tutupnya pendaftaran dihitung otomatis dari tenggat, jadi kamu tidak mendaftar ke lomba yang sudah lewat.", "coral", "tk-s6"],
];

const PROBLEMS = [
  ["🧭", "Bingung cari pembimbing", "Mentor yang pernah menang susah dicari, apalagi yang tarif dan jadwalnya jelas.", "coral", "tk-s2"],
  ["🔍", "Info lomba tercecer", "Poster tersebar di banyak grup dan akun, tenggat mudah terlewat.", "yellow", "tk-s2"],
  ["📉", "Materi belajar sulit dipercaya", "Contoh esai, proposal, dan template sering tidak jelas asalnya.", "lilac", "tk-s2"],
];

const SERVICES = [
  ["🎓", "Mentor Lomba", "Booking sesi bimbingan dengan mahasiswa berprestasi. Lihat prestasi, tarif, dan ulasan sebelum membayar.", "/mentor", "Cari mentor", "sky", "tk-s3"],
  ["🏆", "Info Lomba", "Daftar lomba terbaru dengan status buka atau tutup yang dihitung otomatis dari tenggat.", "/lomba", "Lihat lomba", "mint", "tk-s3"],
  ["📚", "Marketplace Produk Digital", "Esai juara, template, dan materi belajar dari para pemenang, siap diunduh.", "/marketplace", "Buka marketplace", "rose", "tk-s4"],
  ["🧑‍🏫", "Jadi Mentor atau Penjual", "Punya pengalaman menang? Bagikan sebagai mentor, pasang info lomba, atau jual produkmu.", "/login", "Mulai berbagi", "yellow", "tk-s2"],
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
      {/* Hero: background awan + layout 2 kolom */}
      <section className="lp-hero">
        <SkyClouds />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-pill"><Em e="✨" /> Mentor lomba · Info lomba · Produk digital</span>
            <h1><span>Menang lomba dimulai</span> <em>dari mentor yang tepat</em></h1>
            <p>Booking mentor mahasiswa berpengalaman, pantau info lomba terbaru, dan beli materi dari para juara. Semua dalam satu akun.</p>
            <div className="cta">
              <Link className="btn" href="/mentor">Cari mentor →</Link>
              <Link className="btn ghost" href="/lomba">▶ Lihat info lomba</Link>
            </div>
            <ul className="lp-points">
              <li><b><Icon name="check" /></b>Mentor terverifikasi</li><li><b><Icon name="check" /></b>Info lomba terkini</li><li><b><Icon name="check" /></b>Materi dari juara</li>
            </ul>
            <div className="hero-proof">
              <span className="hp-stars" aria-hidden="true"><Stars /></span>
              <span>Rating rata-rata mentor <strong>{avg}</strong></span>
            </div>
          </div>
          <HeroScene stats={[["🎓", mentors.length, "Mentor mahasiswa"], ["🏆", lomba.length, "Info lomba"], ["📚", products.length, "Produk digital"]]} />
        </div>
      </section>

      {/* Strip jenis lomba (gaya "trusted by") */}
      <section className="container strip-wrap">
        <div className="strip">
          <p>Siap membantu berbagai jenis lomba</p>
          <ul>
            {CATEGORY_ORDER.slice(0, 7).map((c) => (
              <li key={c} style={{ "--c1": catMeta(c)[1], "--c2": catMeta(c)[2] }}><i aria-hidden="true"><Em e={catMeta(c)[0]} /></i>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Banner promo auto-slide ke kiri + menu layanan (gaya Ruangguru) */}
      <PromoBanner />
      <section className="container">
        <nav className="svc-grid" aria-label="Layanan">
          {[["🎓","Cari Mentor","/mentor"],["🏆","Info Lomba","/lomba"],["📚","Marketplace","/marketplace"],["🧑‍🏫","Jadi Mentor","/login"],["📝","Esai Juara","/marketplace"],["🎨","Template","/marketplace"],["📣","Pasang Lomba","/login"],["🛍️","Jual Produk","/login"]].map(([i,l,h])=>(
            <Link key={l} href={h} className="svc"><i><Em e={i} /></i>{l}</Link>
          ))}
        </nav>
      </section>

      {/* Masalah */}
      <section className="tk-sec grid-bg">
        <div className="container">
          <div className="tk-head">
            <span className="tk-pill">Masalahnya</span>
            <h2>Ikut lomba itu seru. Persiapannya yang bikin pusing.</h2>
            <p>Hampir semua pelajar dan mahasiswa pernah mengalaminya: niat ikut lomba, tapi bingung harus mulai dari mana.</p>
          </div>
          <div className="tk-bento">
            {PROBLEMS.map(([ico, t, d, c, sp]) => (
              <article key={t} className={`tk-card tk-${c} ${sp}`}>
                <span className="ico" aria-hidden="true"><Em e={ico} /></span>
                <h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Solusi / layanan */}
      <section className="tk-sec">
        <div className="container">
          <div className="tk-head">
            <span className="tk-pill">Solusinya: Mentify</span>
            <h2>Satu tempat untuk mentor, info lomba, dan materi belajar</h2>
            <p>Mentify mempertemukan kamu dengan mahasiswa berprestasi yang sudah pernah menang, lalu menyatukan semua kebutuhan persiapan lomba dalam satu akun.</p>
          </div>
          <div className="tk-bento">
            {SERVICES.map(([ico, t, d, href, cta, c, sp]) => (
              <article key={t} className={`tk-card tk-${c} ${sp}`}>
                <span className="ico" aria-hidden="true"><Em e={ico} /></span>
                <h3>{t}</h3><p>{d}</p>
                <Link className="tk-link" href={href}>{cta} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      {/* Fitur & benefit */}
      <section className="tk-sec grid-bg">
        <div className="container">
          <div className="tk-head">
            <span className="tk-pill">Fitur &amp; benefit</span>
            <h2>Kenapa memilih Mentify</h2>
            <p>Dibuat oleh dan untuk mahasiswa yang sering ikut lomba, jadi kami tahu apa yang kamu butuhkan.</p>
          </div>
          <div className="tk-bento">
            {ADV.map(([icon, title, desc, c, sp]) => (
              <article key={title} className={`tk-card tk-${c} ${sp}`}>
                <span className="ico" aria-hidden="true"><Em e={icon} /></span>
                <h3>{title}</h3><p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Panel: di dalam Mentify */}
      <section className="tk-sec">
        <div className="container">
          <div className="inside">
            <div className="inside-copy">
              <span className="tk-pill">Di dalam Mentify</span>
              <h2>Satu akun, semua kebutuhan lomba</h2>
              <p className="muted">Cari, bandingkan, lalu pesan. Semuanya terlihat jelas sebelum kamu bayar.</p>
              <ul className="inside-list">
                {[["🔎", "Cari cepat", "Filter jenis lomba, kampus, harga"], ["⭐", "Ulasan nyata", "Dari peserta yang sudah ikut sesi"], ["🧾", "Invoice jelas", "Rincian biaya sebelum bayar"], ["📱", "Ramah HP", "Akses dari mana saja"]].map(([i, t, d]) => (
                  <li key={t}><span aria-hidden="true"><Em e={i} /></span><div><strong>{t}</strong><small>{d}</small></div></li>
                ))}
              </ul>
            </div>
            <div className="inside-ui" aria-label="Contoh daftar mentor">
              <div className="iu-bar"><span aria-hidden="true"><Em e="🔎" /></span> Cari mentor, lomba, atau produk…</div>
              {mentors.slice(0, 3).map((m) => (
                <Link key={m.id} href={`/mentor/${m.id}`} className="iu-row">
                  <img src={m.photo} alt="" width="56" height="56" />
                  <div><strong>{m.name}</strong><small>{m.category} · {m.campus}</small></div>
                  <span className="iu-price">Rp{m.price.toLocaleString("id-ID")}</span>
                  <span className="iu-go">Lihat</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explorer */}
      <section className="band band-fun">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Mulai dari lombamu</span>
            <h2>Pilih jenis lomba, lihat apa yang kami siapkan</h2>
            <p className="muted">Satu kategori, tiga jalan: mentor yang membimbing, lomba yang bisa diikuti, dan materi untuk belajar.</p>
          </div>
          <Explorer />
        </div>
      </section>

      {/* Keluhan + solusi (slide otomatis) */}
      <section className="band band-sky">
        <div className="container">
          <div className="lp-head">
            <span className="eyebrow">Apa yang Mentify tawarkan untukmu</span>
            <h2>Semua yang kamu butuhkan untuk siap lomba</h2>
            <p className="muted">Keluhan yang sering kita alami saat mau ikut lomba, dan bagaimana Mentify membantunya.</p>
          </div>
          <WhyMentify />
        </div>
      </section>

      {/* Tentang kami */}
      <section className="tk-sec grid-bg">
        <div className="container">
          <div className="tk-about">
            <div>
              <span className="tk-pill">Tentang kami</span>
              <h2>Dibuat oleh pelomba, untuk para pelomba</h2>
              <p>Mentify lahir dari pengalaman sendiri: sulitnya menemukan pembimbing yang tepat dan informasi lomba yang rapi. Kami ingin pengalaman juara bisa dipelajari siapa saja.</p>
              <p>Misi kami sederhana: membuat persiapan lomba lebih terarah, terjangkau, dan dapat dipercaya.</p>
              <div className="cta" style={{ marginTop: 18 }}><Link className="btn" href="/login">Gabung Mentify</Link></div>
            </div>
            <div className="tk-vals">
              {[["🤝", "Terpercaya", "Mentor diverifikasi lebih dulu.", "mint"], ["🔎", "Transparan", "Biaya terlihat sebelum bayar.", "yellow"], ["🌱", "Terjangkau", "Ada materi gratis tiap bulan.", "sky"], ["💬", "Responsif", "Admin siap membantu.", "rose"]].map(([i, t, d, c]) => (
                <article key={t} className={`tk-card tk-${c}`}><span className="ico" aria-hidden="true"><Em e={i} /></span><h3>{t}</h3><p>{d}</p></article>
              ))}
            </div>
          </div>
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
          <span className="cta-trophy" aria-hidden="true"><Em e="🏆" /></span>
          <div className="cta-copy">
            <h2>Mulai persiapan lombamu hari ini</h2>
            <p>Buat akun gratis, lalu cari mentor, pantau lomba, atau jual materi dari pengalamanmu.</p>
          </div>
          <div className="cta">
            <Link className="btn" href="/login">Buat akun gratis →</Link>
            <Link className="btn ghost" href="/mentor">Jelajahi mentor</Link>
          </div>
        </div>
      </section>
    </>
  );
}
