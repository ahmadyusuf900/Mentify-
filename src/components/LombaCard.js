import Link from "next/link";
import Poster from "./Poster";
import { isClosed, daysLeft, fmtDate, feeText } from "@/data/lomba";
import { Em, Icon, emo, Stars } from "@/components/Icon";

export default function LombaCard({ l, now }) {
  const closed = isClosed(l, now);
  const d = daysLeft(l, now);
  return (
    <Link href={`/lomba/${l.id}`} className={`card lomba-card ${closed ? "closed" : ""}`}>
      <div className="poster-box">
        <Poster l={l} closed={closed} />
        {l.status === "pending" && <span className="nbadge corner" style={{ left: 8, right: "auto" }}><Em e="⏳" /> Menunggu review</span>}
        {!closed && d !== null && d <= 14 && <span className="badge pink corner">H-{d}</span>}
      </div>
      <h3>{l.title}</h3>
      <ul className="meta">
        <li><Em e="👥" /> {l.level}</li>
        <li><Em e="💰" /> {feeText(l)}</li>
        <li><Em e="📍" /> {l.mode}</li>
        <li><Em e="🗓️" /> {fmtDate(l.start)} – {fmtDate(l.end)}</li>
      </ul>
      <div className="row between muted">
        <span>Oleh {l.organizer}</span>
        <span><Em e="❤" /> {l.likes} · <Em e="👁" /> {l.views}</span>
      </div>
    </Link>
  );
}