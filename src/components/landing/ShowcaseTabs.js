"use client";
import { useState } from "react";
import { mentors } from "@/data/mentors";
import { lomba } from "@/data/lomba";
import { products } from "@/data/products";
import ProductSlider from "@/components/landing/ProductSlider";

const TABS = [
  { id: "mentor",  label: "🎓 Mentor Terbaik",  mode: "mentor"  },
  { id: "lomba",   label: "🏆 Lomba Aktif",      mode: "lomba"   },
  { id: "product", label: "📚 Produk Terlaris",  mode: "product" },
];

// Pick a curated slice to show (top-rated / most sold)
const MENTORS  = [...mentors].sort((a, b) => b.rating - a.rating).slice(0, 8);
const LOMBA    = [...lomba].sort((a, b) => b.views - a.views).slice(0, 8);
const PRODUCTS = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);

function dataFor(id) {
  if (id === "mentor")  return MENTORS;
  if (id === "lomba")   return LOMBA;
  return PRODUCTS;
}

export default function ShowcaseTabs() {
  const [active, setActive] = useState("mentor");

  return (
    <div className="showcase-tabs">
      {/* tab bar */}
      <div className="sc-tabbar" role="tablist" aria-label="Kategori showcase">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={id === active}
            className={`sc-tabitem${id === active ? " sc-tabitem-on" : ""}`}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* slider */}
      <ProductSlider
        key={active}           // remount on tab switch so index resets
        items={dataFor(active)}
        mode={active === "product" ? "product" : active}
        interval={3000}
      />
    </div>
  );
}
