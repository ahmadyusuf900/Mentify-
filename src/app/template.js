"use client";
import { useEffect, useRef } from "react";
import { animate } from "motion";

// Template dibuat ulang tiap pindah halaman: isi halaman masuk dengan fade + naik halus.
export default function Template({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const a = animate(ref.current, { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] });
    a.finished.then(() => { if (ref.current) { ref.current.style.opacity = ""; ref.current.style.transform = ""; } });
    return () => a.stop();
  }, []);
  return <div ref={ref}>{children}</div>;
}
