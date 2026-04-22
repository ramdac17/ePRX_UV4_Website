"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

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

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const itemRightVariants: Variants = {
  hidden: { opacity: 0, x: 50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: "easeOut" },
  },
};

export default function Home() {
  const { logout, user } = useAuth();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isMobile,
    scrollY,
    activityData,
    stats,
    lastUpdated,
    triggerGlitch,
  } = useHomeLogic(user);

  // Updated Hero Style: Background image left blank (transparent/black)
  const heroDynamicStyle = {
    ...styles.heroSplit,
    display: "flex",
    flexDirection: "column" as any,
    height: "100vh",
    minHeight: isMobile ? "800px" : "100vh",
    paddingTop: "80px",
    position: "relative" as any,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#000", // Blank slate for now
    backgroundImage: "",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionY: `${scrollY * 0.3}px`,
  };

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* HERO SECTION CONTAINER */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onViewportEnter={triggerGlitch}
        style={heroDynamicStyle}
      >
        {/* BRAND AREA: Logo + Tagline */}
        <div
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            width: "100%",
            paddingLeft: isMobile ? "0" : "5vw",
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? "0" : "150px",
            left: 0,
          }}
        >
          {/* TAGLINE */}
          <motion.h2
            variants={itemLeftVariants}
            style={{
              ...styles.heroTagline,
              fontSize: isMobile ? "0.7rem" : "3rem",
              letterSpacing: isMobile ? "4px" : "8px",
              textAlign: isMobile ? "center" : "left",
              margin: isMobile ? "0 0 10px 0" : "0 0 -60px 50px",
              zIndex: 3,
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            BEYOND THE <span style={{ color: "#d4ff00" }}>MILE</span>
          </motion.h2>

          {/* BRAND LOGO */}
          <motion.div variants={itemLeftVariants}>
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

        {/* CHART AREA (Pops in from the right) */}
        <motion.div
          variants={itemRightVariants}
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

        {/* OPTIONAL: Hero Background Overlay for better text readability later */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </motion.section>

      {/* MODULAR SECTIONS */}
      <Pillar />
      <MobileEcosystem />
      <Archive />
    </div>
  );
}
