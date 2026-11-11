"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ to, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const [v, setV] = useState(to); // nilai akhir dulu agar server dan browser sama

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        setV(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);

  return <span ref={ref}>{v.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export default function Stats({ items }) {
  return (
    <div className="lp-stats">
      {items.map(([to, dec, suffix, label]) => (
        <div className="lp-stat" key={label}>
          <strong><Counter to={to} decimals={dec} suffix={suffix} /></strong>
          <span className="muted">{label}</span>
        </div>
      ))}
    </div>
  );
}