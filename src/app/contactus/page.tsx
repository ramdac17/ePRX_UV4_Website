"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [status, setStatus] = useState("IDLE");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("TRANSMITTING...");

    try {
      const response = await fetch("https://formspree.io/f/xnjgyprn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("LINK_ESTABLISHED");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("IDLE"), 5000);
      } else {
        setStatus("UPLINK_ERROR");
        setTimeout(() => setStatus("IDLE"), 3000);
      }
    } catch (error) {
      setStatus("CONNECTION_FAILED");
      setTimeout(() => setStatus("IDLE"), 3000);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col justify-center items-center px-[5%] py-16 text-white font-inter">
      {/* Brand & Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 mt-10 border-2 border-eprx-lime overflow-hidden shadow-[0_0_20px_rgba(212,255,0,0.3)]">
          <img
            src="/assets/images/eprx-logo.png"
            alt="PRX Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bebas text-5xl md:text-6xl tracking-tight mb-8 uppercase"
        >
          CONTACT <span className="text-eprx-lime">PRX</span>
        </motion.h1>
        <p className="text-[0.65rem] tracking-[4px] text-[#444] mt-2 uppercase font-inter">
          ESTABLISH COMMUNICATION LINK ||{" "}
          <span className="text-eprx-lime">PINOY RUNNER EXTREME</span> || EST
          2013
        </p>
      </div>

      {/* Main Grid Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-250 grid grid-cols-1 md:grid-cols-2 bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden"
      >
        {/* Info Section */}
        <div className="p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1a1a1a]">
          <div>
            <div className="border-b border-[#1a1a1a] pb-4 mb-8">
              <p className="text-[0.85rem] leading-relaxed text-[#888] font-light">
                For any concern, inquiry or suggestion, please fill out the form
                and we will get back to you as soon as possible. Thank you for
                supporting the community!
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] text-[#444] tracking-[2px] font-bold">
                  EMAIL ADDRESS
                </span>
                <span className="text-sm md:text-base font-bold tracking-tight">
                  pinoyrunnerextreme@gmail.com
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] text-[#444] tracking-[2px] font-bold">
                  MOBILE NUMBER
                </span>
                <span className="text-sm md:text-base font-bold tracking-tight">
                  +63 (999) 4706868
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 p-4 border border-[#1a1a1a] bg-[#050505]">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-500 ${
                status === "IDLE"
                  ? "text-eprx-lime bg-eprx-lime"
                  : status === "LINK_ESTABLISHED"
                    ? "text-blue-400 bg-blue-400"
                    : "text-red-500 bg-red-500"
              }`}
            />
            <span className="text-[0.6rem] tracking-[1px] text-[#666] font-mono">
              STATUS: {status}
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-10 bg-[#0d0d0d]">
          <div className="flex justify-between items-center mb-8 border-b border-[#222] pb-4">
            <span className="text-[0.6rem] text-[#444] tracking-[2px] font-bold">
              DATA INPUT
            </span>
            <span className="text-[0.6rem] text-eprx-lime tracking-[2px] font-mono animate-pulse">
              {status}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 group">
              <label className="text-[0.6rem] tracking-[1px] text-eprx-lime opacity-70 group-focus-within:opacity-100 transition-opacity">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="OPERATOR NAME"
                className="bg-transparent border-b border-[#222] py-2 text-white outline-none focus:border-eprx-lime transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[0.6rem] tracking-[1px] text-eprx-lime opacity-70 group-focus-within:opacity-100 transition-opacity">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="UPLINK@DOMAIN.COM"
                className="bg-transparent border-b border-[#222] py-2 text-white outline-none focus:border-eprx-lime transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[0.6rem] tracking-[1px] text-eprx-lime opacity-70 group-focus-within:opacity-100 transition-opacity">
                MESSAGE
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="ENTER MESSAGE..."
                rows={4}
                className="bg-[#050505] border border-[#222] p-4 text-white outline-none focus:border-eprx-lime transition-colors text-sm resize-none font-inter"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={status !== "IDLE"}
              className={`mt-4 py-4 font-bebas text-xl tracking-[4px] transition-all duration-300 disabled:opacity-50 ${
                status === "LINK_ESTABLISHED"
                  ? "bg-white text-black"
                  : "bg-eprx-lime text-black"
              }`}
            >
              {status === "IDLE" ? "SEND MESSAGE" : status}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
