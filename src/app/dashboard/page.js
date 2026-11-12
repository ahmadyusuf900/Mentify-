"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/auth";
import { lombaTypes, lombaLevels } from "@/data/lomba";
import { productCategories, productLombaTypes } from "@/data/products";
import { addOrder, advanceOrder, advanceLatest, clearOrders, useOrders, KINDS } from "@/lib/orders";
import { addListing, nextListingId, useCatalog } from "@/lib/listings";
import { makeMentor } from "@/data/mentors";
import { makeLomba } from "@/data/lomba";
import { makeProduct } from "@/data/products";
import { readImage } from "@/lib/image";
import PaymentCard, { MethodPicker } from "@/components/PaymentCard";
import ReviewBox from "@/components/ReviewBox";
import { rupiah } from "@/lib/format";

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
const TA = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", font: "inherit", resize: "vertical" };

/* Langkah pembayaran bersama: ringkasan → pilih metode → KARTU INVOICE → status berhasil */
function RegPay({ title, detail, items, onBack, onPaid, onFinish, finishLabel, note, extraActions }) {
  const [method, setMethod] = useState("QRIS");
  const [pay, setPay] = useState(false);
  const total = items.reduce((s, i) => s + i.amount, 0);
  if (pay) {
    return (
      <PaymentCard title={title} detail={detail} items={items} method={method} onBack={() => setPay(false)} onPay={onPaid}
        success={{ title: "Pembayaran berhasil", note, actions: (o) => (<>
          {finishLabel && <button className="btn secondary" onClick={onFinish}>{finishLabel}</button>}
          {extraActions?.(o)}
        </>) }} />
    );
  }
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="summary">
        {items.map((i) => <div key={i.label}><span>{i.label}</span><strong>{rupiah(i.amount)}</strong></div>)}
        <div className="total"><span>Total</span><strong>{rupiah(total)}</strong></div>
      </div>
      <div><p style={{ fontWeight: 600, marginBottom: 8 }}>Metode pembayaran</p><MethodPicker value={method} onChange={setMethod} /></div>
      <div className="row between">
        <button className="btn secondary" type="button" onClick={onBack}>← Kembali</button>
        <button className="btn" type="button" onClick={() => setPay(true)}>Lanjut ke invoice →</button>
      </div>
    </div>
  );
}

const MENTOR_STEPS = ["Info dasar", "Administrasi", "Dokumen", "Pembayaran"];

