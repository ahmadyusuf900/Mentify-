import Link from "next/link";
import MentorAvatar from "./MentorAvatar";
import { priceRange } from "@/data/mentors";
import { rupiah } from "@/lib/format";

export default function MentorCard({ m }) {
  const [lo, hi] = priceRange(m);
  return (
    <article className="card mcard">
      <div className="mc-strip"><span>MENTOR ID</span><span>{m.code}</span></div>
      <div className="mc-photo"><MentorAvatar m={m} /></div>
      <div className="mc-body">
        <h3>{m.name}</h3>
        <span className="badge">Mentor {m.category}</span>
        <p className="muted">⭐ {m.rating} ({m.reviewCount} ulasan)</p>
        <p className="price mprice">{rupiah(lo)} – {rupiah(hi)}</p>
        <Link className="btn" href={`/mentor/${m.id}`}>Lihat profil</Link>
      </div>
    </article>
  );
}