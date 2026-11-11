import Link from "next/link";
import { lomba } from "@/data/lomba";
import { products } from "@/data/products";
import { mentors } from "@/data/mentors";

// Banner poster yang bergeser otomatis ke kiri (CSS marquee, berhenti saat di-hover).
const top = [...mentors].sort((a, b) => b.rating - a.rating)[0];
const BANNERS = [
  { href: "/mentor", g: "pb-a", tag: "Mentor", t: "Booking mentor juara mulai Rp 50 rb", s: `${mentors.length} mentor mahasiswa terverifikasi`, icon: "🎓" },
  { href: "/lomba", g: "pb-b", tag: "Info Lomba", t: `${lomba.length} lomba terbuka bulan ini`, s: "Esai, business case, UI/UX, debat", icon: "🏆" },
  { href: "/marketplace", g: "pb-c", tag: "Marketplace", t: "Esai juara & template siap unduh", s: `${products.length} produk digital pilihan`, icon: "📚" },
  { href: "/login", g: "pb-d", tag: "Jadi Mentor", t: "Bagikan pengalaman lombamu", s: "Daftar, verifikasi, mulai dapat penghasilan", icon: "💡" },
  { href: "/login", g: "pb-e", tag: "Penyelenggara", t: "Pasang info lombamu di sini", s: "Jangkau ribuan mahasiswa", icon: "📣" },
  { href: `/mentor/${top.id}`, g: "pb-f", tag: "Mentor terbaik", t: top.name, s: `Rating ${top.rating} · ${top.campus}`, icon: "⭐" },
];

export default function PromoBanner() {
  const row = (k) => BANNERS.map((b, i) => (
    <Link key={k + i} href={b.href} className={`pb-card ${b.g}`} tabIndex={k ? -1 : 0} aria-hidden={k ? "true" : undefined}>
      <span className="pb-tag">{b.tag}</span>
      <strong>{b.t}</strong>
      <span className="pb-sub">{b.s}</span>
      <span className="pb-ico" aria-hidden="true">{b.icon}</span>
    </Link>
  ));
  return (
    <section className="pb-wrap" aria-label="Promo dan program">
      <div className="marquee pb-marquee">
        <div className="marquee-track" style={{ animationDuration: "40s" }}>
          {row(0)}{row(1)}
        </div>
      </div>
    </section>
  );
}
