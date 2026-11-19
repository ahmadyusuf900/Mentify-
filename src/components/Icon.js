// Ikon garis (outline) buatan sendiri, serasi satu sama lain. Warna mengikuti teks (currentColor).
// Pakai: <Icon name="trophy" />  atau  <Em e="🏆" /> (memetakan emoji lama ke ikon).
const P = {
  grad: '<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11.2V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.8"/><path d="M22 9v6"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a2 2 0 0 0 0 4h3M16 6h3a2 2 0 0 1 0 4h-3"/><path d="M12 13v4M8 20h8M9.5 17h5"/>',
  book: '<path d="M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2z"/><path d="M12 6.5v13"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.5-1.9-.3-1 .4-2.1 1.5-2.1H17a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10.5" cy="7" r=".8"/><circle cx="15.5" cy="7.5" r=".8"/>',
  megaphone: '<path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M18.5 9a4 4 0 0 1 0 6M7 15l1.2 4.5h2.3L9.5 16.5"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/>',
  buoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>',
  hourglass: '<path d="M7 3h10M7 21h10M8 3v3.5a4 4 0 0 0 1.6 3.2L12 12l-2.4 2.3A4 4 0 0 0 8 17.5V21M16 3v3.5a4 4 0 0 1-1.6 3.2L12 12l2.4 2.3a4 4 0 0 1 1.6 3.2V21"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  trenddown: '<path d="m3 7 6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
  sprout: '<path d="M12 21v-8"/><path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9.5h8M8 12.5h5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15v4M17 17h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  teacher: '<path d="M3 4h18M5 4v10h14V4"/><path d="M12 14v4M8 21l4-3 4 3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.4-2.5-1.2M12 6.5V8m0 8v1.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.3c2 .7 3.5 2.4 3.5 5.7"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6.5z"/>',
  warning: '<path d="M12 3.5 22 20H2L12 3.5z"/><path d="M12 10v4.5M12 17.2v.3"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16 9.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7.5 15h9"/>',
  printer: '<path d="M7 9V3h10v6"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  package: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
  heart: '<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3z"/>',
  medal: '<circle cx="12" cy="15" r="5.5"/><path d="m8.5 10.5-2-7.5h4l1.5 4M15.5 10.5l2-7.5h-4l-1.5 4"/>',
  gift: '<rect x="3.5" y="8" width="17" height="5" rx="1"/><path d="M5 13v7h14v-7M12 8v12"/><path d="M12 8c-2.5 0-4-1-4-2.5S9 3 10.5 4 12 8 12 8zm0 0c2.5 0 4-1 4-2.5S15 3 13.5 4 12 8 12 8z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  film: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 4.5v15M17 4.5v15M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
  camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.8"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2.5 19h19l-1.5-4H4z"/>',
  briefcase: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18"/>',
  school: '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-5h6v5M12 13v.1"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-6h4v6"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 4v4.5H8M12 8v4.5l3 1.8"/>',
  bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17z"/><path d="M10 21h4"/>',
  logout: '<path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pen: '<path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.2A9.6 9.6 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.4 7.6C3.6 9.4 2 12 2 12s3.6 6 10 6c1.4 0 2.7-.3 3.8-.8"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5 12.5V20h14v-7.5M10 20v-4.5h4V20"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
};
// emoji lama → [ikon, warna opsional, isi?]
const MAP = {
  "🎓": ["grad"], "🏆": ["trophy"], "📚": ["book"], "📝": ["file"], "💡": ["bulb"], "🎨": ["palette"], "📣": ["megaphone"],
  "🛍️": ["bag"], "🛍": ["bag"], "🛒": ["bag"], "🔍": ["search"], "🔎": ["search"], "⭐": ["star", "#F5A623", true], "🧾": ["receipt"],
  "🛟": ["buoy"], "⏱️": ["timer"], "⏱": ["timer"], "⏳": ["hourglass"], "🔑": ["key"], "🧭": ["compass"], "📉": ["trenddown"],
  "🤝": ["shield"], "🌱": ["sprout"], "💬": ["chat"], "📱": ["phone"], "✨": ["sparkle"], "🆕": ["sparkle", "#F5A623"],
  "🧑‍🏫": ["teacher"], "🎯": ["target"], "📅": ["calendar"], "🗓️": ["calendar"], "🗓": ["calendar"], "💰": ["coin"], "💸": ["coin"],
  "👥": ["users"], "👁": ["eye"], "👁️": ["eye"], "👀": ["eye"], "📍": ["pin"], "📌": ["pin"], "🗂️": ["folder"], "🗂": ["folder"],
  "⚠️": ["warning", "#E08A00"], "⚠": ["warning", "#E08A00"], "✅": ["checkcircle", "#2FA37F"], "🧪": ["flask"], "🔬": ["flask"],
  "🖨️": ["printer"], "🖨": ["printer"], "📦": ["package"], "🤍": ["heart"], "❤": ["heart", "#E5547A", true], "🔖": ["bookmark"],
  "🥇": ["medal", "#E6A700", true], "🥈": ["medal", "#8E9AAF", true], "🥉": ["medal", "#C07A3A", true], "📜": ["file"], "🎁": ["gift"],
  "🧩": ["grid"], "🎤": ["mic"], "🎬": ["film"], "📷": ["camera"], "💻": ["laptop"], "💼": ["briefcase"], "🏅": ["medal"],
  "🏫": ["school"], "🌙": ["moon"], "☀️": ["sun"], "☀": ["sun"],
};
const EMOJI_RE = new RegExp("(" + Object.keys(MAP).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "g");

export function Icon({ name, size, className = "", style, color, fill }) {
  const body = P[name] || P.sparkle;
  return (
    <svg className={`ic-svg ${className}`} viewBox="0 0 24 24" width={size || "1em"} height={size || "1em"} fill={fill ? color || "currentColor" : "none"}
      stroke={color || "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}
      dangerouslySetInnerHTML={{ __html: body }} />
  );
}

export function Em({ e, ...rest }) {
  const m = MAP[e];
  if (!m) return <>{e}</>;
  return <Icon name={m[0]} color={m[1]} fill={m[2]} {...rest} />;
}

// Ubah string yang memuat emoji menjadi potongan teks + ikon.
export function emo(str) {
  if (typeof str !== "string") return str;
  const parts = str.split(EMOJI_RE);
  return parts.map((p, i) => (MAP[p] ? <Em key={i} e={p} /> : p));
}

export function Stars({ n = 5 }) {
  return <span className="stars" aria-label={`${n} bintang`}>{Array.from({ length: n }, (_, i) => <Icon key={i} name="star" color="#F5A623" fill />)}</span>;
}

// Lingkaran pucat berisi ikon outline (gaya contoh landing).
export function IconBadge({ name, tone = "sky", size = 44 }) {
  return <span className={`icb icb-${tone}`} style={{ width: size, height: size }}><Icon name={name} size={size * 0.52} /></span>;
}
