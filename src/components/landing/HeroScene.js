import { Chibi } from "@/components/HeroArt";
import { Em } from "@/components/Icon";

// Ilustrasi hero: maskot chibi + kartu statistik melayang (gaya contoh desain).
export default function HeroScene({ stats }) {
  return (
    <div className="hs">
      <svg className="hs-art" viewBox="0 0 460 440" role="img" aria-label="Ilustrasi mentor yang menyapa">
        <path d="M70 250c-30-70 20-170 120-190s190 10 215 90-20 160-100 215-190 40-235-115z" fill="#fff" opacity=".55" />
        <path d="M120 300c-20-60 30-120 100-130s140 30 130 100-80 120-150 110-70-30-80-80z" fill="#fff" opacity=".5" />
        <path className="hs-doodle" d="M40 120c30-40 80-45 95-15s-30 40-45 15 20-35 50-25" fill="none" stroke="#2F4860" strokeWidth="2.5" strokeLinecap="round" />
        <path className="hs-spark" d="M410 300l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="none" stroke="#2F4860" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M60 330l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="#FFD84D" />
        <path d="M380 60l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="#fff" />
        <Chibi x={215} y={420} s={1.75} hair="#3A2A5E" outfit="#7C5CFF" accent="#fff" style="spiky" wave />
      </svg>
      <ul className="hs-stats">
        {stats.map(([ico, n, label]) => (
          <li key={label}><span className="hs-ico" aria-hidden="true"><Em e={ico} /></span><div><strong>{n}</strong><small>{label}</small></div></li>
        ))}
      </ul>
    </div>
  );
}