function MentorRegForm({ user, onFinish }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ kampus: "", jurusan: "", bidang: lombaTypes[0], tarif: "", highlight: "", photo: null,
    nama: user?.name || "", nim: "", emailKampus: "", wa: "", semester: "", bank: "BCA", rek: "", atasNama: "", agree: false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const [photoMsg, setPhotoMsg] = useState("");

  const onPaid = () => {
    const id = nextListingId("mentors");
    addListing("mentors", makeMentor({ name: f.nama, campus: f.kampus, major: f.jurusan, category: f.bidang, price: f.tarif, highlight: f.highlight, photo: f.photo, owner: user.email }, id));
    return addOrder({
      kind: "mentor", title: "Pendaftaran sebagai mentor", detail: `${f.nama} · ${f.kampus} · bidang ${f.bidang}`,
      items: [{ label: "Biaya pendaftaran & verifikasi mentor", amount: 25000 }], method: "—", ref: `/mentor/${id}`, listing: { type: "mentors", id },
    });
  };

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
            <select value={f.bidang} onChange={set("bidang")}>{lombaTypes.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label>Tarif per jam (Rp)<input type="number" required min="10000" value={f.tarif} onChange={set("tarif")} placeholder="50000" /></label>
          <label>Prestasi unggulan (tampil di profil)<input required value={f.highlight} onChange={set("highlight")} placeholder="Juara 1 LKTI Nasional 2025" /></label>
          <label>Foto profil (opsional, maks. 400 KB)
            <input type="file" accept="image/*" onChange={async (e) => { const d = await readImage(e.target.files[0]); setF((p) => ({ ...p, photo: d })); setPhotoMsg(d ? "Foto siap dipakai ✓" : e.target.files[0] ? "Foto terlalu besar / bukan gambar" : ""); }} />
            {photoMsg && <span className="muted" style={{ fontSize: ".8rem" }}>{photoMsg}</span>}
          </label>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 4 }}><button className="btn" type="submit">Lanjut →</button></div>
        </form>
      )}

      {step === 1 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="warn"><span>🗂️</span><span>Administrasi: data diri untuk verifikasi dan pencairan honor. Dijaga kerahasiaannya dan tidak ditampilkan di profil publik.</span></div>
          <label>Nama lengkap (sesuai KTM)<input required value={f.nama} onChange={set("nama")} /></label>
          <label>NIM<input required value={f.nim} onChange={set("nim")} placeholder="2106123456" /></label>
          <label>Email kampus<input type="email" required value={f.emailKampus} onChange={set("emailKampus")} placeholder="nama@mhs.kampus.ac.id" /></label>
          <label>No. WhatsApp aktif<input type="tel" required value={f.wa} onChange={set("wa")} placeholder="08xxxxxxxxxx" /></label>
          <label>Semester saat ini<input type="number" required min="1" max="14" value={f.semester} onChange={set("semester")} /></label>
          <label>Bank pencairan
            <select value={f.bank} onChange={set("bank")}>{["BCA", "Mandiri", "BRI", "BNI", "SeaBank", "Dana", "GoPay"].map((b) => <option key={b}>{b}</option>)}</select>
          </label>
          <label>No. rekening / e-wallet<input required value={f.rek} onChange={set("rek")} inputMode="numeric" /></label>
          <label>Atas nama<input required value={f.atasNama} onChange={set("atasNama")} /></label>
          <label className="agree"><input type="checkbox" required checked={f.agree} onChange={set("agree")} />
            <span>Data benar dan saya menyetujui pakta integritas mentor (tidak melakukan transaksi di luar Mentify).</span></label>
          <div className="row between" style={{ marginTop: 4 }}>
            <button className="btn secondary" type="button" onClick={() => setStep(0)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
          <div className="warn"><span>📌</span><span>Upload dalam format PDF atau gambar (maks. 5 MB). Ini hanya simulasi — file tidak benar-benar diunggah.</span></div>
          <label>KTM (Kartu Tanda Mahasiswa) <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" required /></label>
          <label>Sertifikat lomba (minimal 1) <span className="badge">Wajib</span><input type="file" accept="image/*,.pdf" multiple required /></label>
          <label>CV terbaru <span className="badge">Wajib</span><input type="file" accept=".pdf" required /></label>
          <div className="row between" style={{ marginTop: 4 }}>
            <button className="btn secondary" type="button" onClick={() => setStep(1)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <RegPay title="Pendaftaran sebagai mentor" detail={`${f.nama} · ${f.kampus} · bidang ${f.bidang}`}
          items={[{ label: "Biaya pendaftaran & verifikasi mentor", amount: 25000 }]}
          onBack={() => setStep(2)} onPaid={onPaid} onFinish={onFinish} finishLabel="Lihat status verifikasi →"
          note="Profilmu sudah tampil di halaman Mentor dengan lencana “Menunggu verifikasi”. Admin akan memeriksa dokumen dalam 1–3 hari kerja."
          extraActions={(o) => o.ref && <Link className="btn secondary" href={o.ref}>👀 Lihat profil publik</Link>} />
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
      <div className="statgrid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
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
  if (user.mentorStatus === "pending") return <StatusPending title="Pengajuan mentor sedang diverifikasi" msg="Tim kami sedang memeriksa dokumen dan latar belakang kamu." onApprove={() => { advanceLatest("mentor"); updateUser({ ...user, mentorStatus: "verified" }); }} />;
  if (user.mentorStatus === "verified") return <MentorDashboard />;
  return <MentorRegForm user={user} onFinish={() => updateUser({ ...user, mentorStatus: "pending" })} />;
}

const SELLER_STEPS = ["Info toko", "Verifikasi identitas", "Pembayaran"];

function SellerRegForm({ onFinish }) {
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
        <RegPay title="Aktivasi toko penjual" detail={`Toko ${f.toko} · kategori ${f.kategori}`}
          items={[{ label: "Biaya aktivasi toko", amount: 10000 }]}
          onBack={() => setStep(1)} onFinish={onFinish} finishLabel="Lihat status verifikasi →"
          onPaid={() => addOrder({ kind: "seller", title: "Aktivasi toko penjual", detail: `Toko ${f.toko} · kategori ${f.kategori}`, items: [{ label: "Biaya aktivasi toko", amount: 10000 }], method: "—" })}
          note="Toko kamu menunggu verifikasi identitas. Setelah disetujui, kamu bisa menambah produk ke katalog." />
      )}
    </div>
  );
}

