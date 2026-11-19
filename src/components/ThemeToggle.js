"use client";
import { useEffect, useState } from "react";
import { Em } from "@/components/Icon";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const d = localStorage.getItem("theme") === "dark"; setDark(d); document.documentElement.dataset.theme = d ? "dark" : "light"; }, []);
  const toggle = () => { const d = !dark; setDark(d); localStorage.setItem("theme", d ? "dark" : "light"); document.documentElement.dataset.theme = d ? "dark" : "light"; };
  return <button className="btn secondary" onClick={toggle} aria-label="Ganti tema"><Em e={dark ? "☀️" : "🌙"} /></button>;
}
