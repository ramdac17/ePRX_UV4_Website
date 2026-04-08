"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const sections = [
    {
      id: "01",
      title: "THE MISSION",
      content:
        "PRX.com (PINOY RUNNER EXTREME) IS ENGINEERED TO BRIDGE THE GAP BETWEEN ARCHAIZED DATA SYSTEMS AND THE FUTURE OF SECURE DIGITAL INTERACTION.",
    },
    {
      id: "02",
      title: "THE TECH",
      content:
        "BUILT ON A FOUNDATION OF NEXT-GEN REACT ARCHITECTURE AND POSTGRESQL CORE, PRX.com SYSTEM ENSURES SUB-MILLISECOND LATENCY.",
    },
    {
      id: "03",
      title: "THE VISION",
      content:
        "WE ARE ARCHITECTING AN ECOSYSTEM FOR ELITE ATHLETES WHO DEMAND EFFICIENCY, SPEED, AND MINIMALIST PRECISION.",
    },
  ];

  const admins = [
    {
      name: "Merric Kyo Evangelista",
      role: "SOFTWARE ENGINEER | LEAD DEVELOPER | SITE OWNER",
      img: "/assets/images/MerricV5.jpg",
      bio: "RESPONSIBLE FOR THE OVERALL CORE STRUCTURE AND DATA UPLINK PROTOCOLS. A DEDICATED RUNNER, A LOVING FATHER AND A GAMER AT HEART.",
    },
  ];

  return (
    /* Use the global background variable and Inter font */
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

        {/* Header Section */}
        <header className="mb-20 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[0.6rem] text-[#444] tracking-[4px] mb-4"
          >
            CORE SYSTEM ||{" "}
            <span className="text-eprx-lime">PINOY RUNNER EXTREME</span> || EST
            2013
          </motion.span>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-bebas text-5xl md:text-6xl tracking-tight mb-8 uppercase"
          >
            ABOUT <span className="text-eprx-lime">PRX</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl"
          >
            <div className="relative border border-[#1a1a1a] p-1 bg-[#080808]">
              <img
                src="/assets/images/prx-3dV2.jpg"
                alt="PRX Operational Interface"
                className="w-full h-auto max-h-100 object-cover block filter"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />
            </div>
            <p className="text-[0.75rem] leading-relaxed text-[#666] mt-8 text-left tracking-wide border-l border-eprx-lime pl-4">
              <span className="text-eprx-lime font-bold">
                PINOY RUNNER EXTREME
              </span>{" "}
              - A proactive community dedicated to fostering consistency,
              discipline, and wellness. Keep running, stay strong!
            </p>
          </motion.div>
        </header>

        {/* Grid Section - Using our 'reveal' class from globals.css */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
          {sections.map((section, i) => (
            <div
              key={section.id}
              className="bg-[#080808] p-8 border border-[#111] relative group hover:border-eprx-lime transition-colors"
            >
              <span className="text-[0.6rem] text-eprx-lime absolute top-3 right-3 opacity-30">
                {section.id}
              </span>
              <h3 className="font-bebas text-lg tracking-widest text-white mb-4 border-l-2 border-eprx-lime pl-3">
                {section.title}
              </h3>
              <p className="text-[0.8rem] leading-relaxed text-[#666] group-hover:text-white transition-colors">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Admin Section */}
        <section className="border-t border-[#111] pt-20 mb-24">
          <h2 className="text-[0.65rem] tracking-[4px] text-[#333] text-center mb-16">
            <span className="text-eprx-lime">|</span> OPERATOR LOGS || MEET THE
            ADMINS
          </h2>

          <div className="flex flex-col gap-20">
            {admins.map((admin, i) => (
              <motion.div
                key={admin.name}
                className={`flex flex-wrap items-center justify-center gap-12 w-full ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="relative">
                  <div className="w-36 h-36 rounded-full border border-[#1a1a1a] p-1.5 bg-black overflow-hidden">
                    <img
                      src={admin.img}
                      alt={admin.name}
                      className="w-full h-full rounded-full object-cover filter contrast-110 brightness-90"
                    />
                  </div>
                  <div className="absolute top-[15%] -left-2 w-px h-[70%] bg-eprx-lime opacity-40 shadow-[0_0_10px_#d4ff00]" />
                </div>

                <div
                  className={`max-w-100 flex flex-col ${i % 2 === 0 ? "text-left" : "text-right"}`}
                >
                  <span className="text-[0.6rem] text-eprx-lime tracking-[3px] font-bold uppercase">
                    {admin.role}
                  </span>
                  <h3 className="text-3xl font-bebas text-white mt-1 mb-4">
                    {admin.name}
                  </h3>
                  <div
                    className={`w-10 h-px bg-eprx-lime mb-4 ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}
                  />
                  <p className="text-[0.85rem] leading-relaxed text-[#777]">
                    {admin.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Specs */}
        <footer className="flex flex-wrap justify-between border-t border-[#111] pt-8 gap-5 pb-10">
          {["UPTIME", "PROTOCOL", "STATUS"].map((label) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[0.5rem] text-[#333] tracking-[2px]">
                {label}
              </span>
              <span
                className={`text-[0.7rem] tracking-widest font-bold ${label === "STATUS" ? "text-eprx-lime" : "text-white"}`}
              >
                {label === "UPTIME"
                  ? "99.99%"
                  : label === "PROTOCOL"
                    ? "SECURE/UPLINK"
                    : "OPERATIONAL"}
              </span>
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}
