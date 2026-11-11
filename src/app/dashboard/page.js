"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/auth";
import { lombaTypes } from "@/data/lomba";
import { productCategories } from "@/data/products";

/* ───────── helpers ───────── */
function StepIndicator({ steps, current }) {
  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <div key={i} className={`step-dot-wrap${i < current ? " done" : i === current ? " active" : ""}`}>
          <div className="step-dot">{i < current ? "✓" : i + 1}</div>
          <span>{s}</span>
          {i < steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

function StatusPending({ title, msg, onApprove }) {
  return (
    <div className="card" style={{ gap: 16, maxWidth: 560 }}>
      <div className="row" style={{ gap: 12 }}>
        <span style={{ fontSize: "2rem" }}>⏳</span>
        <div>
          <h3 style={{ marginBottom: 2 }}>{title}</h3>
          <p className="muted">{msg}</p>
        </div>
      </div>
      <ul className="tl-h">
        {["Pengajuan dikirim ✓", "Verifikasi dokumen", "Review tim Mentify", "Akun diaktifkan"].map((s, i) => (
          <li key={i} className={i === 0 ? "done" : i === 1 ? "now" : ""}>
            <div className="tl-no">{i + 1}</div>
            <strong style={{ fontSize: ".85rem", lineHeight: 1.3 }}>{s}</strong>
            {i === 1 && <span className="badge" style={{ marginTop: 2 }}>Sedang berlangsung</span>}
          </li>
        ))}
      </ul>
      <div className="warn">
        <span>ℹ️</span>
        <span>Verifikasi biasanya selesai dalam 1–3 hari kerja. Kami akan mengirim notifikasi ke email kamu.</span>
      </div>
      {onApprove && (
        <button type="button" className="btn secondary" onClick={onApprove}>
          🧪 Demo: simulasikan disetujui admin
        </button>
      )}
    </div>
  );
}

function Bars({ title, unit = "", data, note }) {
  const max = Math.max(...data.map((d) => d[1]), 1);
  return (
    <div className="card" style={{ gap: 10 }}>
      <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>{title}</h4>
      <div className="bars" role="img" aria-label={title}>
        {data.map(([l, v]) => (
          <div className="bar" key={l}>
            <span className="bar-v">{v}{unit}</span>
            <i style={{ height: `${Math.max(8, (v / max) * 100)}%` }} />
            <span className="bar-l">{l}</span>
          </div>
        ))}
      </div>
      {note && <p className="muted" style={{ fontSize: ".8rem" }}>{note}</p>}
    </div>
  );
}

function Goal({ label, now, target, fmt = (n) => n }) {
  const pct = Math.min(100, Math.round((now / target) * 100));
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div className="row between" style={{ fontSize: ".85rem" }}><span>{label}</span><strong>{fmt(now)} / {fmt(target)}</strong></div>
      <div className="goal" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card" style={{ alignItems: "center", textAlign: "center", gap: 4 }}>
      <span style={{ fontSize: "1.6rem" }}>{icon}</span>
      <strong style={{ fontSize: "1.5rem", fontFamily: "var(--font-poppins)" }}>{value}</strong>
      <span className="muted" style={{ fontSize: ".82rem" }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB: CARI MENTOR (semua user)
═══════════════════════════════════════ */
function TabCariMentor() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card mentor-cta" style={{ background: "var(--sky)" }}>
        <div>
          <h3>Temukan mentor yang tepat</h3>
          <p className="muted">Lebih dari 200 mentor mahasiswa siap membimbing kamu meraih juara lomba.</p>
        </div>
        <Link href="/mentor" className="btn">Lihat semua mentor →</Link>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {[
          { icon: "🎯", t: "Spesialis lomba", d: "Mentor berpengalaman di bidang kompetisi yang kamu ikuti" },
          { icon: "📅", t: "Jadwal fleksibel", d: "Sesi online sesuai waktu luangmu, dari 1 jam hingga paket intensif" },
          { icon: "⭐", t: "Terverifikasi", d: "Semua mentor telah diverifikasi KTM dan sertifikat lomba" },
          { icon: "💬", t: "Chat langsung", d: "Tanya-jawab sebelum booking, tanpa komitmen" },
        ].map((f) => (
          <div key={f.t} className="card" style={{ gap: 6 }}>
            <span style={{ fontSize: "1.5rem" }}>{f.icon}</span>
            <strong style={{ fontSize: ".95rem" }}>{f.t}</strong>
            <p className="muted" style={{ fontSize: ".85rem" }}>{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TAB: PROFIL MENTOR
═══════════════════════════════════════ */
const MENTOR_STEPS = ["Info dasar", "Upload dokumen", "Pembayaran"];

function MentorRegForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ kampus: "", jurusan: "", bidang: lombaTypes[0], tarif: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [payMethod, setPayMethod] = useState("qris");

  return (
    <div style={{ maxWidth: 560 }}>
      <h3 style={{ marginBottom: 4 }}>Daftar sebagai Mentor</h3>
      <p className="muted" style={{ marginBottom: 16 }}>Mentor harus berstatus mahasiswa aktif dan punya pengalaman lomba.</p>
      <StepIndicator steps={MENTOR_STEPS} current={step} />

      {step === 0 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
          <label>Kampus / Universitas<input required value={f.kampus} onChange={set("kampus")} placeholder="Universitas Indonesia" /></label>
          <label>Jurusan<input required value={f.jurusan} onChange={set("jurusan")} placeholder="Teknik Informatika" /></label>
          <label>Bidang lomba utama
            <select value={f.bidang} onChange={set("bidang")}>
              {lombaTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Tarif per jam (Rp)
            <input type="number" required min="10000" value={f.tarif} onChange={set("tarif")} placeholder="50000" />
          </label>
          <label>Link portofolio / LinkedIn (opsional)<input type="url" placeholder="https://" /></label>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 4 }}>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="warn"><span>📌</span><span>Upload dalam format PDF atau gambar (maks. 5 MB). Ini hanya simulasi — file tidak benar-benar diunggah.</span></div>
          <label>KTM (Kartu Tanda Mahasiswa) <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" required /></label>
          <label>Sertifikat lomba (minimal 1) <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" multiple required /></label>
          <label>CV terbaru <span className="badge">Wajib</span><input type="file" accept=".pdf" required /></label>
          <div className="row between" style={{ marginTop: 4 }}>
            <button className="btn secondary" type="button" onClick={() => setStep(0)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="summary">
            <div><span>Biaya pendaftaran mentor</span><strong>Rp 25.000</strong></div>
            <div className="total"><span>Total</span><strong>Rp 25.000</strong></div>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Metode pembayaran</p>
            <div className="pay-grid">
              {[
                { id: "qris", label: "QRIS", icon: "📱", sub: "Scan dengan dompet digital apa saja" },
                { id: "transfer", label: "Transfer Bank", icon: "🏦", sub: "BCA / Mandiri / BRI" },
              ].map((m) => (
                <button key={m.id} className="pay" aria-pressed={payMethod === m.id} type="button" onClick={() => setPayMethod(m.id)}>
                  <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                  <strong style={{ fontSize: ".9rem" }}>{m.label}</strong>
                  <span className="muted" style={{ fontSize: ".8rem" }}>{m.sub}</span>
                </button>
              ))}
            </div>
          </div>
          {payMethod === "qris" && (
            <div style={{ background: "var(--sky)", borderRadius: 12, padding: 16, textAlign: "center", display: "grid", gap: 8 }}>
              <div style={{ width: 140, height: 140, background: "var(--border)", borderRadius: 8, margin: "0 auto", display: "grid", placeItems: "center" }}>
                <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>QRIS Dummy</span>
              </div>
              <p className="muted" style={{ fontSize: ".82rem" }}>Scan kode QR di atas, lalu konfirmasi pembayaran.</p>
            </div>
          )}
          {payMethod === "transfer" && (
            <div className="info-list">
              <div><span>Bank</span><strong>BCA</strong></div>
              <div><span>No. Rekening</span><strong>1234-5678-90</strong></div>
              <div><span>Atas Nama</span><strong>PT Mentify Indonesia</strong></div>
              <div><span>Jumlah</span><strong>Rp 25.000</strong></div>
            </div>
          )}
          <div className="warn"><span>⚠️</span><span>Ini adalah simulasi. Tidak ada uang yang benar-benar ditagih.</span></div>
          <div className="row between">
            <button className="btn secondary" type="button" onClick={() => setStep(1)}>← Kembali</button>
            <button className="btn" type="button" onClick={onSubmit}>Saya sudah bayar → Ajukan</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MentorDashboard() {
  const dummySessions = [
    { name: "Alya P.", topic: "Business Case", date: "Rab, 13 Nov • 15.00", status: "Konfirmasi" },
    { name: "Bima A.", topic: "UI/UX Design", date: "Jum, 15 Nov • 10.00", status: "Menunggu" },
  ];
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <StatCard icon="📅" label="Total sesi" value="24" />
        <StatCard icon="💰" label="Pendapatan (Rp)" value="1,2 jt" />
        <StatCard icon="⭐" label="Rating rata-rata" value="4.9" />
        <StatCard icon="👥" label="Mentee" value="18" />
      </div>
      <Bars title="Sesi per bulan (6 bulan terakhir)" data={[["Jun", 3], ["Jul", 5], ["Agu", 4], ["Sep", 7], ["Okt", 9], ["Nov", 12]]} note="Data dummy — tren naik 33% dibanding bulan lalu." />
      <div className="card" style={{ gap: 12 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Progres perkembangan mentor</h4>
        <Goal label="Level Mentor Silver → Gold (sesi)" now={24} target={40} />
        <Goal label="Target pendapatan bulan ini" now={1200000} target={2000000} fmt={(n) => `Rp ${n.toLocaleString("id-ID")}`} />
        <Goal label="Rating minimal 4,8 (ulasan)" now={18} target={25} />
      </div>
      <div className="card">
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Sesi mendatang</h4>
        {dummySessions.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < dummySessions.length - 1 ? "1px dashed var(--border)" : "none", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong style={{ fontSize: ".9rem" }}>{s.name}</strong>
              <p className="muted" style={{ fontSize: ".82rem" }}>{s.topic} • {s.date}</p>
            </div>
            <span className={`badge ${s.status === "Konfirmasi" ? "pink" : ""}`}>{s.status}</span>
          </div>
        ))}
        {dummySessions.length === 0 && <p className="muted">Belum ada sesi mendatang.</p>}
      </div>
    </div>
  );
}

function TabMentor({ user, updateUser }) {
  if (user.mentorStatus === "pending") return <StatusPending title="Pengajuan mentor sedang diverifikasi" msg="Tim kami sedang memeriksa dokumen dan latar belakang kamu." onApprove={() => updateUser({ ...user, mentorStatus: "verified" })} />;
  if (user.mentorStatus === "verified") return <MentorDashboard />;
  return <MentorRegForm onSubmit={() => updateUser({ ...user, mentorStatus: "pending" })} />;
}

/* ═══════════════════════════════════════
   TAB: KELOLA PRODUK
═══════════════════════════════════════ */
const SELLER_STEPS = ["Info toko", "Verifikasi identitas", "Pembayaran"];

function SellerRegForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ toko: "", deskripsi: "", kategori: productCategories[0] });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div style={{ maxWidth: 560 }}>
      <h3 style={{ marginBottom: 4 }}>Daftar sebagai Penjual</h3>
      <p className="muted" style={{ marginBottom: 16 }}>Jual template, modul, dan karya lomba digitalmu di Mentify Marketplace.</p>
      <StepIndicator steps={SELLER_STEPS} current={step} />

      {step === 0 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
          <label>Nama toko<input required value={f.toko} onChange={set("toko")} placeholder="Toko Lomba Keren" /></label>
          <label>Deskripsi singkat<textarea rows={3} required value={f.deskripsi} onChange={set("deskripsi")} placeholder="Jual produk lomba terbaik..." style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", font: "inherit", resize: "vertical" }} /></label>
          <label>Kategori produk utama
            <select value={f.kategori} onChange={set("kategori")}>
              {productCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 4 }}>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="warn"><span>📌</span><span>Upload dalam format PDF atau gambar (maks. 5 MB). Ini hanya simulasi.</span></div>
          <label>KTP / KTM <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" required /></label>
          <label>Selfie dengan identitas (opsional)<input type="file" accept="image/*" /></label>
          <div className="row between" style={{ marginTop: 4 }}>
            <button className="btn secondary" type="button" onClick={() => setStep(0)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="summary">
            <div><span>Biaya aktivasi toko</span><strong>Rp 10.000</strong></div>
            <div className="total"><span>Total</span><strong>Rp 10.000</strong></div>
          </div>
          <div className="warn"><span>⚠️</span><span>Ini adalah simulasi. Tidak ada uang yang benar-benar ditagih.</span></div>
          <div className="info-list">
            <div><span>Bank</span><strong>BCA</strong></div>
            <div><span>No. Rekening</span><strong>1234-5678-90</strong></div>
            <div><span>Jumlah</span><strong>Rp 10.000</strong></div>
          </div>
          <div className="row between">
            <button className="btn secondary" type="button" onClick={() => setStep(1)}>← Kembali</button>
            <button className="btn" type="button" onClick={onSubmit}>Saya sudah bayar → Ajukan</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SellerDashboard() {
  const [products, setProducts] = useState([
    { title: "Template Business Plan Lengkap", cat: "Template", price: 45000 },
    { title: "Esai Juara LKTI 2024", cat: "Esai Juara", price: 30000 },
  ]);
  const [ok, setOk] = useState("");

  const addProduct = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setProducts([...products, { title: fd.get("title"), cat: fd.get("cat"), price: Number(fd.get("price")) }]);
    e.target.reset();
    setOk("Produk berhasil ditambah (dummy).");
    setTimeout(() => setOk(""), 3000);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <StatCard icon="🛒" label="Total penjualan" value="47" />
        <StatCard icon="💰" label="Pendapatan (Rp)" value="2,1 jt" />
        <StatCard icon="📦" label="Produk aktif" value={products.length} />
        <StatCard icon="⭐" label="Rating toko" value="4.8" />
      </div>

      <Bars title="Penjualan per produk (unit terjual)" data={products.map((p, k) => [p.title.split(" ").slice(0, 2).join(" "), 12 + ((k * 17) % 31)])} note="Data dummy. Produk baru berstatus 'Menunggu review' sampai disetujui admin." />
      <div className="card" style={{ gap: 12 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Progres penjualan</h4>
        <Goal label="Target omzet bulan ini" now={870000} target={1500000} fmt={(n) => `Rp ${n.toLocaleString("id-ID")}`} />
        <Goal label="Target produk terjual" now={34} target={50} />
      </div>
      <details className="card" style={{ gap: 12 }} open>
        <summary style={{ cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: 600, padding: "4px 0" }}>+ Tambah produk baru</summary>
        <form className="form" onSubmit={addProduct} style={{ marginTop: 8 }}>
          <label>Judul produk<input name="title" required placeholder="Template Business Plan..." /></label>
          <label>Kategori<select name="cat">{productCategories.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Harga (Rp)<input type="number" name="price" min="0" required placeholder="45000" /></label>
          <label>File produk<input type="file" required /></label>
          {ok && <p className="badge pink" role="status">{ok}</p>}
          <button className="btn" type="submit">Tambah produk</button>
        </form>
      </details>

      <div className="card" style={{ gap: 10 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Produk saya ({products.length})</h4>
        {products.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < products.length - 1 ? "1px dashed var(--border)" : "none", gap: 12 }}>
            <div>
              <strong style={{ fontSize: ".9rem" }}>{p.title}</strong>
              <p className="muted" style={{ fontSize: ".82rem" }}>{p.cat}</p>
            </div>
            <span className="badge">Rp {p.price.toLocaleString("id-ID")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSeller({ user, updateUser }) {
  if (user.sellerStatus === "pending") return <StatusPending title="Pengajuan penjual sedang diverifikasi" msg="Tim kami sedang memeriksa data toko dan identitas kamu." onApprove={() => updateUser({ ...user, sellerStatus: "verified" })} />;
  if (user.sellerStatus === "verified") return <SellerDashboard />;
  return <SellerRegForm onSubmit={() => updateUser({ ...user, sellerStatus: "pending" })} />;
}

/* ═══════════════════════════════════════
   TAB: KELOLA LOMBA
═══════════════════════════════════════ */
const ORGANIZER_STEPS = ["Info organisasi", "Verifikasi legalitas", "Pembayaran"];

function OrganizerRegForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ orgName: "", jenis: "Universitas", website: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div style={{ maxWidth: 560 }}>
      <h3 style={{ marginBottom: 4 }}>Daftar sebagai Penyelenggara Lomba</h3>
      <p className="muted" style={{ marginBottom: 16 }}>Daftarkan dan kelola informasi lomba yang kamu selenggarakan.</p>
      <StepIndicator steps={ORGANIZER_STEPS} current={step} />

      {step === 0 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
          <label>Nama organisasi<input required value={f.orgName} onChange={set("orgName")} placeholder="BEM Universitas Indonesia" /></label>
          <label>Jenis organisasi
            <select value={f.jenis} onChange={set("jenis")}>
              {["Universitas", "Perusahaan", "LSM / Yayasan", "Lembaga Pemerintah", "Komunitas"].map((j) => <option key={j}>{j}</option>)}
            </select>
          </label>
          <label>Website resmi (opsional)<input type="url" value={f.website} onChange={set("website")} placeholder="https://bem.ui.ac.id" /></label>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 4 }}>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="warn"><span>📌</span><span>Upload surat keterangan/SK organisasi (PDF atau gambar, maks. 5 MB). Ini hanya simulasi.</span></div>
          <label>Surat keterangan organisasi <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" required /></label>
          <label>Dokumen pendukung lainnya (opsional)<input type="file" accept="image/*,.pdf" multiple /></label>
          <div className="row between" style={{ marginTop: 4 }}>
            <button className="btn secondary" type="button" onClick={() => setStep(0)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="summary">
            <div><span>Biaya listing per lomba</span><strong>Rp 15.000</strong></div>
            <div><span className="muted" style={{ fontSize: ".82rem" }}>*Dibayar saat menambah lomba pertama</span></div>
            <div className="total"><span>Total sekarang</span><strong>Rp 0</strong></div>
          </div>
          <div className="warn"><span>⚠️</span><span>Ini adalah simulasi. Tidak ada uang yang benar-benar ditagih.</span></div>
          <div className="row between">
            <button className="btn secondary" type="button" onClick={() => setStep(1)}>← Kembali</button>
            <button className="btn" type="button" onClick={onSubmit}>Ajukan pendaftaran</button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrganizerDashboard() {
  const [lombas, setLombas] = useState([
    { title: "LKTI Nasional Inovasi 2025", jenis: "Esai/LKTI", deadline: "2025-12-10" },
    { title: "Business Case Challenge", jenis: "Business Case", deadline: "2025-11-30" },
  ]);
  const [ok, setOk] = useState("");

  const addLomba = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setLombas([...lombas, { title: fd.get("title"), jenis: fd.get("jenis"), deadline: fd.get("deadline") }]);
    e.target.reset();
    setOk("Info lomba berhasil ditambah (dummy).");
    setTimeout(() => setOk(""), 3000);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <StatCard icon="🏆" label="Total lomba" value={lombas.length} />
        <StatCard icon="👁️" label="Total dilihat" value="4.230" />
        <StatCard icon="📝" label="Total pendaftar" value="312" />
        <StatCard icon="✅" label="Lomba aktif" value={lombas.length} />
      </div>

      <Bars title="Pendaftar per lomba" data={lombas.map((l, k) => [l.title.split(" ")[0], 80 + ((k * 53) % 170)])} note="Data dummy. Info lomba baru tampil di halaman Info Lomba setelah verifikasi dan pembayaran listing." />
      <div className="card" style={{ gap: 12 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Progres pendaftaran</h4>
        <Goal label="Target pendaftar" now={312} target={500} />
        <Goal label="Tayangan info lomba" now={4230} target={6000} />
      </div>
      <details className="card" style={{ gap: 12 }} open>
        <summary style={{ cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: 600, padding: "4px 0" }}>+ Tambah info lomba baru</summary>
        <form className="form" onSubmit={addLomba} style={{ marginTop: 8 }}>
          <label>Judul lomba<input name="title" required placeholder="LKTI Nasional 2025..." /></label>
          <label>Jenis lomba<select name="jenis">{lombaTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label>Deadline pendaftaran<input type="date" name="deadline" required /></label>
          <label>Poster lomba (opsional)<input type="file" accept="image/*" /></label>
          {ok && <p className="badge pink" role="status">{ok}</p>}
          <div className="summary" style={{ fontSize: ".85rem" }}>
            <div><span>Biaya listing</span><strong>Rp 15.000</strong></div>
          </div>
          <button className="btn" type="submit">Tambah lomba (simulasi)</button>
        </form>
      </details>

      <div className="card" style={{ gap: 10 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Lomba saya ({lombas.length})</h4>
        {lombas.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < lombas.length - 1 ? "1px dashed var(--border)" : "none", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong style={{ fontSize: ".9rem" }}>{l.title}</strong>
              <p className="muted" style={{ fontSize: ".82rem" }}>{l.jenis} • Deadline: {l.deadline}</p>
            </div>
            <span className="badge pink">Aktif</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabOrganizer({ user, updateUser }) {
  if (user.organizerStatus === "pending") return <StatusPending title="Pengajuan penyelenggara sedang diverifikasi" msg="Tim kami sedang memeriksa legalitas organisasi kamu." onApprove={() => updateUser({ ...user, organizerStatus: "verified" })} />;
  if (user.organizerStatus === "verified") return <OrganizerDashboard />;
  return <OrganizerRegForm onSubmit={() => updateUser({ ...user, organizerStatus: "pending" })} />;
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
export default function Dashboard() {
  const { user, login, logout } = useUser();
  const [tab, setTab] = useState("cari");
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t) setTab(t);
  }, []);

  if (!user) {
    return (
      <div className="container section">
        <p>Silakan <Link href="/login"><u>masuk</u></Link> terlebih dahulu untuk mengakses dashboard.</p>
      </div>
    );
  }

  const updateUser = (u) => login(u);

  // Build tabs
  const TABS = [
    { id: "cari", label: "🔍 Cari Mentor" },
    ...(user.roles?.includes("mentor") ? [{ id: "mentor", label: "🎓 Profil Mentor" }] : []),
    ...(user.roles?.includes("seller") ? [{ id: "seller", label: "🛒 Kelola Produk" }] : []),
    ...(user.roles?.includes("organizer") ? [{ id: "organizer", label: "🏆 Kelola Lomba" }] : []),
  ];

  // Guard: if current tab no longer in tabs list (after role changes), reset to cari
  const validTab = TABS.find((t) => t.id === tab) ? tab : "cari";

  return (
    <div className="container section">
      {/* Header profil */}
      <div className="card" style={{ marginBottom: 24, background: "var(--sky)" }}>
        <div className="row between" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="row" style={{ gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", color: "var(--on-accent)",
              display: "grid", placeItems: "center", fontFamily: "var(--font-poppins)", fontWeight: 700, fontSize: "1.3rem", flex: "none"
            }}>
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", marginBottom: 2 }}>Halo, {user.name} 👋</h2>
              <p className="muted" style={{ fontSize: ".85rem" }}>{user.email}</p>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className={`badge ${user.plan === "premium" ? "pink" : ""}`}>{user.plan === "premium" ? "⭐ Premium" : "Free"}</span>
            {user.roles?.map((r) => (
              <span key={r} className="chip on" style={{ fontSize: ".75rem", padding: "3px 10px" }}>
                {r === "pencari" ? "Pencari Mentor" : r === "mentor" ? "Mentor" : r === "seller" ? "Penjual" : "Penyelenggara"}
              </span>
            ))}
            <button className="btn secondary" onClick={logout} style={{ padding: "6px 14px", fontSize: ".85rem" }}>Keluar</button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="dtabs" style={{ marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="dtab"
            aria-selected={validTab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="dpanel">
        {validTab === "cari" && <TabCariMentor />}
        {validTab === "mentor" && <TabMentor user={user} updateUser={updateUser} />}
        {validTab === "seller" && <TabSeller user={user} updateUser={updateUser} />}
        {validTab === "organizer" && <TabOrganizer user={user} updateUser={updateUser} />}
      </div>
    </div>
  );
}
