"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const sections = [
    {
      id: "01",
      title: "THE MISSION",
      content:
        "PRXph.com (PINOY RUNNER EXTREME) IS ENGINEERED TO BRIDGE THE GAP BETWEEN ARCHAIZED DATA SYSTEMS AND THE FUTURE OF SECURE DIGITAL INTERACTION.",
    },
    {
      id: "02",
      title: "THE TECH",
      content:
        "BUILT ON A FOUNDATION OF NEXT-GEN REACT ARCHITECTURE AND POSTGRESQL CORE, PRXph.com SYSTEM ENSURES SUB-MILLISECOND LATENCY.",
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

  const history = [
    {
      year: "2013",
      title: "OUR HUMBLE BEGINNING",
      content:
        "PRX (or formerly known as PRE) was officially founded in 2013. The idea and foundation were built on the pavement of UP Diliman where admins decided to pursue the project. In these early days, the mission was simple: movement, community, and the burning desire to reach the 'extra mile.'",
    },
    {
      year: "2014",
      title: "THE 'FUN RUN' ERA",
      content:
        "The group quickly moved beyond local training sessions and began joining various fun runs across different locations, spanning the metro and beyond. This active participation wasn't just about medals—it was about establishing a presence and testing the limits of the collective.",
    },
    {
      year: "2015",
      title: "DIGITAL GROWTH & THE FB COMMUNITY",
      content:
        "As the group’s reputation grew, so did its digital footprint. The community expanded gradually, attracting individuals to join the official Facebook page, pinoyrunnerextreme. This platform served as the primary repository for race photos, training tips, and community engagement, solidifying the group as a small player in the local running community.",
    },
    {
      year: "2000",
      title: "THE IDENTITY SHIFT: FROM PRE TO PRX",
      content:
        "For many years, the group was known by the acronym PRE (Pinoy Runner Extreme). However, as the vision for the brand evolved toward a more sophisticated, tech-driven aesthetic, the administration made a strategic decision to pivot. The shift to PRX was implemented to align with the cyber-minimalist design of the main website. This wasn't just a name change—it was a total rebranding to match a future-facing philosophy where athletic performance meets digital precision.",
    },
    {
      year: "2026",
      title: "HIATUS & THE VISTA REBIRTH",
      content:
        "Every great project requires a period of recalibration. PRX entered a hiatus for a significant period, stepping back from the public eye to restructure and innovate. Today, the brand has returned with the PRX structure fully realized—headlined by the ePRX UV (Unified Version) framework. The new era of PRX is no longer just about running; it is about an integrated lifestyle of FUEL, GEAR, and MIND, optimized for peak performance in the modern age.",
    },
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col justify-center items-center px-[5%] py-16 text-white font-inter">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 mt-10 border-2 border-eprx-lime overflow-hidden shadow-[0_0_20px_rgba(212,255,0,0.3)]">
          <img
            src="/assets/images/eprx-logo.png"
            alt="PRX Logo"
            className="w-full h-full object-contain"
          />
        </div>

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
            className="w-full max-w-3xl mb-16"
          >
            <div className="relative border border-[#1a1a1a] p-1 bg-[#080808]">
              <img
                src="/assets/images/cyber-punk-prx-logo.png"
                alt="PRX Operational Interface"
                className="w-full h-auto max-h-100 object-cover block filter"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />
            </div>
          </motion.div>

          {/* NEW HISTORY SECTION */}
          <div className="w-full max-w-3xl text-left">
            <h2 className="font-bebas text-3xl text-eprx-lime mb-4 tracking-wider">
              THE EVOLUTION OF PERFORMANCE: A HISTORY OF PRX
            </h2>
            <p className="text-[0.9rem] leading-relaxed text-[#888] mb-12 border-l border-eprx-lime pl-6 italic">
              The trajectory of PRX is a journey from local grassroots running
              to a high-tech, cyber-minimalist ecosystem. What started as a
              collective of athletes in the northern district of Manila has
              transformed into the digital-first architecture you see today.
            </p>

            <div className="space-y-12">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 border-l border-[#1a1a1a]"
                >
                  <div className="absolute -left-1.25 top-0 w-2 h-2 bg-eprx-lime rounded-full shadow-[0_0_8px_#d4ff00]" />
                  <span className="text-[0.6rem] font-bold text-eprx-lime tracking-[3px] block mb-2 opacity-50">
                    {item.year}
                  </span>
                  <h3 className="font-bebas text-2xl text-white tracking-widest mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[0.85rem] leading-relaxed text-[#666]">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24 max-w-6xl">
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

        <section className="border-t border-[#111] pt-20 mb-24 max-w-6xl mx-auto">
          <h2 className="text-[0.65rem] tracking-[4px] text-[#333] text-center mb-16">
            <span className="text-eprx-lime">|</span> DEVELOPER || ADMIN
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
      </div>
    </div>
  );
}
