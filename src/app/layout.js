import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-roboto" });
export const metadata = { title: "Mentify", description: "Mentor lomba, info lomba, dan produk digital untuk mahasiswa & pelajar" };
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${poppins.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body><Navbar /><main>{children}</main><Footer /></body>
    </html>
  );
}
