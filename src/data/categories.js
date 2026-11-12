// Ikon + warna tiap jenis lomba (dipakai chip "Pilih jenis lomba" di landing page).
// Jenis baru yang belum didaftarkan di sini otomatis memakai tampilan DEFAULT.
// Format: "Nama jenis": [ikon, warna1, warna2]
export const CATEGORY_META = {
  "Esai/LKTI": ["📝", "#2F4860", "#7DA7D9"],
  "Business Case": ["💼", "#d6563a", "#FF9F7A"],
  "UI/UX": ["📱", "#6a58c7", "#B79AE8"],
  "Debat": ["🎤", "#2f9a7e", "#6FD3A8"],
  "Poster/Desain Grafis": ["🎨", "#d6567f", "#FF9EBB"],
  "Business Plan": ["💡", "#d9961a", "#FFD84D"],
  "Karya Tulis Ilmiah": ["🔬", "#1f6f78", "#5CC8C0"],
  "Hackathon/Coding": ["💻", "#3b4fa8", "#7FA0FF"],
  "Video/Film Pendek": ["🎬", "#b0452e", "#FF8A65"],
  "Fotografi": ["📷", "#2c7a9b", "#7DD3F0"],
  "Lainnya": ["🏅", "#3a6fb0", "#7DA7D9"],
};
const DEFAULT = ["🏆", "#3a6fb0", "#7DA7D9"];
export const catMeta = (name) => CATEGORY_META[name] || DEFAULT;
export const CATEGORY_ORDER = Object.keys(CATEGORY_META);
