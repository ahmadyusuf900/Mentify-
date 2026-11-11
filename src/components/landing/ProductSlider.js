"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MentorAvatar from "@/components/MentorAvatar";
import Poster from "@/components/Poster";
import ProductCover from "@/components/ProductCover";

// ── helpers ────────────────────────────────────────────────────────────────
const STAR = "★";
const fmtPrice = (n) => "Rp" + n.toLocaleString("id-ID");
const fmtDate = (s) =>
  new Date(s + "T12:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function isClosed(end) {
  return new Date(end + "T23:59:59") < new Date();
}
function daysLeft(end) {
  return Math.ceil((new Date(end + "T23:59:59") - Date.now()) / 86400000);
}

// ── individual card renderers ───────────────────────────────────────────────
function MentorCard({ mentor }) {
  return (
    <Link href={`/mentor/${mentor.id}`} className="sc-card sc-card-mentor">
      <div className="sc-avatar">
        <MentorAvatar m={mentor} size="xl" />
      </div>
      <div className="sc-body">
        <span className="badge">{mentor.category}</span>
        <h3 className="sc-title">{mentor.name}</h3>
        <p className="sc-sub muted">{mentor.campus}</p>
        <div className="sc-meta">
          <span className="sc-rating">
            {STAR} {mentor.rating.toFixed(1)}
            <span className="muted"> ({mentor.reviewCount} ulasan)</span>
          </span>
          <span className="sc-price">{fmtPrice(mentor.price)}<span className="muted">/sesi</span></span>
        </div>
        <p className="sc-highlight muted">{mentor.highlight}</p>
        <span className="sc-cta">Lihat profil →</span>
      </div>
    </Link>
  );
}

function LombaCard({ item }) {
  const closed = isClosed(item.end);
  const dl = daysLeft(item.end);
  return (
    <Link href={`/lomba/${item.id}`} className={`sc-card sc-card-lomba${closed ? " sc-card-closed" : ""}`}>
      <div className="sc-poster">
        <Poster l={item} closed={closed} />
      </div>
      <div className="sc-body">
        <div className="sc-badges">
          <span className={`badge${closed ? " gray" : " pink"}`}>
            {closed ? "Tutup" : dl <= 7 ? `H-${dl}` : "Buka"}
          </span>
          <span className="badge">{item.type}</span>
        </div>
        <h3 className="sc-title">{item.title}</h3>
        <p className="sc-sub muted">{item.organizer}</p>
        <div className="sc-meta">
          <span className="muted">Deadline: {fmtDate(item.end)}</span>
          <span className="sc-price">
            {item.fee === 0 ? "Gratis" : fmtPrice(item.fee)}
          </span>
        </div>
        <span className="sc-cta">Lihat lomba →</span>
      </div>
    </Link>
  );
}

function ProductCard({ product }) {
  return (
    <Link href={`/marketplace/${product.id}`} className="sc-card sc-card-product">
      <div className="sc-cover">
        <ProductCover p={product} />
      </div>
      <div className="sc-body">
        <div className="sc-badges">
          <span className="badge">{product.category}</span>
          <span className="badge">{product.format}</span>
        </div>
        <h3 className="sc-title">{product.title}</h3>
        <p className="sc-sub muted">oleh {product.seller}</p>
        <div className="sc-meta">
          <span className="sc-rating">
            {STAR} {product.rating.toFixed(1)}
            <span className="muted"> · {product.sold} terjual</span>
          </span>
          <span className="sc-price">{fmtPrice(product.price)}</span>
        </div>
        <span className="sc-cta">Lihat produk →</span>
      </div>
    </Link>
  );
}

// ── main slider ──────────────────────────────────────────────────────────────
export default function ProductSlider({ items = [], mode = "mentor", interval = 3000 }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startIndex = useRef(0);

  const total = items.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  // Auto-slide
  useEffect(() => {
    if (paused || total === 0) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, next, interval, total]);

  // Touch / drag support
  function onPointerDown(e) {
    setDragging(true);
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    startIndex.current = index;
    setPaused(true);
  }
  function onPointerUp(e) {
    if (!dragging) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? startX.current;
    const diff = startX.current - endX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setDragging(false);
    setPaused(false);
  }

  if (total === 0) return null;

  const renderCard = (item, i) => {
    const key = `${mode}-${i}`;
    if (mode === "mentor") return <MentorCard key={key} mentor={item} />;
    if (mode === "lomba")  return <LombaCard  key={key} item={item}   />;
    return                        <ProductCard key={key} product={item}/>;
  };

  return (
    <div
      className="sc-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { if (!dragging) setPaused(false); }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
    >
      {/* track */}
      <div
        ref={trackRef}
        className="sc-track"
        style={{ transform: `translateX(calc(-${index} * var(--sc-card-w-gap)))` }}
      >
        {items.map(renderCard)}
      </div>

      {/* nav buttons */}
      <button className="sc-nav sc-prev" onClick={prev} aria-label="Sebelumnya">‹</button>
      <button className="sc-nav sc-next" onClick={next} aria-label="Berikutnya">›</button>

      {/* dots */}
      <div className="sc-dots" role="tablist" aria-label="Navigasi slide">
        {items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            className={`sc-dot${i === index ? " sc-dot-on" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
