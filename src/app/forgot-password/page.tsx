"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/Toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // New state for success feedback
  const router = useRouter();

  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "error" as "success" | "error",
  });

  const triggerToast = (msg: string, type: "success" | "error" = "error") => {
    setToast({ show: true, msg: msg.toUpperCase(), type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      // Even if the email doesn't exist, it's best practice to show "Success"
      // to prevent account enumeration (identity leaks).
      if (!response.ok) throw new Error("TRANSMISSION ERROR");

      setIsSent(true);
      triggerToast("RECOVERY LINK DISPATCHED", "success");

      // We don't auto-redirect immediately so the user knows they need to check email
    } catch (err: any) {
      triggerToast("UPLINK_FAILURE: UNABLE TO SEND RECOVERY LINK");
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
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <header className="mb-10">
                  <h1 className="font-bebas text-5xl md:text-6xl tracking-tight leading-none mb-2 uppercase">
                    RECOVERY <span className="text-eprx-lime">MODE</span>
                  </h1>
                  <p className="text-[0.7rem] text-[#666] tracking-wider uppercase leading-relaxed font-inter">
                    Request a secure reset link to restore runner access.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label className="block text-[0.6rem] tracking-[2px] text-[#444] mb-2 group-focus-within:text-eprx-lime transition-colors font-bold uppercase">
                      REGISTERED EMAIL
                    </label>
                    <input
                      type="email"
                      className="w-full bg-transparent border-b border-[#222] text-white py-2 text-base outline-none focus:border-eprx-lime transition-colors font-inter"
                      placeholder="runner@eprx.uv1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? "DISPATCHING..." : "SEND RESET LINK"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center sm:text-left"
              >
                <header className="mb-8">
                  <h1 className="font-bebas text-5xl md:text-6xl tracking-tight leading-none mb-2 uppercase text-eprx-lime">
                    LINK SENT
                  </h1>
                  <p className="text-sm text-white mb-4 font-mono">
                    [{email.toUpperCase()}]
                  </p>
                  <p className="text-[0.7rem] text-[#666] tracking-wider uppercase leading-relaxed font-inter">
                    A secure authentication bridge has been sent to your inbox.
                    The link will expire in 1 hour.
                  </p>
                </header>

                <button
                  onClick={() => router.push("/login")}
                  className="text-white border-b border-white pb-1 text-xs font-bold tracking-[2px] hover:text-eprx-lime hover:border-eprx-lime transition-all"
                >
                  RETURN TO LOGIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-10 pt-6 border-t border-[#1a1a1a]">
            <p className="text-[0.6rem] text-[#444] tracking-[2px] mb-2 font-bold uppercase">
              REMEMBERED YOUR ACCOUNT?
            </p>
            <Link
              href="/login"
              className="text-eprx-lime text-xs font-bold hover:text-white transition-colors tracking-[2px] uppercase"
            >
              SIGN IN
            </Link>
          </footer>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative bg-[url('/assets/images/recoverAccount.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-16 text-right">
          <div className="[writing-mode:vertical-lr] self-start text-[0.6rem] tracking-[8px] text-white/40 font-bold uppercase mt-20"></div>
          <div className="mb-20">
            <h2 className="font-bebas text-7xl xl:text-9xl leading-[0.8] tracking-tighter uppercase">
              LOST <br /> <span className="text-eprx-lime">IDENTITY</span>
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

export default ForgotPasswordForm;
