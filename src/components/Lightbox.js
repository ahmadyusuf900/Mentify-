"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";

// Bungkus gambar apa pun: klik -> tampil besar dengan tombol silang (X), tombol Esc, atau klik latar untuk kembali.
export default function Lightbox({ src, alt = "", children, className = "" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop?.();
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; window.__lenis?.start?.(); };
  }, [open]);

  return (
    <>
      <button type="button" className={`lb-trigger ${className}`} onClick={() => setOpen(true)} aria-label={`Perbesar gambar: ${alt}`}>
        {children}
        <span className="lb-hint"><Icon name="search" size={14} /> Perbesar</span>
      </button>
      {mounted && open && createPortal(
        <div className="lb-overlay" role="dialog" aria-modal="true" aria-label={alt || "Gambar diperbesar"} onClick={() => setOpen(false)}>
          <button type="button" className="lb-close" onClick={() => setOpen(false)} aria-label="Tutup gambar"><Icon name="x" size={22} /><span>Tutup</span></button>
          <img src={src} alt={alt} className="lb-img" onClick={(e) => e.stopPropagation()} />
          <p className="lb-cap" onClick={(e) => e.stopPropagation()}>{alt}</p>
        </div>,
        document.body
      )}
    </>
  );
}
