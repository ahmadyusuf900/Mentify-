import { Suspense } from "react";
import { products } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

async function Content({ params }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div className="container section muted">Memuat produk…</div>}>
      <Content params={params} />
    </Suspense>
  );
}