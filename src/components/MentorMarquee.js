import Link from "next/link";
import MentorAvatar from "./MentorAvatar";
import { priceFor } from "@/data/mentors";
import { rupiah } from "@/lib/format";

// Daftar diduplikasi agar putarannya tidak terputus; salinan kedua disembunyikan dari pembaca layar.
export default function MentorMarquee({ items }) {
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${items.length * 5}s` }}>
        {[...items, ...items].map((m, i) => {
          const dup = i >= items.length;
          return (
            <Link key={i} href={`/mentor/${m.id}`} className={`mq-item ${dup ? "dup" : ""}`}
              aria-hidden={dup || undefined} tabIndex={dup ? -1 : undefined}>
              <MentorAvatar m={m} size="sm" />
              <span className="mq-text">
                <strong>{m.name}</strong>
                <span className="muted">{m.reviewCount ? `⭐ ${m.rating}` : "🆕 Baru"} · {m.category}</span>
                <span className="muted">Mulai {rupiah(priceFor(m, 60))}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}