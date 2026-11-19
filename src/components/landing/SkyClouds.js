// Awan gaya anime: putih lembut dengan bayangan biru muda di bawah, bergerak pelan ke kanan.
const SHAPE = (
  <>
    <circle cx="60" cy="86" r="30" /><circle cx="112" cy="64" r="44" /><circle cx="170" cy="54" r="50" />
    <circle cx="228" cy="72" r="38" /><circle cx="270" cy="90" r="26" /><rect x="40" y="84" width="250" height="32" rx="16" />
  </>
);

function Cloud({ id }) {
  return (
    <svg viewBox="0 0 310 130" aria-hidden="true">
      <g fill="#BFDDF6" transform="translate(0 8)">{SHAPE}</g>
      <g fill="#ffffff">{SHAPE}</g>
      <g fill="#E9F4FE"><path d="M70 108c40 10 120 12 210-4v10c-70 14-160 12-210 0z" /></g>
      <path d="M96 40c14-14 34-18 52-12M160 26c14-6 30-4 40 6" stroke="#E4F1FC" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".9" />
    </svg>
  );
}

// top, lebar, durasi, jeda (negatif supaya langsung tersebar), opasitas, posisi statis
const CLOUDS = [
  ["6%", "300px", "95s", "-12s", 1, "8vw"],
  ["30%", "190px", "70s", "-48s", .9, "55vw"],
  ["14%", "240px", "120s", "-80s", .95, "78vw"],
  ["52%", "340px", "110s", "-30s", 1, "30vw"],
  ["68%", "200px", "80s", "-60s", .85, "70vw"],
  ["40%", "150px", "60s", "-20s", .8, "18vw"],
];

export default function SkyClouds() {
  return (
    <div className="sky" aria-hidden="true">
      {CLOUDS.map(([t, w, d, dl, o, x], i) => (
        <div key={i} className="cl" style={{ "--t": t, "--w": w, "--w0": w, "--d": d, "--dl": dl, "--o": o, "--x": x }}>
          <Cloud />
        </div>
      ))}
      <div className="band">
        <svg viewBox="0 0 1600 120" preserveAspectRatio="none">
          <g fill="#fff" opacity=".85">
            <ellipse cx="120" cy="96" rx="170" ry="26" /><ellipse cx="420" cy="84" rx="220" ry="30" /><ellipse cx="760" cy="100" rx="190" ry="24" />
            <ellipse cx="1000" cy="92" rx="170" ry="26" /><ellipse cx="1320" cy="86" rx="230" ry="32" /><ellipse cx="1560" cy="100" rx="160" ry="22" />
          </g>
          <g fill="#fff" opacity=".6"><ellipse cx="260" cy="112" rx="260" ry="20" /><ellipse cx="900" cy="116" rx="300" ry="20" /><ellipse cx="1400" cy="114" rx="240" ry="18" /></g>
        </svg>
      </div>
    </div>
  );
}
