// HeroArt.js — ilustrasi anime-chibi ORIGINAL (SVG) sebagai background heading.
// Server-component friendly: hanya SVG statis + class animasi CSS.

const N = "#2F4860", B = "#7DA7D9", W = "#FFFFFF", SK = "#F6D2B5";
const PK = "#FF9EBB", YL = "#FFD84D", MN = "#B79AE8", GN = "#6FD3A8", OR = "#FF9F68";

const Sparkle = ({ x, y, c = W, s = 1, cls = "fl" }) => (
  <g className={cls} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0-9 2-2 9 0 2 2 0 9 -2 2 -9 0 -2-2z" fill={c} />
  </g>
);

/* Karakter chibi: titik (0,0) = telapak kaki. Tinggi ±210 */
function Chibi({ x, y, s = 1, hair, outfit, accent = W, skin = SK, style = "spiky", flip = false, wave = false, item }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity=".14" />
      {/* kaki */}
      <rect x="-20" y="-40" width="15" height="40" rx="7" fill={N} />
      <rect x="5" y="-40" width="15" height="40" rx="7" fill={N} />
      <ellipse cx="-13" cy="-1" rx="13" ry="6" fill={W} />
      <ellipse cx="13" cy="-1" rx="13" ry="6" fill={W} />
      {/* rambut belakang */}
      {style === "long" && <path d="M-44 -118 Q-52 -40 -34 -26 L34 -26 Q52 -40 44 -118z" fill={hair} />}
      {style === "twin" && (<><ellipse cx="-50" cy="-96" rx="13" ry="34" fill={hair} /><ellipse cx="50" cy="-96" rx="13" ry="34" fill={hair} /></>)}
      {/* badan */}
      <path d="M-30 -42 Q-34 -92 -18 -102 L18 -102 Q34 -92 30 -42z" fill={outfit} />
      <path d="M-10 -102 L0 -88 L10 -102z" fill={accent} />
      {/* tangan */}
      <path d="M-28 -96 Q-48 -70 -40 -50" stroke={outfit} strokeWidth="13" strokeLinecap="round" fill="none" />
      {wave
        ? <path d="M28 -96 Q50 -122 44 -146" stroke={outfit} strokeWidth="13" strokeLinecap="round" fill="none" />
        : <path d="M28 -96 Q48 -70 40 -50" stroke={outfit} strokeWidth="13" strokeLinecap="round" fill="none" />}
      <circle cx="-40" cy="-47" r="7" fill={skin} />
      <circle cx={wave ? 44 : 40} cy={wave ? -148 : -47} r="7" fill={skin} />
      {item}
      {/* kepala */}
      <rect x="-7" y="-110" width="14" height="14" fill={skin} />
      <ellipse cx="0" cy="-142" rx="42" ry="40" fill={skin} />
      {/* poni */}
      {style === "spiky" && <path d="M-46 -140 Q-50 -190 -10 -186 L-24 -208 L0 -190 L16 -212 L22 -188 Q52 -186 46 -140 Q34 -164 22 -158 L10 -170 L-4 -156 L-18 -168 L-30 -150 Q-38 -158 -46 -140z" fill={hair} />}
      {style === "long" && <path d="M-46 -138 Q-50 -190 0 -188 Q50 -190 46 -138 Q38 -166 20 -166 Q4 -150 -4 -168 Q-24 -156 -30 -140 Q-38 -154 -46 -138z" fill={hair} />}
      {style === "twin" && <path d="M-44 -136 Q-48 -190 0 -188 Q48 -190 44 -136 Q34 -168 12 -164 Q-6 -148 -14 -166 Q-34 -160 -44 -136z" fill={hair} />}
      {style === "bun" && (<><circle cx="0" cy="-198" r="15" fill={hair} /><path d="M-44 -138 Q-48 -188 0 -186 Q48 -188 44 -138 Q32 -164 12 -160 Q-4 -146 -12 -162 Q-32 -158 -44 -138z" fill={hair} /></>)}
      {/* mata anime */}
      {[-17, 17].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy="-138" rx="9.5" ry="13" fill="#1d2b3a" />
          <ellipse cx={ex} cy="-135" rx="6.5" ry="9" fill={B} />
          <circle cx={ex - 3} cy="-142" r="3.8" fill={W} />
          <circle cx={ex + 3} cy="-132" r="1.8" fill={W} />
        </g>
      ))}
      <ellipse cx="-29" cy="-124" rx="7" ry="4" fill={PK} opacity=".55" />
      <ellipse cx="29" cy="-124" rx="7" ry="4" fill={PK} opacity=".55" />
      <path d="M-6 -122 Q0 -115 6 -122" stroke="#9b4a4a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  );
}

