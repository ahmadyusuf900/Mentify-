"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useUser } from "@/lib/auth";

const LINKS = [["/mentor", "Mentor"], ["/lomba", "Info Lomba"], ["/marketplace", "Marketplace"]];

function Links({ active = "", open, onClose }) {
  return (
    <nav className={`nav-links${open ? " open" : ""}`} aria-label="Menu utama">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={active.startsWith(href) ? "page" : undefined} onClick={onClose}>{label}</Link>
      ))}
    </nav>
  );
}

// usePathname dibungkus Suspense agar aman di Next 16
function ActiveLinks({ open, onClose }) {
  return <Links active={usePathname()} open={open} onClose={onClose} />;
}

export default function Navbar() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
      <header className="nav">
        <div className="container">
          <Logo href="/" onClick={() => setOpen(false)} />
          <Suspense fallback={<Links />}><ActiveLinks open={open} onClose={() => setOpen(false)} /></Suspense>
          <div className="row">
            <ThemeToggle />
            <Link className="btn" href={user ? "/dashboard" : "/login"}>{user ? "Dashboard" : "Masuk"}</Link>
            <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