function SellerDashboard({ user }) {
  const { products: catalog } = useCatalog();
  const [base] = useState([
    { title: "Template Business Plan Lengkap", cat: "Template", price: 45000 },
    { title: "Esai Juara LKTI 2024", cat: "Esai Juara", price: 30000 },
  ]);
  const own = catalog.filter((x) => x.owner === user.email).map((x) => ({ title: x.title, cat: x.category, price: x.price, status: x.status, id: x.id }));
  const products = [...own, ...base];
  const [ok, setOk] = useState("");
  const [cover, setCover] = useState(null);

  const addProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const id = nextListingId("products");
    addListing("products", makeProduct({
      title: fd.get("title"), category: fd.get("cat"), price: fd.get("price"), format: fd.get("format"), lombaType: fd.get("lombaType"),
      desc: fd.get("desc"), cover, seller: user.name, owner: user.email,
    }, id));
    addOrder({ kind: "katalog", title: `Produk katalog: ${fd.get("title")}`, detail: `${fd.get("cat")} · harga ${rupiah(Number(fd.get("price")))}`, items: [], method: "—", ref: `/marketplace/${id}`, listing: { type: "products", id } });
    form.reset(); setCover(null);
    setOk("Produk berhasil ditambah dan tampil di Marketplace (status: menunggu review).");
    setTimeout(() => setOk(""), 4000);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="statgrid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
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
          <label>Format file<select name="format">{["PDF", "DOCX", "PPTX", "XLSX", "Figma", "ZIP"].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Cocok untuk lomba<select name="lombaType">{productLombaTypes.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Deskripsi produk<textarea name="desc" rows={3} required style={TA} placeholder="Isi, manfaat, dan cara pakai…" /></label>
          <label>Gambar sampul (opsional, maks. 400 KB)<input type="file" accept="image/*" onChange={async (e) => setCover(await readImage(e.target.files[0]))} /></label>
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
            <div className="row" style={{ gap: 6 }}>
              {p.status === "pending" && <span className="nbadge">⏳ Menunggu review</span>}
              {p.id && <Link className="btn secondary hist-btn" href={`/marketplace/${p.id}`}>Lihat</Link>}
              <span className="badge">Rp {p.price.toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSeller({ user, updateUser }) {
  if (user.sellerStatus === "pending") return <StatusPending title="Pengajuan penjual sedang diverifikasi" msg="Tim kami sedang memeriksa data toko dan identitas kamu." onApprove={() => { advanceLatest("seller"); updateUser({ ...user, sellerStatus: "verified" }); }} />;
  if (user.sellerStatus === "verified") return <SellerDashboard user={user} />;
  return <SellerRegForm onFinish={() => updateUser({ ...user, sellerStatus: "pending" })} />;
}

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


const LOMBA_STEPS = ["Detail lomba", "Administrasi", "Pembayaran"];
const L0 = { title: "", type: lombaTypes[0], levels: ["Mahasiswa"], fee: "0", mode: "Online", province: "", start: "", end: "", link: "", desc: "", poster: null,
  pj: "", jabatan: "", emailOrg: "", wa: "", noSurat: "", agree: false };

function LombaWizard({ user }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(L0);
  const [posterMsg, setPosterMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const toggleLevel = (l) => setF({ ...f, levels: f.levels.includes(l) ? f.levels.filter((x) => x !== l) : [...f.levels, l] });
  const reset = () => { setF(L0); setStep(0); setPosterMsg(""); };

  const onPaid = () => {
    const id = nextListingId("lomba");
    addListing("lomba", makeLomba({ ...f, organizer: user.name, levels: f.levels.length ? f.levels : ["Umum"], owner: user.email }, id));
    return addOrder({
      kind: "lomba", title: `Info lomba: ${f.title}`, detail: `${f.type} · deadline ${f.end}`,
      items: [{ label: "Biaya listing lomba", amount: 15000 }], method: "—", ref: `/lomba/${id}`, listing: { type: "lomba", id },
    });
  };

  return (
    <div style={{ marginTop: 8 }}>
      <StepIndicator steps={LOMBA_STEPS} current={step} />
      {step === 0 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (!f.levels.length) return; setStep(1); }}>
          <label>Judul lomba<input required value={f.title} onChange={set("title")} placeholder="LKTI Nasional 2026…" /></label>
          <label>Jenis lomba<select value={f.type} onChange={set("type")}>{lombaTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: 6 }}>Jenjang peserta</legend>
            <div className="chips">{lombaLevels.map((l) => (
              <button key={l} type="button" className={`chip ${f.levels.includes(l) ? "on" : ""}`} aria-pressed={f.levels.includes(l)} onClick={() => toggleLevel(l)}>{l}</button>
            ))}</div>
          </fieldset>
          <label>Biaya pendaftaran peserta (Rp, 0 = gratis)<input type="number" min="0" required value={f.fee} onChange={set("fee")} /></label>
          <label>Format<select value={f.mode} onChange={set("mode")}>{["Online", "Offline", "Online & Offline"].map((m) => <option key={m}>{m}</option>)}</select></label>
          <label>Provinsi<input required value={f.province} onChange={set("province")} placeholder="DKI Jakarta" /></label>
          <div className="row" style={{ gap: 10 }}>
            <label style={{ flex: 1 }}>Pendaftaran dibuka<input type="date" required value={f.start} onChange={set("start")} /></label>
            <label style={{ flex: 1 }}>Pendaftaran ditutup<input type="date" required value={f.end} onChange={set("end")} /></label>
          </div>
          <label>Link pendaftaran / website resmi<input type="url" required value={f.link} onChange={set("link")} placeholder="https://" /></label>
          <label>Deskripsi lomba<textarea rows={3} required value={f.desc} onChange={set("desc")} style={TA} /></label>
          <label>Poster lomba (opsional, maks. 400 KB)
            <input type="file" accept="image/*" onChange={async (e) => { const d = await readImage(e.target.files[0]); setF((p) => ({ ...p, poster: d })); setPosterMsg(d ? "Poster siap dipakai ✓" : e.target.files[0] ? "Poster terlalu besar / bukan gambar" : ""); }} />
            {posterMsg && <span className="muted" style={{ fontSize: ".8rem" }}>{posterMsg}</span>}
          </label>
          <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn" type="submit">Lanjut →</button></div>
        </form>
      )}
      {step === 1 && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="warn"><span>🗂️</span><span>Administrasi penyelenggara: dipakai admin untuk memverifikasi lomba sebelum tayang. Tidak ditampilkan ke publik.</span></div>
          <label>Nama penanggung jawab<input required value={f.pj} onChange={set("pj")} /></label>
          <label>Jabatan<input required value={f.jabatan} onChange={set("jabatan")} placeholder="Ketua panitia" /></label>
          <label>Email resmi penyelenggara<input type="email" required value={f.emailOrg} onChange={set("emailOrg")} /></label>
          <label>No. WhatsApp penanggung jawab<input type="tel" required value={f.wa} onChange={set("wa")} /></label>
          <label>No. surat tugas / izin penyelenggaraan<input required value={f.noSurat} onChange={set("noSurat")} placeholder="123/SK/BEM/2026" /></label>
          <label>Surat tugas / izin (PDF) <span className="badge">Wajib</span><input type="file" accept=".pdf,image/*" required /></label>
          <label className="agree"><input type="checkbox" required checked={f.agree} onChange={set("agree")} />
            <span>Informasi lomba benar dan saya berwenang mendaftarkannya atas nama penyelenggara.</span></label>
          <div className="row between">
            <button className="btn secondary" type="button" onClick={() => setStep(0)}>← Kembali</button>
            <button className="btn" type="submit">Lanjut →</button>
          </div>
        </form>
      )}
      {step === 2 && (
        <RegPay title={`Info lomba: ${f.title}`} detail={`${f.type} · deadline ${f.end}`}
          items={[{ label: "Biaya listing lomba", amount: 15000 }]}
          onBack={() => setStep(1)} onPaid={onPaid} onFinish={reset} finishLabel="Tambah lomba lain"
          note="Info lombamu sudah tampil di halaman Info Lomba dengan lencana “Menunggu review”. Admin memverifikasi administrasi dalam 1–3 hari kerja."
          extraActions={(o) => o.ref && <Link className="btn secondary" href={o.ref}>👀 Lihat di Info Lomba</Link>} />
      )}
    </div>
  );
}

