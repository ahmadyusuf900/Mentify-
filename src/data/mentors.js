// Nomor admin ini hanya contoh. Ganti dengan nomor asli.
export const ADMIN_WA = { label: "0812-0000-0000", url: "https://wa.me/628120000000" };
export const ADMIN_FEE = 2500;
export const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const DURATIONS = [60, 90, 120];
export const FORMATS = ["Google Meet", "Zoom", "WhatsApp Video Call"];
export const PAYMENTS = [
  { key: "QRIS", note: "Semua e-wallet & m-banking" },
  { key: "Transfer Bank", note: "Virtual account", sub: ["BCA", "Mandiri", "BNI", "BRI"] },
  { key: "E-Wallet", note: "Bayar lewat aplikasi", sub: ["GoPay", "OVO", "DANA", "ShopeePay"] },
];

// [nama, kampus, jurusan, angkatan, kategori, harga/60 menit, rating, prestasi utama, hari tersedia (0=Minggu)]
const rows = [
 ["Alya Putri","Universitas Gadjah Mada","Ilmu Komunikasi",2022,"Esai/LKTI",75000,4.9,"Juara 1 LKTI Nasional 2025",[1,3,6]],
 ["Raka Pratama","Universitas Indonesia","Manajemen",2021,"Business Case",90000,4.8,"Finalis National Business Case Competition 2025",[2,4,0]],
 ["Nadia Safira","Institut Teknologi Bandung","Teknik Informatika",2022,"UI/UX",85000,4.9,"Juara 1 UI/UX Gemastik 2025",[1,2,5]],
 ["Bima Aditya","Universitas Diponegoro","Ilmu Hukum",2022,"Debat",60000,4.7,"Best Speaker NUDC 2025",[3,5,6]],
 ["Citra Lestari","Institut Teknologi Sepuluh Nopember","Desain Komunikasi Visual",2023,"Poster/Desain Grafis",65000,4.6,"Juara 1 Poster Infografis Nasional 2025",[2,4,6]],
 ["Dimas Anggara","Universitas Brawijaya","Akuntansi",2021,"Business Plan",80000,4.8,"Juara 1 Business Plan Competition 2025",[1,4,0]],
 ["Eka Ramadhani","Universitas Negeri Semarang","Pendidikan Biologi",2022,"Esai/LKTI",55000,4.5,"Finalis PIMNAS 2025",[2,3,5]],
 ["Farhan Maulana","Universitas Airlangga","Kesehatan Masyarakat",2021,"Karya Tulis Ilmiah",70000,4.7,"Juara 1 KTI Kesehatan Nasional 2025",[1,3,6]],
 ["Gita Maharani","Universitas Sebelas Maret","Sastra Inggris",2022,"Debat",60000,4.6,"Juara 1 Debat Bahasa Inggris Provinsi 2025",[4,5,0]],
 ["Hadi Setiawan","Universitas Padjadjaran","Sistem Informasi",2023,"UI/UX",70000,4.5,"Finalis Hackathon UI/UX 2025",[2,6,0]],
 ["Intan Permata","IPB University","Agribisnis",2022,"Business Plan",75000,4.7,"Juara 2 Lomba Wirausaha Agribisnis 2025",[1,3,5]],
 ["Joko Santoso","Universitas Negeri Yogyakarta","Pendidikan Seni Rupa",2023,"Poster/Desain Grafis",50000,4.4,"Juara 3 Poster Kampanye Nasional 2025",[3,4,6]],
];

export const CAT = {
 "Esai/LKTI": { tags: ["Struktur esai", "Riset & sitasi", "Review naskah"], help: ["Review dan revisi naskah", "Brainstorming ide dan judul", "Persiapan presentasi finalis"] },
 "Karya Tulis Ilmiah": { tags: ["Metodologi", "Statistik dasar", "Penulisan ilmiah"], help: ["Merancang metodologi penelitian", "Review naskah dan daftar pustaka", "Simulasi tanya jawab juri"] },
 "Business Case": { tags: ["Analisis pasar", "Framework", "Pitch deck"], help: ["Menyusun framework solusi", "Review slide dan alur presentasi", "Simulasi presentasi dan Q&A"] },
 "Business Plan": { tags: ["Proyeksi keuangan", "Model bisnis", "Pitching"], help: ["Menyusun model bisnis", "Menghitung proyeksi keuangan", "Latihan pitching"] },
 "UI/UX": { tags: ["Figma", "Riset pengguna", "Prototyping"], help: ["Review alur dan prototipe Figma", "Menyusun case study", "Latihan presentasi desain"] },
 "Debat": { tags: ["Case building", "Rebuttal", "Public speaking"], help: ["Menyusun kasus dan argumen", "Latihan rebuttal dan POI", "Simulasi debat satu lawan satu"] },
 "Poster/Desain Grafis": { tags: ["Layout", "Tipografi", "Infografis"], help: ["Review komposisi dan warna", "Menyusun alur infografis", "Teknik Illustrator dan Canva"] },
};
const POOL = [
 ["Siti", "Penjelasan runtut, hasil karyaku naik level dalam satu sesi."],
 ["Andi", "Sabar, tepat waktu, dan masukannya spesifik."],
 ["Rina", "Dapat banyak insight untuk babak final, worth it!"],
 ["Budi", "Materinya terarah dan ada langkah lanjutan setelah sesi."],
];

