import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap", // 1. Added swap to help with the preload warning
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. If you aren't using Geist right now, you can set preload: false
// to stop the console warning.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  preload: false,
});

export const metadata: Metadata = {
  title: "PRX | BEYOND THE MILE",
  description:
    "High-performance lifestyle brand for the modern athlete. Engineered for speed, efficiency, and minimalist precision.",
  icons: {
    icon: "/favicon.ico", // Note: Usually starts with / in Next.js
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <body
        className={`
          ${bebas.variable} 
          ${inter.variable} 
          ${geistSans.variable} 
          font-inter antialiased 
          bg-eprx-dark text-white
        `}
      >
        <AuthProvider>
          <NavbarWrapper />
          {/* 3. Added 'overflow-clip' or 'overflow-x-hidden' on main 
             is perfect for preventing those mobile "shaking" issues 
             with the ecosystem slider.
          */}
          <main className="min-h-screen relative overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
