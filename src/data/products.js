export const FREE_QUOTA = 3; // batas akses gratis akun premium per bulan
export const PRODUCT_FEE = 1000;
export const PROMO = { code: "MENTIFY10", pct: 10 };

// [judul, kategori, harga, harga coret (0 = tidak ada), penjual, rating, ulasan, terjual, format, halaman, ukuran, jenis lomba]
const rows = [
 ["Esai Juara 1 LKTI Nasional 2025","Esai Juara",35000,0,"Alya Putri",4.9,86,312,"PDF",24,"1,8 MB","Esai/LKTI"],
 ["Template Business Plan Lengkap","Template",45000,60000,"Dimas Anggara",4.8,64,254,"DOCX + XLSX",18,"3,1 MB","Business Plan"],
 ["Materi Debat: Case Building","Materi Lomba",30000,0,"Bima Aditya",4.7,41,188,"PDF",32,"2,2 MB","Debat"],
 ["UI Kit Figma untuk Lomba","Template",55000,75000,"Nadia Safira",4.9,72,276,"Figma",60,"12 MB","UI/UX"],
 ["Kumpulan Poster Juara + File Editable","Desain",40000,0,"Citra Lestari",4.6,38,141,"PSD + AI",20,"48 MB","Poster/Desain Grafis"],
 ["Panduan Menyusun Proposal PKM","Materi Lomba",25000,0,"Eka Ramadhani",4.5,29,167,"PDF",28,"1,5 MB","Karya Tulis Ilmiah"],
 ["Esai Juara Debat Kebijakan Publik","Esai Juara",30000,0,"Gita Maharani",4.6,33,119,"PDF",16,"1,2 MB","Debat"],
 ["Pitch Deck Juara Business Case","Template",50000,65000,"Raka Pratama",4.8,58,203,"PPTX",25,"9 MB","Business Case"],
 ["Checklist Persiapan Lomba UI/UX","Materi Lomba",20000,0,"Hadi Setiawan",4.5,22,96,"PDF",8,"0,8 MB","UI/UX"],
 ["Naskah KTI Kesehatan Juara","Esai Juara",40000,0,"Farhan Maulana",4.7,47,174,"PDF",30,"2,6 MB","Karya Tulis Ilmiah"],
 ["Paket Template Infografis Editable","Desain",35000,50000,"Joko Santoso",4.4,19,88,"Canva + AI",15,"22 MB","Poster/Desain Grafis"],
 ["Proyeksi Keuangan Agribisnis (Excel)","Template",42000,0,"Intan Permata",4.7,36,132,"XLSX",12,"1,1 MB","Business Plan"],
];

const CAT = {
 "Esai Juara": { icon: "📝",
   includes: ["Naskah lengkap pemenang", "Catatan dan komentar penilaian juri", "Kerangka dan struktur yang bisa ditiru", "Daftar referensi yang dipakai"],
   who: ["Peserta lomba esai atau karya tulis", "Yang ingin melihat standar naskah juara", "Pemula yang bingung menyusun struktur"] },
 "Materi Lomba": { icon: "📚",
   includes: ["Modul materi bertahap", "Latihan dan studi kasus", "Checklist persiapan", "Tips dari pengalaman juara"],
   who: ["Peserta yang baru pertama ikut lomba", "Tim yang butuh panduan terarah", "Yang ingin belajar mandiri sebelum konsultasi mentor"] },
 "Template": { icon: "🧩",
   includes: ["File template yang bisa diedit", "Contoh pengisian", "Panduan singkat pemakaian", "Pembaruan gratis untuk versi berikutnya"],
   who: ["Tim yang dikejar tenggat", "Peserta yang ingin tampilan profesional", "Pemula yang butuh contoh format"] },
 "Desain": { icon: "🎨",
   includes: ["File sumber yang bisa diedit", "Palet warna dan font yang dipakai", "Contoh karya jadi (JPG/PNG)", "Panduan lisensi pemakaian"],
   who: ["Peserta lomba poster dan infografis", "Desainer pemula", "Panitia yang butuh referensi visual"] },
};
const POOL = [
 ["Siti", "Isinya rapi dan langsung bisa dipraktikkan. Worth it untuk harganya."],
 ["Andi", "Banyak contoh nyata, jadi tidak bingung mulai dari mana."],
 ["Rina", "File lengkap dan mudah diedit. Sangat membantu menjelang deadline."],
 ["Budi", "Penjelasannya runtut, cocok untuk pemula."],
];

export const products = rows.map(([title, category, price, oldPrice, seller, rating, reviewCount, sold, format, pages, size, lombaType], i) => ({
  id: i + 1, title, category, price, oldPrice, seller, rating, reviewCount, sold, format, pages, size, lombaType,
  cover: null, // ganti "/produk/nama.jpg" (taruh di public/produk)
  code: `PRD-26-${String(i + 1).padStart(3, "0")}`,
  icon: CAT[category].icon, includes: CAT[category].includes, who: CAT[category].who,
  updated: "Oktober 2026", lang: "Indonesia",
  desc: `${title} disusun oleh ${seller}, mentor Mentify yang berpengalaman di lomba ${lombaType}. Materi ini dirancang agar kamu bisa langsung mempraktikkannya, mulai dari memahami standar penilaian sampai menyiapkan karya yang siap dikirim.`,
  reviews: [0, 1, 2].map((k) => ({ by: POOL[(i + k) % 4][0], stars: k === 2 ? 4 : 5, text: POOL[(i + k) % 4][1], date: ["5 Nov 2026", "30 Okt 2026", "21 Okt 2026"][k] })),
}));

export const productCategories = [...new Set(rows.map((r) => r[1]))];
export const productIcons = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [k, v.icon]));
export const productLombaTypes = [...new Set(rows.map((r) => r[11]))];