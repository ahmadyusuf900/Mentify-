const G = [
  "linear-gradient(135deg,#FFFFFF,#7DA7D9)",
  "linear-gradient(135deg,#7DA7D9,#2F4860)",
  "linear-gradient(135deg,#7DA7D9,#FFFFFF)",
  "linear-gradient(135deg,#2F4860,#7DA7D9)",
];

// Sampul produk. Jika p.cover kosong, tampil sampul buatan dari ikon dan format file.
export default function ProductCover({ p, ratio = "4/3" }) {
  return (
    <div className="pcover" style={{ aspectRatio: ratio }}>
      {p.cover ? (
        <img src={p.cover} alt={`Sampul ${p.title}`} />
      ) : (
        <div className="pcover-ph" style={{ background: G[p.id % 4] }} role="img" aria-label={`Sampul ${p.title}`}>
          <span className="pcover-icon">{p.icon}</span>
          <span className="pcover-fmt">{p.format}</span>
        </div>
      )}
    </div>
  );
}