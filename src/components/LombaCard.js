import Link from "next/link";
import Poster from "./Poster";
import { isClosed, daysLeft, fmtDate, feeText } from "@/data/lomba";

export default function LombaCard({ l, now }) {
  const closed = isClosed(l, now);
  const d = daysLeft(l, now);
  return (
    <Link href={`/lomba/${l.id}`} className={`card lomba-card ${closed ? "closed" : ""}`}>
      <div className="poster-box">
        <Poster l={l} closed={closed} />
        {!closed && d !== null && d <= 14 && <span className="badge pink corner">H-{d}</span>}
      </div>
      <h3>{l.title}</h3>
      <ul className="meta">
        <li>👥 {l.level}</li>
        <li>💰 {feeText(l)}</li>
        <li>📍 {l.mode}</li>
        <li>🗓️ {fmtDate(l.start)} – {fmtDate(l.end)}</li>
      </ul>
      <div className="row between muted">
        <span>Oleh {l.organizer}</span>
        <span>❤ {l.likes} · 👁 {l.views}</span>
      </div>
    </Link>
  );
}