import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Font dibundel di src/fonts (tanpa download Google Fonts), jadi selalu tampil sama di semua perangkat.
const display = localFont({
  src: [{ path: "../fonts/bricolage-grotesque-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-display", display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});
const body = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-body", display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});
export const metadata = { title: "Mentify", description: "Mentor lomba, info lomba, dan produk digital untuk mahasiswa & pelajar" };
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body><Navbar /><main>{children}</main><Footer /></body>
    </html>
  );
}
