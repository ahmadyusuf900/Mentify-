"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";

// Tiap peran punya alur sendiri setelah login (semua dummy, tanpa backend).
const ROLES = [
  { id: "pencari", icon: "🔍", label: "Pencari Mentor", desc: "Cari & pesan mentor", tab: "cari",
    flow: ["Masuk / daftar", "Cari mentor sesuai lomba", "Pilih jadwal & bayar sesi", "Ikut sesi bimbingan"] },
  { id: "mentor", icon: "🎓", label: "Mentor", desc: "Bagikan keahlian", tab: "mentor",
    flow: ["Masuk / daftar", "Isi profil & keahlian", "Unggah KTM, sertifikat & CV", "Bayar biaya aktivasi Rp 25.000", "Verifikasi admin → dashboard progres mentor"] },
  { id: "seller", icon: "🛒", label: "Penjual Produk", desc: "Jual materi digital", tab: "seller",
    flow: ["Masuk / daftar", "Isi info toko", "Verifikasi identitas", "Bayar aktivasi Rp 10.000", "Verifikasi admin → katalog & progres penjualan"] },
  { id: "organizer", icon: "🏆", label: "Penyelenggara", desc: "Pasang info lomba", tab: "organizer",
    flow: ["Masuk / daftar", "Isi info organisasi", "Verifikasi legalitas", "Bayar listing per lomba Rp 15.000", "Verifikasi admin → kelola lomba & pendaftar"] },
];

export default function Login() {
  const [mode, setMode] = useState("masuk");
  const [role, setRole] = useState("pencari");
  const [f, setF] = useState({ name: "", email: "", password: "", plan: "free" });
  const { login } = useUser();
  const router = useRouter();
  const cur = ROLES.find((r) => r.id === role);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    let old = {};
    try { old = JSON.parse(localStorage.getItem("mentify_user") || "{}"); } catch {}
    const same = old.email === f.email ? old : {};
    const roles = Array.from(new Set(["pencari", ...(same.roles || []), role]));
    login({
      name: f.name || same.name || f.email.split("@")[0],
      email: f.email,
      plan: same.plan || f.plan,
      roles,
      mentorStatus: same.mentorStatus || "none",
      sellerStatus: same.sellerStatus || "none",
      organizerStatus: same.organizerStatus || "none",
    });
    router.push(`/dashboard?tab=${cur.tab}`);
  };

  return (
    <div className="container section" style={{ maxWidth: 640, paddingInline: 16 }}>
      <h1 style={{ marginBottom: 4 }}>{mode === "masuk" ? "Masuk" : "Buat akun"}</h1>
      <p className="muted" style={{ marginBottom: 16 }}>Pilih peranmu, alurnya menyesuaikan. (Demo: data disimpan di browser, belum ada backend.)</p>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <button type="button" className={`btn ${mode === "masuk" ? "" : "secondary"}`} onClick={() => setMode("masuk")}>Masuk</button>
        <button type="button" className={`btn ${mode === "daftar" ? "" : "secondary"}`} onClick={() => setMode("daftar")}>Daftar</button>
      </div>

      <div className="rolepick" role="radiogroup" aria-label="Peran">
        {ROLES.map((r) => (
          <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className={`rolecard ${role === r.id ? "on" : ""}`} onClick={() => setRole(r.id)}>
            <span className="rc-i">{r.icon}</span><strong>{r.label}</strong><small>{r.desc}</small>
          </button>
        ))}
      </div>

      <div className="flowbox">
        <strong>Alur sebagai {cur.label}:</strong>
        <ol>{cur.flow.map((x) => <li key={x}>{x}</li>)}</ol>
      </div>

      <form className="form" onSubmit={submit}>
        {mode === "daftar" && (
          <label>Nama lengkap<input required value={f.name} onChange={set("name")} placeholder="Contoh: Budi Santoso" /></label>
        )}
        <label>Email<input type="email" required value={f.email} onChange={set("email")} placeholder="kamu@email.com" /></label>
        <label>Kata sandi<input type="password" required minLength={6} value={f.password} onChange={set("password")} placeholder="Min. 6 karakter" /></label>
        {mode === "daftar" && (
          <label>Paket (simulasi)
            <select value={f.plan} onChange={set("plan")}><option value="free">Free</option><option value="premium">Premium</option></select>
          </label>
        )}
        <button className="btn" style={{ marginTop: 6 }}>{mode === "masuk" ? `Masuk sebagai ${cur.label}` : `Daftar sebagai ${cur.label}`}</button>
      </form>
    </div>
  );
}