const Cloud = ({ x, y, s = 1, o = .9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} className="fl2">
    <ellipse cx="0" cy="0" rx="54" ry="18" fill={W} />
    <circle cx="-20" cy="-12" r="20" fill={W} /><circle cx="14" cy="-18" r="26" fill={W} />
  </g>
);

const Defs = ({ id, from, to }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} />
    </linearGradient>
  </defs>
);

/* ---------- MENTOR: mentor & mentee belajar bareng ---------- */
function MentorScene() {
  return (
    <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <Defs id="gm" from="#2F4860" to="#7DA7D9" />
      <rect width="1200" height="360" fill="url(#gm)" />
      <circle cx="930" cy="150" r="130" fill="#fff" opacity=".1" />
      <circle cx="1080" cy="60" r="60" fill="#fff" opacity=".08" />
      <Cloud x="760" y="60" s={.8} /><Cloud x="1100" y="120" s={.6} o={.7} />
      <Sparkle x="700" y="110" c={YL} s={1.4} /><Sparkle x="1130" y="40" s={1} cls="fl2" /><Sparkle x="820" y="200" c={PK} s={1} cls="fl3" />
      {/* papan tulis */}
      <g transform="translate(640 60)">
        <rect width="190" height="120" rx="10" fill="#244056" stroke="#fff" strokeWidth="5" />
        <path d="M20 40h90M20 64h140M20 88h70" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8" />
        <circle cx="150" cy="38" r="12" fill={YL} />
      </g>
      {/* lantai & meja */}
      <rect y="322" width="1200" height="38" fill="#1f3448" />
      <rect x="760" y="262" width="300" height="14" rx="7" fill="#fff" />
      <rect x="790" y="276" width="10" height="46" fill="#fff" /><rect x="1020" y="276" width="10" height="46" fill="#fff" />
      <rect x="840" y="232" width="86" height="30" rx="4" fill={MN} /><rect x="934" y="240" width="70" height="22" rx="3" fill={YL} />
      <Chibi x={820} y={322} s={1.05} hair="#2b3a67" outfit={B} accent={W} style="spiky" wave />
      <Chibi x={1010} y={322} s={.95} hair="#e0709a" outfit={MN} accent={YL} style="twin" flip
        item={<rect x="-30" y="-74" width="30" height="22" rx="3" fill={W} />} />
      <Chibi x={930} y={322} s={.75} hair="#6b4a2f" outfit={GN} accent={W} style="bun" />
    </svg>
  );
}

