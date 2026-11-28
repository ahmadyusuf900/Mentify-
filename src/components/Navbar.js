"use client";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useUser } from "@/lib/auth";
import { Icon } from "@/components/Icon";

const LINKS = [["/mentor", "Mentor", "teacher"], ["/lomba", "Info Lomba", "trophy"], ["/marketplace", "Marketplace", "bag"]];

function Links({ active = "" }) {
  return (
    <nav className="nav-links" aria-label="Menu utama">
      {LINKS.map(([href, label, icon], i) => (
        <Link key={href} href={href} className={`nl nl-${i + 1}`} aria-current={active.startsWith(href) ? "page" : undefined}>
          <Icon name={icon} size={17} />{label}
        </Link>
      ))}
    </nav>
  );
}
function ActiveLinks() { return <Links active={usePathname()} />; }

// Navigasi bawah untuk HP (gaya "floating pill" + indikator aktif bergradasi)
function Bottom({ user }) {
  const path = usePathname() || "/";
  const items = [
    ["/", "Beranda", "home", path === "/"],
    ["/mentor", "Mentor", "teacher", path.startsWith("/mentor")],
    ["/lomba", "Lomba", "trophy", path.startsWith("/lomba")],
    ["/marketplace", "Market", "bag", path.startsWith("/marketplace")],
    [user ? "/dashboard" : "/login", user ? "Akun" : "Masuk", "user", path.startsWith("/dashboard") || path.startsWith("/login")],
  ];
  return (
    <nav className="bnav" aria-label="Navigasi bawah">
      {items.map(([href, label, icon, on]) => (
        <Link key={label} href={href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
          <span className="bn-ic"><Icon name={icon} size={21} /></span>
          <span className="bn-t">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function Navbar() {
  const { user, ready, logout } = useUser();
  const router = useRouter();
  const out = () => { logout(); router.push("/"); };
  const me = ready && user;
  return (
    <>
      <header className="nav">
        <div className="container nav-bar">
          <Logo href="/" />
          <Suspense fallback={<Links />}><ActiveLinks /></Suspense>
          <div className="row nav-right">
            <ThemeToggle />
            {me ? (
              <>
                <Link className="nav-me" href="/dashboard" aria-label="Buka dashboard">
                  <span className="nav-av" aria-hidden="true">{user.name?.[0]?.toUpperCase() ?? "U"}</span>
                  <span className="nav-me-t">Dashboard</span>
                  <Icon name="grid" size={16} />
                </Link>
                <button type="button" className="nav-out" onClick={out} aria-label="Keluar">
                  <Icon name="logout" size={16} /><span className="nav-out-t">Keluar</span>
                </button>
              </>
            ) : (
              <Link className="nav-login" href="/login"><Icon name="user" size={16} />Masuk</Link>
            )}
          </div>
        </div>
      </header>
      <Suspense fallback={null}><Bottom user={me ? user : null} /></Suspense>
    </>
  );
}