function OrganizerDashboard({ user }) {
  const { lomba: catalog } = useCatalog();
  const [base] = useState([
    { title: "LKTI Nasional Inovasi 2025", jenis: "Esai/LKTI", deadline: "2025-12-10" },
    { title: "Business Case Challenge", jenis: "Business Case", deadline: "2025-11-30" },
  ]);
  const own = catalog.filter((x) => x.owner === user.email).map((x) => ({ title: x.title, jenis: x.type, deadline: x.end, status: x.status, id: x.id }));
  const lombas = [...own, ...base];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="statgrid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
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
        <summary style={{ cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: 600, padding: "4px 0" }}>+ Daftarkan info lomba baru</summary>
        <LombaWizard user={user} />
      </details>

      <div className="card" style={{ gap: 10 }}>
        <h4 style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}>Lomba saya ({lombas.length})</h4>
        {lombas.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < lombas.length - 1 ? "1px dashed var(--border)" : "none", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong style={{ fontSize: ".9rem" }}>{l.title}</strong>
              <p className="muted" style={{ fontSize: ".82rem" }}>{l.jenis} • Deadline: {l.deadline}</p>
            </div>
            <div className="row" style={{ gap: 6 }}>
              {l.id && <Link className="btn secondary hist-btn" href={`/lomba/${l.id}`}>Lihat</Link>}
              {l.status === "pending" ? <span className="nbadge">⏳ Menunggu review</span> : <span className="badge pink">Aktif</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabOrganizer({ user, updateUser }) {
  if (user.organizerStatus === "pending") return <StatusPending title="Pengajuan penyelenggara sedang diverifikasi" msg="Tim kami sedang memeriksa legalitas organisasi kamu." onApprove={() => { advanceLatest("organizer"); updateUser({ ...user, organizerStatus: "verified" }); }} />;
  if (user.organizerStatus === "verified") return <OrganizerDashboard user={user} />;
  return <OrganizerRegForm onSubmit={() => {
    addOrder({ kind: "organizer", title: "Pendaftaran penyelenggara lomba", detail: "Verifikasi legalitas organisasi. Biaya listing dibayar saat mendaftarkan lomba.", items: [], method: "—" });
    updateUser({ ...user, organizerStatus: "pending" });
  }} />;
}


/* ═══════════════════════════════════════
   TAB: RIWAYAT AKTIVITAS
═══════════════════════════════════════ */
function TabRiwayat() {
  const list = useOrders();
  const fmtDate = (t) => new Date(t).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  if (!list.length) {
    return (
      <div className="card" style={{ textAlign: "center", gap: 8, padding: 28 }}>
        <span style={{ fontSize: "2.4rem" }}>🗂️</span>
        <h3>Belum ada aktivitas</h3>
        <p className="muted">Booking mentor, pembelian produk, pendaftaran, dan info lomba yang kamu buat akan muncul di sini beserta statusnya.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link className="btn" href="/mentor">Cari mentor</Link>
          <Link className="btn secondary" href="/marketplace">Lihat marketplace</Link>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row between" style={{ flexWrap: "wrap", gap: 8 }}>
        <p className="muted">{list.length} aktivitas · data demo tersimpan di browser ini</p>
        <button className="btn secondary" onClick={clearOrders}>Hapus riwayat</button>
      </div>
      <ol className="hist">
        {list.map((o) => {
          const k = KINDS[o.kind];
          const last = o.step >= k.flow.length - 1;
          return (
            <li key={o.id} className="hist-item">
              <span className="hist-ico" aria-hidden="true">{k.icon}</span>
              <div className="hist-body">
                <div className="row between" style={{ gap: 8, flexWrap: "wrap" }}>
                  <strong>{o.title}</strong>
                  <span className={`badge ${last ? "pink" : ""}`}>{k.flow[o.step]}</span>
                </div>
                <p className="muted" style={{ fontSize: ".82rem" }}>{k.label} · {fmtDate(o.ts)}{o.total > 0 ? ` · ${rupiah(o.total)}` : ""}</p>
                {o.detail && <p className="muted" style={{ fontSize: ".82rem" }}>{o.detail}</p>}
                <div className="hist-steps" aria-hidden="true">
                  {k.flow.map((f, i) => <i key={f} className={i <= o.step ? "on" : ""} />)}
                </div>
                <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {o.items.length > 0 && <Link className="btn secondary hist-btn" href={`/invoice?id=${o.id}`}>🧾 Invoice</Link>}
                  {o.ref && <Link className="btn secondary hist-btn" href={o.ref}>Lihat</Link>}
                  {o.target && (o.kind !== "booking" || last) && <ReviewBox order={o} />}
                  {o.kind === "booking" && !last && <span className="muted" style={{ fontSize: ".78rem" }}>Ulasan dibuka setelah sesi selesai.</span>}
                  {!last && <button className="btn secondary hist-btn" onClick={() => advanceOrder(o.id)}>🧪 Demo: lanjut ke “{k.flow[o.step + 1]}”</button>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
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
    { id: "riwayat", label: "🗂️ Riwayat" },
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
        {validTab === "riwayat" && <TabRiwayat />}
        {validTab === "mentor" && <TabMentor user={user} updateUser={updateUser} />}
        {validTab === "seller" && <TabSeller user={user} updateUser={updateUser} />}
        {validTab === "organizer" && <TabOrganizer user={user} updateUser={updateUser} />}
      </div>
    </div>
  );
}
