"use client";
import { useEffect, useState } from "react";
// null saat render server, berisi tanggal sekarang setelah tampil di browser
export function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}