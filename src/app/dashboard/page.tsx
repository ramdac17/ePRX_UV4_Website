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
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
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
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
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
    isGlitching,
  } = useHomeLogic(user);

  // 🛠️ SINGLE SOURCE OF TRUTH: Aggregate Rechart dataset values directly first to ensure absolute parity
  const computedMileage = React.useMemo(() => {
    if (Array.isArray(activityData) && activityData.length > 0) {
      return activityData.reduce((acc, item) => {
        // Safely check common database properties falling back to 0
        const val = item.mileage || item.km || item.distance || 0;
        return acc + val;
      }, 0);
    }
    // Fallback cleanly to your hook's totalKm metric parsed as a number if it exists
    return stats?.totalKm ? parseFloat(stats.totalKm) : 0;
  }, [stats, activityData]);

  // Inject the calculated single source of truth straight into the existing totalKm key
  const syncedStats = React.useMemo(() => {
    // Use toFixed(2) to strip floating point trail, then parseFloat to drop trailing zeros if it's a whole number
    const formattedMileage = parseFloat(computedMileage.toFixed(2));

    return {
      ...stats,
      totalKm: `${formattedMileage.toLocaleString()} KM`,
    };
  }, [stats, computedMileage]);

  // Type-safe user profile name extraction
  const displayUserName = React.useMemo(() => {
    // Cast to any safely to check if a name string exists on the runtime object,
    // otherwise fallback to the user email split or standard anonymous string
    const arbitraryUser = user as any;
    const rawName =
      arbitraryUser?.name ||
      arbitraryUser?.username ||
      user?.email?.split("@")[0];

    return rawName || "ANONYMOUS_RIDER";
  }, [user]);

  // ⚡ DYNAMIC LEADERBOARD: Contains only the single current verified logged-in driver session
  const sortedLeaderboard = React.useMemo(() => {
    const rawRiders = [
      {
        name: displayUserName.toUpperCase(),
        numericMileage: computedMileage,
        isCurrentUser: true,
      },
    ];

    // Order descending strictly by the numericMileage value, slice to 5 items, and apply rank
    return rawRiders
      .sort((a, b) => b.numericMileage - a.numericMileage)
      .slice(0, 5)
      .map((rider, index) => ({
        ...rider,
        rank: index + 1,
        mileage: `${rider.numericMileage.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} KM`,
      }));
  }, [displayUserName, computedMileage]);

  // 🌐 HANDLER: Share profile stats safely to Facebook endpoints
  const handleFacebookShare = React.useCallback(() => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    const trackingText = `Tracking performance metrics on the board! Core runtime distance logged: ${computedMileage.toFixed(2)} KM.`;
    const fbEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(trackingText)}`;

    window.open(
      fbEndpoint,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  }, [computedMileage]);

  // Strongly-typed style configs to completely clear inline redline type validation issues
  const heroDynamicStyle: React.CSSProperties = {
    ...styles.heroSplit,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    minHeight: isMobile ? "1150px" : "100vh",
    paddingTop: "80px",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#000",
  };

  const glitchBgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('/assets/images/cyber-punk-prx-logo.png')",
    backgroundSize: "cover",
    backgroundPosition: `center ${scrollY * 0.3}px`,
    zIndex: 0,
    opacity: 1.6,
  };

  const brandPanelStyle: React.CSSProperties = {
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: isMobile ? "center" : "flex-start",
    width: isMobile ? "90%" : "auto",
    paddingLeft: isMobile ? "0" : "8vw",
    position: isMobile ? "relative" : "absolute",
    top: isMobile ? "0" : "160px",
    left: 0,
    gap: "28px",
  };

  const headerTaglineStyle: React.CSSProperties = {
    ...styles.heroTagline,
    fontSize: isMobile ? "1.8rem" : "3rem",
    letterSpacing: isMobile ? "4px" : "8px",
    textAlign: isMobile ? "center" : "left",
    margin: 0,
    zIndex: 3,
    color: "#fff",
    textTransform: "uppercase",
  };

  const rankPanelStyle: React.CSSProperties = {
    width: isMobile ? "100%" : "340px",
    backgroundColor: "rgba(5, 5, 5, 0.85)",
    border: "1px solid #1c1c1c",
    boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
    padding: "20px",
    fontFamily: "monospace",
    opacity: isGlitching ? 0.8 : 1,
    transition: "opacity 0.2s",
  };

  const panelHeaderStyle: React.CSSProperties = {
    color: "#d4ff00",
    fontSize: "0.7rem",
    letterSpacing: "3px",
    marginBottom: "16px",
    borderBottom: "1px solid #222",
    paddingBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
  };

  const chartContainerStyle: React.CSSProperties = {
    position: isMobile ? "relative" : "absolute",
    top: isMobile ? "0" : "160px",
    right: isMobile ? "0" : "5vw",
    width: isMobile ? "90%" : "25vw",
    maxWidth: "400px",
    zIndex: 3,
    marginTop: isMobile ? "32px" : "0",
  };

  const overlayDepthStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%)",
    zIndex: 1,
    pointerEvents: "none",
  };

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onViewportEnter={() => triggerGlitch()}
        style={heroDynamicStyle}
      >
        {/* ⚡ ONE-TIME GLITCH BACKGROUND IMAGE */}
        <motion.div
          animate={
            isGlitching
              ? {
                  x: [-10, 10, -5, 5, 0],
                  skewX: [0, -15, 15, -5, 0],
                  filter: [
                    "hue-rotate(0deg) brightness(1) contrast(1)",
                    "hue-rotate(90deg) brightness(1.5) contrast(1.2)",
                    "hue-rotate(-90deg) brightness(1.2) contrast(1.1)",
                    "hue-rotate(0deg) brightness(1) contrast(1)",
                  ],
                }
              : { x: 0, skewX: 0, filter: "hue-rotate(0deg) brightness(1)" }
          }
          transition={{
            duration: 0.4,
            repeat: 0,
            ease: "linear",
          }}
          style={glitchBgStyle}
        />

        {/* BRAND AREA + LEADERBOARD PANEL (BELOW HEADER) */}
        <div style={brandPanelStyle}>
          <motion.h2 variants={itemLeftVariants} style={headerTaglineStyle}>
            BEYOND THE <span style={{ color: "#d4ff00" }}>MILE</span>
          </motion.h2>

          {/* DYNAMIC RANKING PANEL */}
          <motion.div variants={itemLeftVariants} style={rankPanelStyle}>
            <div style={panelHeaderStyle}>
              <span>|| TOP 5 RANKING</span>
              <span style={{ color: "#444" }}>LIVE FEED</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {sortedLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    padding: item.isCurrentUser ? "6px 8px" : "2px 0px",
                    backgroundColor: item.isCurrentUser
                      ? "rgba(212, 255, 0, 0.08)"
                      : "transparent",
                    border: item.isCurrentUser
                      ? "1px dashed rgba(212, 255, 0, 0.3)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{ color: item.isCurrentUser ? "#d4ff00" : "#444" }}
                    >
                      0{item.rank}
                    </span>
                    <span
                      style={{
                        color: item.isCurrentUser ? "#d4ff00" : "#fff",
                        fontWeight: item.isCurrentUser ? "bold" : "normal",
                      }}
                    >
                      {item.name} {item.isCurrentUser && "(YOU)"}
                    </span>
                  </div>
                  <span
                    style={{ color: item.isCurrentUser ? "#d4ff00" : "#fff" }}
                  >
                    {item.mileage}
                  </span>
                </div>
              ))}
            </div>

            {/* 🌐 FACEBOOK ICON INTERACTIVE ELEMENT */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "12px",
                borderTop: "1px dashed #222",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#444", fontSize: "0.6rem" }}>
                SHARE RANKING
              </span>
              <button
                onClick={handleFacebookShare}
                aria-label="Share to Facebook"
                style={{
                  background: "transparent",
                  border: "1px solid #d4ff00",
                  color: "#d4ff00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d4ff00";
                  e.currentTarget.style.color = "#000";
                  const path = e.currentTarget.querySelector("path");
                  if (path) path.style.fill = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#d4ff00";
                  const path = e.currentTarget.querySelector("path");
                  if (path) path.style.fill = "#d4ff00";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: "block" }}
                >
                  <path
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"
                    fill="#d4ff00"
                    style={{ transition: "fill 0.2s ease" }}
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT CHART AREA */}
        <motion.div variants={itemRightVariants} style={chartContainerStyle}>
          <div style={{ width: "100%" }}>
            <ActivityChart
              user={user}
              data={activityData}
              stats={syncedStats}
              isMobile={isMobile}
              lastUpdated={lastUpdated}
            />
          </div>
        </motion.div>

        {/* OVERLAY: Gradients for depth */}
        <div style={overlayDepthStyle} />
      </motion.section>

      <Pillar />
      <MobileEcosystem />
      <Archive />
    </div>
  );
}
