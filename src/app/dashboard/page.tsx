"use client";

import React from "react";
import { motion } from "framer-motion";

// Hooks
import { useAuth } from "@/context/AuthContext";
import { useHomeLogic } from "../../../hooks/useHomeLogic";

// Components
import Navbar from "@/components/Navbar";
import NavbarDrawer from "@/components/NavbarDrawer";
import ActivityChart from "@/components/ActivityChart";
import MobileEcosystem from "../mobile-ecosystem/page";
import Pillar from "../pillars/page";
import Archive from "../archive/page";

import { homeStyles as styles } from "../../components/styles";

export default function Home() {
  const { logout, user } = useAuth();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isGlitching,
    isMobile,
    scrollY,
    activityData,
    stats,
    lastUpdated,
    triggerGlitch,
  } = useHomeLogic(user);

  // Main Container Style
  const heroDynamicStyle = {
    ...styles.heroSplit,
    display: "flex",
    flexDirection: "column" as any,
    height: "100vh",
    minHeight: isMobile ? "800px" : "100vh",
    paddingTop: "80px",
    position: "relative" as any,
    backgroundPositionY: `${scrollY * 0.3}px`,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* HERO SECTION */}
      <motion.section onViewportEnter={triggerGlitch} style={heroDynamicStyle}>
        {/* BRAND AREA: Logo + Tagline moved to Upper Left */}
        <div
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "column", // Stacks tagline on top of logo
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            width: "100%",
            paddingLeft: isMobile ? "0" : "5vw",
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? "0" : "150px", // Adjusted for Navbar clearance
            left: 0,
          }}
        >
          {/* REPOSITIONED TAGLINE */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              ...styles.heroTagline,
              fontSize: isMobile ? "0.7rem" : "3rem",
              letterSpacing: isMobile ? "4px" : "8px",
              textAlign: isMobile ? "center" : "left",
              margin: isMobile ? "0 0 10px 0" : "0 0 -60px 50px", // Negative margin pulls logo closer
              zIndex: 3,
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            BEYOND THE <span style={{ color: "#d4ff00" }}>MILE</span>
          </motion.h2>

          {/* BRAND LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src="/assets/images/cyber-punk-prx-logo.png"
              alt="ePRX Cyber-punk Logo"
              style={{
                width: isMobile ? "85vw" : "55vw",
                maxWidth: "950px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </motion.div>
        </div>

        {/* CHART AREA (Side-pinned) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            position: isMobile ? "relative" : ("absolute" as any),
            top: isMobile ? "0" : "220px",
            right: isMobile ? "0" : "12vw",
            width: isMobile ? "90%" : "22vw",
            maxWidth: isMobile ? "100%" : "380px",
            zIndex: 3,
            marginTop: isMobile ? "40px" : "0",
          }}
        >
          <ActivityChart
            user={user}
            data={activityData}
            stats={stats}
            isMobile={isMobile}
            lastUpdated={lastUpdated}
          />
        </motion.div>
      </motion.section>

      {/* MODULAR SECTIONS */}
      <Pillar />
      <MobileEcosystem />
      <Archive />
    </div>
  );
}
