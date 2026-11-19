import Link from "next/link";

// Logo = gambar /public/logo.png (maskot Mentify) + tulisan. Untuk ganti: timpa public/logo.png
// (atau ubah LOGO_SRC), dan set SHOW_TEXT=false bila gambarmu sudah memuat tulisan "Mentify".
const LOGO_SRC = "/logo.png";
const SHOW_TEXT = true;

export default function Logo({ href, onClick, label = "Mentify, kembali ke beranda" }) {
  const body = (
    <>
      <img src={LOGO_SRC} alt="" width="44" height="40" className="logo-img" />
      {SHOW_TEXT && <span className="logo-text">Menti<span>fy</span></span>}
    </>
  );
  return href ? <Link href={href} className="logo" aria-label={label} onClick={onClick}>{body}</Link>
              : <span className="logo">{body}</span>;
}
