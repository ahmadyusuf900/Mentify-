export default function Empty({ text = "Tidak ada hasil. Coba ubah kata kunci atau filter." }) {
  return <p className="muted" style={{ padding: "24px 0" }}>{text}</p>;
}
