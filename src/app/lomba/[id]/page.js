import { Suspense } from "react";
import { lomba } from "@/data/lomba";
import LombaDetail from "@/components/LombaDetail";

export function generateStaticParams() {
  return lomba.map((l) => ({ id: String(l.id) }));
}

async function Content({ params }) {
  const { id } = await params;
  return <LombaDetail id={id} />;
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div className="container section muted">Memuat info lomba…</div>}>
      <Content params={params} />
    </Suspense>
  );
}