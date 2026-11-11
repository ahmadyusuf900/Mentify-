import Link from "next/link";
import { ADMIN_WA } from "@/data/mentors";

const SOCIALS = [
  ["Instagram", "https://instagram.com/mentify.id"],
  ["TikTok", "https://tiktok.com/@mentify.id"],
  ["YouTube", "https://youtube.com/@mentify"],
];

export default function Footer() {
  return (
    <footer className="sitefooter">
      <div className="container sf-grid">
        <div className="sf-brand">
          <span className="logo">Menti<span>fy</span></span>
          <p>Platform mentor lomba mahasiswa, info lomba terbaru, dan marketplace materi juara dalam satu akun.</p>
          <div className="sf-social">
            {SOCIALS.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
            ))}
          </div>
        </div>

        <nav aria-label="Jelajahi">
          <h4>Jelajahi</h4>
          <ul>
            <li><Link href="/mentor">Cari mentor</Link></li>
            <li><Link href="/lomba">Info lomba</Link></li>
            <li><Link href="/marketplace">Marketplace</Link></li>
            <li><Link href="/login">Masuk / daftar</Link></li>
          </ul>
        </nav>

        <nav aria-label="Berkontribusi">
          <h4>Berkontribusi</h4>
          <ul>
            <li><Link href="/dashboard">Jadi mentor</Link></li>
            <li><Link href="/dashboard">Pasang info lomba</Link></li>
            <li><Link href="/dashboard">Jual produk digital</Link></li>
          </ul>
        </nav>

        <div>
          <h4>Hubungi kami</h4>
          <ul>
            <li><a href={ADMIN_WA.url} target="_blank" rel="noopener noreferrer">WhatsApp admin: {ADMIN_WA.label}</a></li>
            <li><a href="mailto:halo@mentify.id">halo@mentify.id</a></li>
            <li>Senin–Jumat, 09.00–17.00 WIB</li>
          </ul>
        </div>
      </div>

      <div className="sf-bottom">
        <div className="container">
          <span>© 2026 Mentify. Semua hak dilindungi.</span>
          <span>Syarat & Ketentuan · Kebijakan Privasi · FAQ</span>
        </div>
      </div>
    </footer>
  );
}