"use client";
import { useEffect, useState } from "react";
import { FREE_QUOTA } from "@/data/products";

const KEY = "mentify_quota";
const thisMonth = () => new Date().toISOString().slice(0, 7);

export function useQuota() {
  const [ids, setIds] = useState([]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.month === thisMonth()) setIds(s.ids || []);
    } catch {}
  }, []);
  const claim = (id) => {
    const next = [...ids, id];
    try { localStorage.setItem(KEY, JSON.stringify({ month: thisMonth(), ids: next })); } catch {}
    setIds(next);
  };
  return { ids, left: Math.max(0, FREE_QUOTA - ids.length), claim };
}