import Link from "next/link";
import Poster from "./Poster";
import { isClosed } from "@/data/lomba";

// Daftar diduplikasi supaya putarannya tidak terputus.
// Salinan kedua disembunyikan dari pembaca layar dan dari tombol Tab.
export default function HotMarquee({ items, now }) {
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${items.length * 5}s` }}>
        {[...items, ...items].map((l, i) => {
          const dup = i >= items.length;
          return (
            <Link
              key={i}
              href={`/lomba/${l.id}`}
              className={`hot-item ${dup ? "dup" : ""}`}
              aria-hidden={dup || undefined}
              tabIndex={dup ? -1 : undefined}
            >
              <Poster l={l} closed={isClosed(l, now)} />
              <span className="hot-title">{l.title}</span>
              <span className="muted">👁 {l.views.toLocaleString("id-ID")}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}