/* ---------- LOMBA: podium, piala, poster ---------- */
function LombaScene() {
  return (
    <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <Defs id="gl" from="#2F4860" to="#7b6fc9" />
      <rect width="1200" height="360" fill="url(#gl)" />
      {[...Array(14)].map((_, i) => (
        <rect key={i} x={600 + i * 46} y={i % 2 ? 0 : 20} width="14" height="14" rx="3"
          fill={[YL, PK, GN, OR][i % 4]} opacity=".85" className={i % 2 ? "fl" : "fl3"} transform={`rotate(${i * 25} ${607 + i * 46} 30)`} />
      ))}
      <Sparkle x="700" y="120" c={YL} s={1.5} /><Sparkle x="1120" y="110" s={1.1} cls="fl2" />
      {/* piala */}
      <g transform="translate(880 60)" className="fl2">
        <path d="M0 0h90v40q0 50-45 56Q0 90 0 40z" fill={YL} />
        <path d="M0 14H-20q0 34 24 38M90 14h20q0 34-24 38" stroke={YL} strokeWidth="9" fill="none" />
        <rect x="36" y="96" width="18" height="30" fill={YL} /><rect x="14" y="124" width="62" height="14" rx="5" fill={OR} />
        <path d="M45 14l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff" opacity=".9" />
      </g>
      {/* podium */}
      <rect y="322" width="1200" height="38" fill="#2a3b66" />
      <rect x="700" y="262" width="90" height="60" rx="6" fill="#fff" /><text x="745" y="302" textAnchor="middle" fontSize="30" fontWeight="800" fill={N}>2</text>
      <rect x="800" y="232" width="100" height="90" rx="6" fill={YL} /><text x="850" y="290" textAnchor="middle" fontSize="38" fontWeight="800" fill={N}>1</text>
      <rect x="910" y="282" width="90" height="40" rx="6" fill="#fff" /><text x="955" y="310" textAnchor="middle" fontSize="26" fontWeight="800" fill={N}>3</text>
      <Chibi x={745} y={262} s={.8} hair="#3a2d5c" outfit={PK} style="long" wave />
      <Chibi x={850} y={232} s={.85} hair="#1d2b3a" outfit={B} accent={YL} style="spiky" wave />
      <Chibi x={955} y={282} s={.72} hair="#c2773c" outfit={GN} style="bun" />
      {/* poster */}
      <g transform="translate(1040 90) rotate(6)">
        <rect width="110" height="150" rx="8" fill="#fff" /><rect x="10" y="10" width="90" height="60" rx="5" fill={B} />
        <path d="M14 96h80M14 114h60" stroke={N} strokeWidth="6" strokeLinecap="round" opacity=".6" />
        <circle cx="55" cy="40" r="14" fill={YL} />
      </g>
    </svg>
  );
}

/* ---------- MARKET: toko produk digital ---------- */
function MarketScene() {
  return (
    <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <Defs id="gk" from="#2F4860" to="#3fa38a" />
      <rect width="1200" height="360" fill="url(#gk)" />
      <circle cx="960" cy="150" r="140" fill="#fff" opacity=".08" />
      <Sparkle x="690" y="90" c={YL} s={1.3} /><Sparkle x="1130" y="70" s={1} cls="fl2" />
      {/* kios */}
      <rect y="322" width="1200" height="38" fill="#1f4a46" />
      <g transform="translate(720 90)">
        <path d="M0 40h330l-20-40H20z" fill={PK} />
        {[...Array(6)].map((_, i) => <rect key={i} x={i * 55} y="0" width="27" height="40" fill="#fff" opacity=".9" transform="skewX(0)" />)}
        <rect x="10" y="40" width="310" height="192" fill="#e9fbf3" opacity=".95" />
        <rect x="20" y="60" width="130" height="86" rx="8" fill={B} /><rect x="168" y="60" width="130" height="86" rx="8" fill={MN} />
        <rect x="20" y="160" width="130" height="14" rx="7" fill="#fff" /><rect x="168" y="160" width="130" height="14" rx="7" fill="#fff" />
        {/* dokumen */}
        <rect x="46" y="72" width="54" height="68" rx="4" fill="#fff" /><path d="M56 88h34M56 102h34M56 116h22" stroke={N} strokeWidth="4" strokeLinecap="round" />
        <rect x="200" y="74" width="70" height="52" rx="5" fill="#fff" /><circle cx="235" cy="100" r="14" fill={YL} />
      </g>
      <Chibi x={690} y={322} s={.95} hair="#7a3b2e" outfit={OR} accent={W} style="long" wave />
      <Chibi x={1110} y={322} s={.85} hair="#1f2f55" outfit={B} style="spiky" flip
        item={<g transform="translate(-52 -86)"><rect width="34" height="26" rx="4" fill={YL} /><path d="M6 6h22" stroke={N} strokeWidth="3" /></g>} />
      {/* floating produk */}
      <g className="fl" transform="translate(640 140)"><rect width="46" height="58" rx="5" fill="#fff" /><path d="M9 16h28M9 28h28M9 40h18" stroke={N} strokeWidth="4" strokeLinecap="round" /></g>
      <g className="fl3" transform="translate(1160 190)"><circle r="20" fill={YL} /><text textAnchor="middle" y="7" fontSize="20" fontWeight="800" fill={N}>Rp</text></g>
    </svg>
  );
}

const SCENES = { mentor: MentorScene, lomba: LombaScene, market: MarketScene };

export default function HeroArt({ theme }) {
  const Scene = SCENES[theme] || MentorScene;
  return <div className="hero-bg" aria-hidden="true"><Scene /></div>;
}
