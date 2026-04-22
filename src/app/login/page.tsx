"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/Toast";
import api from "@/lib/api";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // Check window only after mount to avoid hydration mismatch
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      const user = data.user || data;
      const token = data.accessToken || data.token;
      if (!token) throw new Error("TOKEN MISSING");

      login(user, token);
      setToastMsg("ACCESS GRANTED: INITIALIZING...");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      const rawMessage = err.response?.data?.message || "TRANSMISSION ERROR";
      setToastMsg(
        Array.isArray(rawMessage)
          ? rawMessage[0].toUpperCase()
          : rawMessage.toUpperCase(),
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex w-screen h-screen bg-background text-white overflow-hidden ${isMobile ? "flex-col" : "flex-row"}`}
    >
      {/* Form Side */}
      <div
        className={`flex items-center justify-center bg-background ${isMobile ? "w-full p-6" : "w-[45%] p-10"}`}
      >
        <div className="w-full max-w-85">
          <div className="mb-10">
            <h1 className="font-bebas text-5xl md:text-6xl tracking-tight leading-none mb-2">
              RETURNING <span className="text-eprx-lime">RUNNER</span>
            </h1>
            <p className="text-[0.7rem] text-[#666] tracking-wider uppercase font-inter">
              Enter credentials for performance dashboard access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[0.6rem] tracking-[2px] text-[#444] mb-2 group-focus-within:text-eprx-lime transition-colors">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-[#222] text-white py-2 text-base outline-none focus:border-eprx-lime transition-colors font-inter"
                placeholder="runner@eprx.uv1"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="group">
              <label className="block text-[0.6rem] tracking-[2px] text-[#444] mb-2 group-focus-within:text-eprx-lime transition-colors">
                PASSWORD
              </label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-[#222] text-white py-2 text-base outline-none focus:border-eprx-lime transition-colors font-inter"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 border border-[#333] text-[0.7rem] tracking-[4px] font-bold transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "SIGN IN"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-6 text-[0.6rem] text-[#666]">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="accent-eprx-lime" />
              <span>REMEMBER ME</span>
            </label>
            <Link
              href="/forgot-password"
              title="Recover Account"
              className="hover:text-eprx-lime transition-colors"
            >
              RECOVER ACCOUNT?
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-[#1a1a1a]">
            <p className="text-[0.6rem] text-[#444] tracking-[2px] mb-1">
              NEW TO THE CIRCLE?
            </p>
            <Link
              href="/register"
              className="text-eprx-lime text-[0.7rem] font-bold hover:underline"
            >
              CREATE AN ACCOUNT
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Side */}
      {!isMobile && (
        <div className="flex-1 relative bg-[url('/assets/images/loginBGV2.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-16 text-right">
            <div className="[writing-mode:vertical-lr] self-start text-[0.6rem] tracking-[8px] text-white/40 font-bold uppercase mt-20"></div>
            <div className="mb-20">
              <h2 className="font-bebas text-7xl xl:text-9xl leading-[0.8] tracking-tighter uppercase">
                THE <br /> <span className="text-eprx-lime">INNER</span> <br />{" "}
                CIRCLE
              </h2>
            </div>
          </div>
        </div>
      )}

      <Toast
        isVisible={showToast}
        message={toastMsg}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-background h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