export const mentors = rows.map(([name, campus, major, year, category, price, rating, highlight, days], i) => ({
  id: i + 1, name, campus, major, year, category, price, rating, highlight, days,
  photo: `/mentor/mentor-${i + 1}.svg`, // GANTI FOTO: taruh file di public/mentor lalu ubah path ini (mis. "/mentor/alya.jpg"), atau timpa file dengan nama sama
  code: `MTF-26-${String(i + 1).padStart(3, "0")}`,
  joined: i % 3 === 0 ? "Januari 2026" : "Maret 2026",
  tags: CAT[category].tags, help: CAT[category].help,
  bio: `Mahasiswa ${major} ${campus} angkatan ${year}. ${highlight}. Senang mendampingi peserta dari nol sampai siap submit, dengan feedback yang jujur dan bisa langsung dipraktikkan.`,
  languages: category === "Debat" ? ["Indonesia", "Inggris"] : ["Indonesia"],
  slots: ["09:00", "11:00", "13:00", "15:00", "19:00", "20:30"],
  sessions: 20 + i * 7, students: 14 + i * 5, reviewCount: 12 + i * 5, response: "< 2 jam",
  achievements: [highlight, `Finalis ${category} tingkat nasional 2024`, `Mentor aktif di Mentify sejak ${i % 3 === 0 ? "2026" : "Maret 2026"}`],
  docs: [["KTM mahasiswa aktif", "Terverifikasi"], ["Sertifikat lomba", "Terverifikasi"], ["CV", "Terverifikasi"]],
  reviews: [0, 1, 2].map((k) => ({
    by: POOL[(i + k) % 4][0], stars: k === 2 ? 4 : 5, text: POOL[(i + k) % 4][1],
    date: ["2 Nov 2026", "28 Okt 2026", "19 Okt 2026"][k],
  })),
}));

// Dipanggil dari dashboard mentor. f: {name, campus, major, category, price, highlight, photo, owner}
export function makeMentor(f, id) {
  const c = CAT[f.category] || { tags: [f.category, "Review karya", "Strategi lomba"], help: ["Review karya dan strategi", "Brainstorming ide", "Simulasi presentasi"] };
  const hl = f.highlight || `Mentor baru bidang ${f.category}`;
  return {
    id, name: f.name, campus: f.campus, major: f.major, year: new Date().getFullYear() - 2, category: f.category,
    price: Number(f.price), rating: 0, highlight: hl, days: [1, 3, 6], photo: f.photo || null,
    code: `MTF-26-${id}`, joined: "November 2026", tags: c.tags, help: c.help,
    bio: `Mahasiswa ${f.major} ${f.campus}. ${hl}. Siap mendampingi persiapan lomba ${f.category.toLowerCase()} dengan feedback yang jujur dan praktis.`,
    languages: ["Indonesia"], slots: ["09:00", "11:00", "13:00", "15:00", "19:00", "20:30"],
    sessions: 0, students: 0, reviewCount: 0, response: "< 24 jam", achievements: [hl],
    docs: [["KTM mahasiswa aktif", "Menunggu verifikasi"], ["Sertifikat lomba", "Menunggu verifikasi"], ["CV", "Menunggu verifikasi"]],
    reviews: [], status: "pending", owner: f.owner, isNew: true,
  };
}

export const mentorCategories = [...new Set(rows.map((r) => r[4]))];
export const mentorCampuses = [...new Set(rows.map((r) => r[1]))];

const MULT = { 60: 1, 90: 1.4, 120: 1.8 };
export const priceFor = (m, mins) => Math.round((m.price * MULT[mins]) / 1000) * 1000;
export const priceRange = (m) => [priceFor(m, 60), priceFor(m, 120)];