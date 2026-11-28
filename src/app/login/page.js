"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Icon, IconBadge } from "@/components/Icon";
import { Chibi } from "@/components/HeroArt";

// Tiap peran punya alur sendiri setelah login (semua dummy, tanpa backend).
const ROLES = [
  { id: "pencari", icon: "search", label: "Pencari Mentor", desc: "Cari & pesan mentor", tab: "cari",
    flow: ["Masuk / daftar", "Cari mentor sesuai lomba", "Pilih jadwal & bayar sesi", "Ikut sesi bimbingan"] },
  { id: "mentor", icon: "grad", label: "Mentor", desc: "Bagikan keahlian", tab: "mentor",
    flow: ["Masuk / daftar", "Isi profil & keahlian", "Unggah KTM, sertifikat & CV (gratis)", "Verifikasi admin → terima 90% tiap sesi"] },
  { id: "seller", icon: "store", label: "Penjual Produk", desc: "Jual materi digital", tab: "seller",
    flow: ["Masuk / daftar", "Isi info toko", "Verifikasi identitas (gratis)", "Verifikasi admin → jual produk, komisi 10%"] },
  { id: "organizer", icon: "trophy", label: "Penyelenggara", desc: "Pasang info lomba", tab: "organizer",
    flow: ["Masuk / daftar", "Isi info organisasi", "Verifikasi legalitas", "Tayang Rp 15.000 per bulan per lomba"] },
];

