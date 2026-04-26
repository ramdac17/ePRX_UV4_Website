"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Toast from "@/components/Toast";

const ResetForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extracting both to satisfy the AuthService.resetPassword(resetDto)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "error" as "success" | "error",
  });

  // Security Redirect: If no token, the uplink is invalid.
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const triggerToast = (msg: string, type: "success" | "error" = "error") => {
    setToast({ show: true, msg: msg.toUpperCase(), type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      triggerToast("VALIDATION ERROR: CREDENTIAL MISMATCH");
      return;
    }

    if (newPassword.length < 6) {
      triggerToast("SECURITY ERROR: PASSWORD TOO WEAK (MIN 6 CHARS)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email, // AuthService expects this
            token,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OVERRIDE_FAILED");
      }

      triggerToast("CREDENTIALS REGENERATED: RE-INITIALIZING...", "success");

      // Brief delay for the user to process the success
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      triggerToast(err.message || "TRANSMISSION_ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-eprx-dark text-white overflow-hidden">
      {/* Form Side */}
      <div className="flex-1 lg:flex-[0.85] flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-10">
            <div className="text-eprx-lime font-mono text-[0.6rem] tracking-[4px] mb-2"></div>
            <h1 className="font-bebas text-5xl md:text-6xl tracking-tight leading-none mb-2 uppercase">
              OVERRIDE <span className="text-eprx-lime">SECURITY</span>
            </h1>
            <p className="text-[0.7rem] text-[#666] tracking-wider uppercase leading-relaxed font-inter">
              Establishing new encrypted credentials for {email || "RUNNER_ID"}.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[0.6rem] tracking-[2px] text-[#444] mb-2 group-focus-within:text-eprx-lime transition-colors font-bold uppercase">
                NEW PASSWORD
              </label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-[#222] text-white py-2 outline-none focus:border-eprx-lime transition-colors font-inter tracking-widest"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label className="block text-[0.6rem] tracking-[2px] text-[#444] mb-2 group-focus-within:text-eprx-lime transition-colors font-bold uppercase">
                CONFIRM RE-ENTRY
              </label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-[#222] text-white py-2 outline-none focus:border-eprx-lime transition-colors font-inter tracking-widest"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 border border-[#333] text-white font-bebas text-xl tracking-[4px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              {loading ? "PATCHING DATABASE..." : "INITIALIZE RESET PASSWORD"}
            </motion.button>
          </form>

          <footer className="mt-10 pt-6 border-t border-[#1a1a1a]">
            <Link
              href="/login"
              className="text-[#444] text-[0.65rem] font-bold hover:text-white transition-colors tracking-[2px] uppercase"
            >
              RETURN TO LOGIN
            </Link>
          </footer>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative bg-[url('/assets/images/resetpasswordBGV2.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-between p-16 text-right">
          <div className="[writing-mode:vertical-lr] self-start text-[0.6rem] tracking-[8px] text-white/40 font-bold uppercase mt-20"></div>
          <div className="mb-20">
            <h2 className="font-bebas text-7xl xl:text-9xl leading-[0.8] tracking-tighter uppercase">
              SECURE <br /> <span className="text-eprx-lime">ACCESS</span>
            </h2>
          </div>
        </div>
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-eprx-dark h-screen flex items-center justify-center text-eprx-lime font-mono tracking-[4px] text-xs">
          INITIALIZING OVERRIDE ENVIRONMENT...
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
