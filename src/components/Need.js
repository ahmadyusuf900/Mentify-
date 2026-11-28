"use client";
import { Icon } from "@/components/Icon";

// Daftar langkah yang masih perlu dilengkapi sebelum bisa lanjut ke pembayaran.
export default function Need({ checks, tried }) {
  const left = checks.filter(([ok]) => !ok).length;
  if (left === 0) return <p className="need-ok" role="status"><Icon name="check" size={16} /> Semua sudah lengkap. Kamu bisa lanjut ke pembayaran.</p>;
  return (
    <div id="need-box" className={`need ${tried ? "tried" : ""}`} role="status" aria-live="polite">
      <strong>{tried ? `Belum bisa lanjut, ada ${left} hal yang perlu dilengkapi:` : "Sebelum lanjut, lengkapi dulu:"}</strong>
      <ul>
        {checks.map(([ok, t]) => (
          <li key={t} className={ok ? "done" : ""}><span aria-hidden="true">{ok ? <Icon name="check" size={14} /> : "•"}</span>{ok ? t.replace(/^(Pilih|Isi|Centang)/, (m) => ({ Pilih: "Sudah memilih", Isi: "Sudah mengisi", Centang: "Sudah mencentang" }[m])).replace(/Email belum valid.*/, "Email valid") : t}</li>
        ))}
      </ul>
    </div>
  );
}
