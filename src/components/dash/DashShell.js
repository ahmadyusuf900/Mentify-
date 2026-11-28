"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Icon, Em } from "@/components/Icon";
import { Chibi } from "@/components/HeroArt";
import { KINDS } from "@/lib/orders";
import { rupiah } from "@/lib/format";
import { mentors } from "@/data/mentors";

const ROLE_LABEL = { pencari: "Pencari Mentor", mentor: "Mentor", seller: "Penjual", organizer: "Penyelenggara" };
const STATUS_KEY = { mentor: "mentorStatus", seller: "sellerStatus", organizer: "organizerStatus" };
const statusText = (s) => (s === "verified" ? "Aktif" : s === "pending" ? "Menunggu verifikasi" : "Belum terdaftar");

// Kartu aksi cepat per peran (isi menyesuaikan kebutuhan tiap peran)
const ROLE_CARDS = {
  pencari: [
    { icon: "search", t: "Cari mentor", d: "Temukan mentor lombamu", href: "/mentor" },
    { icon: "trophy", t: "Info lomba", d: "Lomba yang sedang buka", href: "/lomba" },
    { icon: "book", t: "Marketplace", d: "Materi dari para juara", href: "/marketplace" },
  ],
  mentor: [
    { icon: "grad", t: "Profil mentor", tab: "mentor", status: "mentorStatus" },
    { icon: "calendar", t: "Sesi & pendapatan", d: "Pantau sesi dan penghasilan", tab: "mentor" },
  ],
  seller: [
    { icon: "store", t: "Toko digital", tab: "seller", status: "sellerStatus" },
    { icon: "package", t: "Kelola produk", d: "Tambah dan pantau penjualan", tab: "seller" },
  ],
  organizer: [
    { icon: "megaphone", t: "Kelola lomba", tab: "organizer", status: "organizerStatus" },
    { icon: "users", t: "Pendaftar lomba", d: "Pantau peminat lombamu", tab: "organizer" },
  ],
};

const greet = () => {
  const h = new Date().getHours();
  return h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
};
const fmtDate = (t) => new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function Calendar({ orders }) {
  const [off, setOff] = useState(0);
  const [sel, setSel] = useState(null); // tanggal yang dipilih { y, m, d }
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + off, 1);
  const y = base.getFullYear(), m = base.getMonth();
  const first = (base.getDay() + 6) % 7; // Senin = 0
  const days = new Date(y, m + 1, 0).getDate();
  const byDay = {};
  orders.forEach((o) => { const d = new Date(o.ts); if (d.getFullYear() === y && d.getMonth() === m) (byDay[d.getDate()] ||= []).push(o); });
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const picked = sel && sel.y === y && sel.m === m ? sel.d : null;
  const list = picked ? byDay[picked] || [] : [];
  const pickedLabel = picked ? new Date(y, m, picked).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <section className="ds-box">
      <div className="ds-box-h">
        <h3>Kalender</h3>
        <span className="ds-cal-nav">
          <button type="button" onClick={() => { setOff(off - 1); setSel(null); }} aria-label="Bulan sebelumnya">‹</button>
          <strong>{base.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</strong>
          <button type="button" onClick={() => { setOff(off + 1); setSel(null); }} aria-label="Bulan berikutnya">›</button>
        </span>
      </div>
      <div className="ds-cal">
        {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => <b key={i}>{d}</b>)}
        {cells.map((d, i) => d ? (
          <button key={i} type="button" onClick={() => setSel(picked === d ? null : { y, m, d })} aria-pressed={picked === d}
            aria-label={`${d} ${base.toLocaleDateString("id-ID", { month: "long" })}${byDay[d] ? `, ${byDay[d].length} aktivitas` : ""}`}
            className={`${off === 0 && d === now.getDate() ? "today" : ""} ${byDay[d] ? "mark" : ""} ${picked === d ? "sel" : ""}`}>{d}</button>
        ) : <span key={i} />)}
      </div>
      {picked ? (
        <div className="ds-day" role="status">
          <strong>{pickedLabel}</strong>
          {list.length === 0 ? <p className="muted">Tidak ada aktivitas di tanggal ini.</p> : (
            <ul className="ds-list">
              {list.map((o) => { const k = KINDS[o.kind]; return (
                <li key={o.id}>
                  <span className="ds-li-ico"><Em e={k.icon} /></span>
                  <div><strong>{o.title}</strong><small>{new Date(o.ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · {k.flow[o.step]}</small></div>
                </li>); })}
            </ul>
          )}
        </div>
      ) : (
        <p className="muted ds-hint"><i /> Titik = ada aktivitas. Ketuk tanggalnya untuk melihat detail.</p>
      )}
    </section>
  );
}

