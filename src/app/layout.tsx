import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import "./globals.css";

// Tactical/Header Font
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

// UI/Body Font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "PRX | BEYOND THE MILE",
  description:
    "High-performance lifestyle brand for the modern athlete. Engineered for speed, efficiency, and minimalist precision.",
  icons: {
    icon: "/favicon.ico", // Ensure your new PRX logo is here
  },
};

// Prevent mobile horizontal scroll from glitch transforms
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
          {/* Added a relative container to manage glitch artifacts */}
          <main className="min-h-screen relative overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
