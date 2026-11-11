"use client";
import Link from "next/link";
import { lomba, isClosed } from "@/data/lomba";
import { useNow } from "@/lib/useNow";
export default function OpenLomba() {
  const now = useNow();
  const open = lomba.filter((l) => !isClosed(l, now)).slice(0, 3);
  return (
    <div className="grid" style={{ marginTop: 16 }}>
      {open.map((l) => (
        <Link key={l.id} href="/lomba" className="card">
          <span className="badge">{l.type}</span><h3>{l.title}</h3>
          <span className="muted">Deadline {l.deadline}</span>
        </Link>
      ))}
    </div>
  );
}