function Rail({ user, orders }) {
  const recent = orders.slice(0, 4);
  return (
    <aside className="ds-rail">
      <div className="ds-me">
        <div className="ds-av">{user.name?.[0]?.toUpperCase() ?? "U"}</div>
        <div><strong>{user.name}</strong><small>{user.email}</small></div>
      </div>
      <Calendar orders={orders} />
      <section className="ds-box">
        <div className="ds-box-h"><h3>Aktivitas terbaru</h3></div>
        {recent.length === 0 && <p className="muted" style={{ fontSize: ".84rem" }}>Belum ada aktivitas.</p>}
        <ul className="ds-list">
          {recent.map((o) => {
            const k = KINDS[o.kind];
            return (
              <li key={o.id}>
                <span className="ds-li-ico"><Em e={k.icon} /></span>
                <div><strong>{o.title}</strong><small>{fmtDate(o.ts)} · {k.flow[o.step]}</small></div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="ds-box">
        <div className="ds-box-h"><h3>Mentor untukmu</h3><Link href="/mentor">Lihat semua</Link></div>
        <ul className="ds-list">
          {mentors.slice(0, 3).map((m) => (
            <li key={m.id}>
              <img src={m.photo} alt="" width="38" height="38" />
              <div><strong>{m.name}</strong><small>{m.category}</small></div>
              <Link className="ds-mini" href={`/mentor/${m.id}`}>Lihat</Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export function Overview({ user, orders, goTab }) {
  const roles = user.roles?.length ? user.roles : ["pencari"];
  const cards = roles.flatMap((r) => ROLE_CARDS[r] || []);
  const last = orders.slice(0, 6);
  const active = orders.filter((o) => o.step < KINDS[o.kind].flow.length - 1).length;
  return (
    <>
      <section className="ds-banner">
        <div className="ds-banner-t">
          <h2>{greet()}, {user.name}!</h2>
          <p>{orders.length === 0 ? "Belum ada aktivitas. Mulai dengan mencari mentor atau melihat lomba yang sedang buka." : `Kamu punya ${active} aktivitas yang masih berjalan dari total ${orders.length}.`}</p>
          <button className="btn" onClick={() => goTab("riwayat")}>Lihat riwayat</button>
        </div>
        <svg viewBox="0 0 260 200" aria-hidden="true" className="ds-banner-art">
          <circle cx="150" cy="110" r="78" fill="#fff" opacity=".18" />
          <path d="M40 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff" opacity=".8" />
          <Chibi x={140} y={196} s={.85} hair="#3A2A5E" outfit="#FFE98A" accent="#7C5CFF" style="long" wave />
        </svg>
      </section>

      <section>
        <div className="ds-sec-h"><h3>Pintasan untukmu</h3><span className="muted">{roles.map((r) => ROLE_LABEL[r]).join(" · ")}</span></div>
        <div className="ds-cards">
          {cards.map((c) => {
            const body = (
              <>
                <span className="ds-card-ico"><Icon name={c.icon} /></span>
                <strong>{c.t}</strong>
                <small>{c.status ? statusText(user[c.status]) : c.d}</small>
              </>
            );
            return c.href
              ? <Link key={c.t} href={c.href} className="ds-card">{body}</Link>
              : <button key={c.t} type="button" className="ds-card" onClick={() => goTab(c.tab)}>{body}</button>;
          })}
        </div>
      </section>

      <section>
        <div className="ds-sec-h"><h3>Progres aktivitas</h3><button type="button" className="ds-mini" onClick={() => goTab("riwayat")}>Lihat semua</button></div>
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead><tr><th>Aktivitas</th><th>Jenis</th><th>Status</th><th>Tanggal</th><th>Total</th></tr></thead>
            <tbody>
              {last.length === 0 && <tr><td colSpan="5" className="muted" style={{ textAlign: "center", padding: 22 }}>Belum ada aktivitas. Booking mentor atau beli produk untuk memulai.</td></tr>}
              {last.map((o) => {
                const k = KINDS[o.kind];
                const done = o.step >= k.flow.length - 1;
                return (
                  <tr key={o.id}>
                    <td><strong>{o.title}</strong></td>
                    <td>{k.label}</td>
                    <td><span className={`ds-dot ${done ? "ok" : "wait"}`} />{k.flow[o.step]}</td>
                    <td>{fmtDate(o.ts)}</td>
                    <td>{o.total > 0 ? rupiah(o.total) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default function DashShell({ user, tabs, tab, setTab, logout, orders, children }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const cur = tabs.find((t) => t.id === tab);
  const search = (e) => { e.preventDefault(); router.push(`/mentor${q ? `?q=${encodeURIComponent(q)}` : ""}`); };
  return (
    <div className="ds-page">
      <div className="ds-shell">
        <aside className="ds-side">
          <Logo href="/" />
          <nav aria-label="Menu dashboard">
            {tabs.map((t) => (
              <button key={t.id} type="button" className={`ds-nav ${tab === t.id ? "on" : ""}`} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
                <Icon name={t.icon} /><span>{t.label}</span>
              </button>
            ))}
          </nav>
          <button type="button" className="ds-nav ds-out" onClick={logout}><Icon name="x" /><span>Keluar</span></button>
        </aside>

        <main className="ds-main">
          <div className="ds-top">
            <form onSubmit={search} className="ds-search">
              <Icon name="search" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari mentor, lomba, atau produk…" aria-label="Cari mentor" />
            </form>
            <Link className="btn ds-add" href="/lomba">Jelajahi lomba</Link>
          </div>
          {tab !== "home" && <h2 className="ds-title">{cur?.label}</h2>}
          <div className="ds-content">{children}</div>
        </main>

        <Rail user={user} orders={orders} />
      </div>
    </div>
  );
}
