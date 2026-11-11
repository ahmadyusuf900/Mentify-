const G = [
  "linear-gradient(135deg,#7DA7D9,#2F4860)",
  "linear-gradient(135deg,#2F4860,#7DA7D9)",
  "linear-gradient(135deg,#FFFFFF,#7DA7D9)",
  "linear-gradient(160deg,#7DA7D9,#FFFFFF)",
];

export default function Poster({ l, closed = false }) {
  return (
    <div className={`poster-wrap ${closed ? "is-closed" : ""}`}>
      {l.poster ? (
        <img className="poster" src={l.poster} alt={`Poster ${l.title}`} />
      ) : (
        <div className="poster" style={{ background: G[l.id % 4] }} role="img" aria-label={`Poster ${l.title}`}>
          <span className="badge">{l.type}</span>
          <div className="poster-text">
            <strong>{l.title}</strong>
            <span>{l.organizer}</span>
          </div>
        </div>
      )}
      {closed && <span className="stamp">Registration closed</span>}
    </div>
  );
}