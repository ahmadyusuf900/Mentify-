import Link from "next/link";
import ProductCover from "./ProductCover";
import { rupiah } from "@/lib/format";

export default function ProductCard({ p, free = false }) {
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <Link href={`/marketplace/${p.id}`} className="card pcard">
      <div className="pc-img">
        <ProductCover p={p} />
        <span className="badge corner">{p.category}</span>
        {disc > 0 && <span className="badge pink corner-l">-{disc}%</span>}
      </div>
      <div className="pc-body">
        <h3>{p.title}</h3>
        <p className="muted">oleh {p.seller}</p>
        <p className="muted">⭐ {p.rating} ({p.reviewCount}) · {p.sold} terjual</p>
        <div className="pc-price">
          <span className="price">{rupiah(p.price)}</span>
          {p.oldPrice > 0 && <s className="muted">{rupiah(p.oldPrice)}</s>}
        </div>
        {free && <span className="badge pink">Gratis untuk premium</span>}
      </div>
    </Link>
  );
}