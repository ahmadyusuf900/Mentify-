const G = [
  "linear-gradient(160deg,#7DA7D9,#2F4860)",
  "linear-gradient(160deg,#2F4860,#7DA7D9)",
  "linear-gradient(160deg,#7DA7D9,#7DA7D9)",
];

// Foto portrait gaya pas foto kartu ID. Jika m.photo kosong, tampil siluet pengganti.
export default function MentorAvatar({ m, size = "" }) {
  return (
    <div className={`mphoto ${size}`}>
      {m.photo ? (
        <img src={m.photo} alt={`Foto ${m.name}`} />
      ) : (
        <div className="mphoto-ph" style={{ background: G[m.id % 3] }} role="img" aria-label={`Foto ${m.name}`}>
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <circle cx="50" cy="42" r="20" fill="rgba(255,255,255,.9)" />
            <path d="M12 120c0-26 17-42 38-42s38 16 38 42z" fill="rgba(255,255,255,.9)" />
          </svg>
        </div>
      )}
    </div>
  );
}