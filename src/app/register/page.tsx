"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/Toast";
import { useRegister } from "./useRegister";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
}: any) => (
  <div className="group w-full">
    <label className="block text-[0.6rem] tracking-[1px] text-[#444] mb-1 font-bold uppercase">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full bg-transparent border-b border-[#222] py-2 outline-none focus:border-eprx-lime transition-colors text-sm placeholder:text-[#222] font-inter"
    />
  </div>
);

const RegisterContent = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const {
    formData,
    isVerifying,
    loading,
    toast,
    handleChange,
    handleSubmit,
    setToast,
  } = useRegister(API_URL, () => {});

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingOtp(true);
    try {
      await api.post("/auth/verify-otp", { email: formData.email, otp });
      setToast({
        show: true,
        msg: "IDENTITY VERIFIED: UPLINK STABLE.",
        type: "success",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "INVALID CODE";
      setToast({
        show: true,
        msg: Array.isArray(msg) ? msg[0].toUpperCase() : msg.toUpperCase(),
        type: "error",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-eprx-dark text-white font-inter">
      {/* Form Side */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 pt-20 lg:pt-32">
        <AnimatePresence mode="wait">
          {isVerifying ? (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md"
            >
              <header className="mb-8">
                <h1 className="font-bebas text-5xl tracking-tight mb-2">
                  VERIFY <span className="text-eprx-lime">UPLINK</span>
                </h1>
                <p className="text-[0.7rem] text-[#666] tracking-wider uppercase leading-relaxed">
                  Secure code dispatched to:{" "}
                  <span className="text-white">{formData.email}</span>
                </p>
              </header>

              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="group w-full">
                  <label className="block text-[0.6rem] tracking-[2px] text-eprx-lime mb-3 font-bold uppercase">
                    OTP ACCESS CODE
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="XXXXXX"
                    maxLength={6}
                    className="w-full bg-transparent border-b border-[#222] py-4 outline-none focus:border-eprx-lime transition-colors text-3xl font-mono tracking-[15px] text-center sm:text-left"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={verifyingOtp || otp.length < 6}
                  className="w-full py-4 bg-eprx-lime text-black font-bebas text-xl tracking-[4px] hover:bg-white transition-all disabled:opacity-50"
                >
                  {verifyingOtp ? "VERIFYING..." : "ACTIVATE ACCOUNT →"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reg-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg lg:max-w-md xl:max-w-lg"
            >
              <header className="mb-8 lg:mb-10">
                <h1 className="font-bebas text-5xl sm:text-6xl tracking-tight leading-none mb-2">
                  NEW <span className="text-eprx-lime">RECRUIT</span>
                </h1>
                <p className="text-[0.7rem] text-[#666] tracking-wider uppercase leading-relaxed">
                  Initialize connection to the PRX core ecosystem.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                  <FormInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder=""
                  />
                  <FormInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                  <FormInput
                    label="User Name"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder=""
                  />
                  <FormInput
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="09XX XXX XXXX"
                  />
                </div>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="******"
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 border border-[#333] text-white font-bebas text-xl tracking-[4px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : "CREATE ACCOUNT"}
                </motion.button>
              </form>

              <footer className="mt-10 pt-6 border-t border-[#1a1a1a]">
                <p className="text-[0.6rem] text-[#444] mb-2 font-bold uppercase tracking-widest">
                  Already Registered?
                </p>
                <Link
                  href="/login"
                  className="text-eprx-lime text-xs font-bold hover:text-white transition-colors tracking-[2px]"
                >
                  SIGN IN
                </Link>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-[1.2] relative bg-[url('/assets/images/register.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-12 text-right">
          <div className="[writing-mode:vertical-lr] self-start text-[0.6rem] tracking-[8px] text-white/40 font-bold uppercase mt-20"></div>
          <div className="mb-20">
            <h2 className="font-bebas text-7xl xl:text-9xl leading-[0.8] tracking-tighter uppercase">
              THE <br /> <span className="text-eprx-lime">NEXT</span> <br /> GEN
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-eprx-dark h-screen flex items-center justify-center text-eprx-lime font-mono">
          LOADING INTERFACE...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
