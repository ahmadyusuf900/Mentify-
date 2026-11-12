// Baca file gambar jadi data-URL (disimpan di localStorage untuk demo). Maks 400 KB; selain itu null.
export function readImage(file, max = 400 * 1024) {
  return new Promise((res) => {
    if (!file || !file.type?.startsWith("image/") || file.size > max) return res(null);
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => res(null);
    r.readAsDataURL(file);
  });
}