export default function Login() {
  const [mode, setMode] = useState("masuk");
  const [role, setRole] = useState("pencari");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [note, setNote] = useState("");
  const { user: me, ready, login, logout } = useUser();
  const router = useRouter();
  const cur = ROLES.find((r) => r.id === role);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e, demo) => {
    e?.preventDefault?.();
    if (demo) { f.email = demo + "@demo.id"; f.name = f.name || "Pengguna " + demo; }
    let old = {};
    try { old = JSON.parse(localStorage.getItem("mentify_user") || "{}"); } catch {}
    const same = old.email === f.email ? old : {};
    const roles = Array.from(new Set(["pencari", ...(same.roles || []), role]));
    login({
      name: f.name || same.name || f.email.split("@")[0],
      email: f.email,
      roles,
      mentorStatus: same.mentorStatus || "none",
      sellerStatus: same.sellerStatus || "none",
      organizerStatus: same.organizerStatus || "none",
    });
    router.push(`/dashboard?tab=${cur.tab}`);
  };

  if (ready && me) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ gridTemplateColumns: "1fr", maxWidth: 520 }}>
          <div className="auth-form" style={{ textAlign: "center", display: "grid", gap: 14, padding: 28 }}>
            <h1 style={{ fontFamily: "var(--fd)" }}>Kamu sudah masuk</h1>
            <p className="muted">Masuk sebagai <strong>{me.name}</strong> ({me.email}). Untuk ganti akun atau peran, keluar dulu.</p>
            <div className="row" style={{ justifyContent: "center" }}>
              <button className="btn" onClick={() => router.push("/dashboard")}>Ke dashboard</button>
              <button className="btn secondary" onClick={logout}>Keluar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-art" aria-hidden="true">
          <svg viewBox="0 0 420 560" preserveAspectRatio="xMidYMax meet">
            <defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFE3FF" /><stop offset="1" stopColor="#E3D9FF" /></linearGradient></defs>
            <rect width="420" height="560" fill="url(#ag)" />
            <circle cx="210" cy="330" r="170" fill="#fff" opacity=".55" />
            <circle cx="350" cy="90" r="46" fill="#FFE98A" opacity=".8" />
            <path d="M60 120l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" fill="#fff" />
            <path d="M340 250l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#7C5CFF" opacity=".6" />
            <rect x="70" y="486" width="280" height="14" rx="7" fill="#9DB6DA" opacity=".7" />
            <Chibi x={150} y={490} s={1.55} hair="#3A2A5E" outfit="#7C5CFF" accent="#fff" style="spiky" wave />
            <Chibi x={295} y={494} s={1.3} hair="#E0709A" outfit="#2F4860" accent="#FFD84D" style="twin" flip />
          </svg>
          <div className="auth-copy">
            <h2>Mentor yang tepat, lomba terasa lebih dekat</h2>
            <p>Booking mentor, pantau lomba, dan belajar dari para juara.</p>
          </div>
          <span className="auth-float af1"><Icon name="shield" /> Mentor terverifikasi</span>
          <span className="auth-float af2"><Icon name="trophy" /> Info lomba terbaru</span>
        </aside>

        <section className="auth-form">
          <Logo href="/" />
          <h1>{mode === "masuk" ? "Masuk ke akunmu" : "Buat akun Mentify"}</h1>
          <p className="muted auth-sub">{mode === "masuk" ? "Selamat datang kembali! Pilih perananmu lalu masuk." : "Gratis. Satu akun bisa dipakai untuk semua peran."}</p>

          <div className="auth-roles" role="radiogroup" aria-label="Peran">
            {ROLES.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className={`auth-role ${role === r.id ? "on" : ""}`} onClick={() => setRole(r.id)}>
                <IconBadge name={r.icon} tone={role === r.id ? "sun" : "sky"} size={34} />
                <span>{r.label}</span>
              </button>
            ))}
          </div>
          <details className="auth-flow">
            <summary>Lihat alur sebagai {cur.label}</summary>
            <ol>{cur.flow.map((x) => <li key={x}>{x}</li>)}</ol>
          </details>

          <form onSubmit={submit}>
            {mode === "daftar" && (
              <label className="auth-field"><span>Nama lengkap</span>
                <div className="auth-input"><Icon name="users" /><input required value={f.name} onChange={set("name")} placeholder="Contoh: Budi Santoso" /></div>
              </label>
            )}
            <label className="auth-field"><span>Email</span>
              <div className="auth-input"><Icon name="mail" /><input type="email" required value={f.email} onChange={set("email")} placeholder="kamu@email.com" /></div>
            </label>
            <label className="auth-field"><span>Kata sandi</span>
              <div className="auth-input"><Icon name="lock" />
                <input type={show ? "text" : "password"} required minLength={6} value={f.password} onChange={set("password")} placeholder="Min. 6 karakter" />
                <button type="button" className="auth-eye" onClick={() => setShow(!show)} aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}><Icon name={show ? "eyeoff" : "eye"} /></button>
              </div>
            </label>
            {mode === "masuk" && (
              <div className="auth-row">
                <label className="auth-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Ingat saya</label>
                <button type="button" className="auth-link" onClick={() => setNote("Reset kata sandi belum tersedia di versi demo.")}>Lupa kata sandi?</button>
              </div>
            )}
            {note && <p className="auth-note" role="status">{note}</p>}
            <button className="btn auth-submit">{mode === "masuk" ? `Masuk sebagai ${cur.label}` : `Daftar sebagai ${cur.label}`}</button>
          </form>

          <div className="auth-or"><span>atau lanjut dengan</span></div>
          <div className="auth-social">
            <button type="button" onClick={() => submit(null, "google")}><Icon name="mail" /> Google (demo)</button>
            <button type="button" onClick={() => submit(null, "apple")}><Icon name="phone" /> Apple (demo)</button>
          </div>

          <p className="auth-switch">
            {mode === "masuk" ? "Baru di Mentify? " : "Sudah punya akun? "}
            <button type="button" className="auth-link" onClick={() => setMode(mode === "masuk" ? "daftar" : "masuk")}>{mode === "masuk" ? "Buat akun" : "Masuk"}</button>
          </p>
          <p className="muted auth-demo">Demo: data disimpan di browser, belum ada backend.</p>
        </section>
      </div>
    </div>
  );
}
