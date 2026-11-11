// [judul, penyelenggara, jenis, peserta, biaya, mode, provinsi, mulai, tutup, dilihat, suka]
const rows = [
 ["LKTI Nasional Inovasi Hijau","Universitas Diponegoro","Esai/LKTI",["Mahasiswa"],75000,"Online","Jawa Tengah","2026-10-01","2026-12-10",1240,38],
 ["National Business Case Competition","FEB Universitas Indonesia","Business Case",["Mahasiswa"],150000,"Offline","DKI Jakarta","2026-09-20","2026-11-08",2310,64],
 ["Poster Infografis Hari Pahlawan","BEM UNNES","Poster/Desain Grafis",["SMA","Mahasiswa"],0,"Online","Jawa Tengah","2026-09-25","2026-10-25",780,21],
 ["UI/UX Design Challenge","Himpunan Informatika ITB","UI/UX",["Mahasiswa"],75000,"Online","Jawa Barat","2026-10-10","2026-12-05",1685,52],
 ["NUDC Debat Regional","Pusat Prestasi Nasional","Debat",["Mahasiswa"],0,"Offline","DKI Jakarta","2026-10-01","2026-11-20",990,27],
 ["Business Plan Startup Cup","UB Entrepreneur","Business Plan",["Mahasiswa","Umum"],100000,"Online & Offline","Jawa Timur","2026-07-01","2026-09-15",1420,45],
 ["Lomba Esai Nasional Pendidikan","Universitas Pendidikan Indonesia","Esai/LKTI",["SMA","Mahasiswa"],25000,"Online","Jawa Barat","2026-10-05","2026-11-12",870,19],
 ["Desain Logo Festival Budaya","Dinas Kebudayaan Jawa Tengah","Poster/Desain Grafis",["Umum"],0,"Online","Jawa Tengah","2026-07-15","2026-08-30",540,12],
 ["Hackathon UI/UX Fintech","Bank Digital X","UI/UX",["Mahasiswa","Umum"],0,"Online","DKI Jakarta","2026-11-01","2027-01-15",2050,71],
 ["Debat Bahasa Inggris Pelajar","Universitas Sebelas Maret","Debat",["SMA"],50000,"Offline","Jawa Tengah","2026-08-20","2026-10-01",660,16],
 ["Lomba Karya Tulis Ilmiah Kesehatan","Universitas Airlangga","Karya Tulis Ilmiah",["Mahasiswa"],60000,"Online","Jawa Timur","2026-10-15","2026-12-20",930,24],
 ["Olimpiade Sains Pelajar & Mahasiswa","Pusat Prestasi Nasional","Lainnya",["SMP","SMA","Mahasiswa"],0,"Online","DKI Jakarta","2026-10-20","2026-11-06",1730,40],
];

const REQ = {
 "Esai/LKTI": ["Naskah orisinal dan belum pernah dipublikasikan","Format PDF, maksimal 15 halaman","Individu atau tim maksimal 3 orang"],
 "Karya Tulis Ilmiah": ["Karya orisinal dengan metodologi jelas","Melampirkan daftar pustaka","Tim maksimal 3 orang + 1 dosen pembimbing"],
 "Business Case": ["Tim 3 orang dari perguruan tinggi yang sama","Mengirim ringkasan solusi (maks. 5 slide)","Mahasiswa aktif, dibuktikan KTM"],
 "Business Plan": ["Ide bisnis orisinal","Proposal PDF + proyeksi keuangan","Tim 2–4 orang"],
 "Poster/Desain Grafis": ["Karya orisinal, bukan hasil AI penuh","Format JPG/PNG, resolusi minimal 300 dpi","Maksimal 2 karya per peserta"],
 "UI/UX": ["Prototipe Figma dengan akses publik","Melampirkan case study singkat","Individu atau tim maksimal 3 orang"],
 "Debat": ["Tim 3 orang dengan 1 cadangan","Mengikuti format debat yang ditentukan panitia","Peserta wajib hadir saat technical meeting"],
 "Lainnya": ["Peserta berstatus pelajar atau mahasiswa","Mengisi formulir pendaftaran","Mengikuti seluruh babak sesuai jadwal"],
};

const iso = (s, d = 0) => {
  const x = new Date(s + "T12:00:00");
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export const lomba = rows.map(([title, organizer, type, levels, fee, mode, province, start, end, views, likes], i) => {
  const handle = organizer.toLowerCase().replace(/[^a-z]+/g, "");
  return {
    id: i + 1, title, organizer, type, levels, fee, mode, province, start, end, views, likes,
    deadline: end,
    level: levels.join(", "),
    poster: null, // ganti dengan "/lomba/nama-file.jpg" (file ditaruh di folder public/lomba)
    desc: `${title} adalah kompetisi ${type.toLowerCase()} yang diselenggarakan oleh ${organizer}. Terbuka untuk ${levels.join(", ").toLowerCase()} dari seluruh Indonesia. Peserta akan melewati tahap seleksi karya dan penjurian oleh praktisi serta akademisi di bidangnya.`,
    prizes: ["Juara 1: Rp5.000.000 + piala + sertifikat", "Juara 2: Rp3.500.000 + sertifikat", "Juara 3: Rp2.500.000 + sertifikat", "E-sertifikat untuk seluruh peserta"],
    requirements: REQ[type],
    timeline: [["Pendaftaran dibuka", start], ["Pendaftaran ditutup", end], ["Seleksi dan penjurian", iso(end, 7)], ["Pengumuman pemenang", iso(end, 21)]],
    contact: "@" + handle,
    // Tautan contoh. Ganti dengan alamat asli tiap lomba.
    links: [
      ["Website resmi", `https://example.com/lomba/${i + 1}`],
      ["Instagram penyelenggara", `https://instagram.com/${handle}`],
      ["Guidebook (PDF)", `https://example.com/lomba/${i + 1}/guidebook.pdf`],
    ],
  };
});

export const lombaTypes = [...new Set(rows.map((r) => r[2]))];
export const lombaLevels = ["SMP", "SMA", "Mahasiswa", "Umum"];
export const lombaProvinces = [...new Set(rows.map((r) => r[6]))];

// Tutup bila tanggal tutup sudah lewat. `now` berasal dari useNow().
export const isClosed = (l, now) => !!now && new Date(l.end + "T23:59:59") < now;
export const daysLeft = (l, now) => (now ? Math.ceil((new Date(l.end + "T23:59:59") - now) / 86400000) : null);
export const fmtDate = (s) => new Date(s + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
export const feeText = (l) => (l.fee === 0 ? "Gratis" : "Rp" + l.fee.toLocaleString("id-ID"));