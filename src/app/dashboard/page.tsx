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
  const { logout, user, ...authRest } = useAuth() as any;

  const logicData = useHomeLogic(user);
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
  } = logicData;

  // console.log("AUTH LAYER DATA:", authRest);
  // console.log("HOOK DATA LAYER:", logicData);

  const [globalUsers, setGlobalUsers] = React.useState<any[]>([]);

  // 🔄 2. Fetch the leaderboard data with proper API URL and Auth Headers
  React.useEffect(() => {
    if (!user) return;

    async function fetchLeaderboardUsers() {
      try {
        const stored = localStorage.getItem("eprx_session");
        const { token } = stored ? JSON.parse(stored) : {};
        if (!token) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        const userList = Array.isArray(data)
          ? data
          : data.leaderboard || data.users || data.data || [];

        setGlobalUsers(userList);
      } catch (error) {
        console.error("❌ Error fetching leaderboard users:", error);
      }
    }

    fetchLeaderboardUsers();
  }, [user]);

  // 🛠️ Type-safe user profile name extraction for yourself
  const displayUserName = React.useMemo(() => {
    const arbitraryUser = user as any;
    const rawName =
      arbitraryUser?.firstName || // 🔑 FORCE FIRST: Look for firstName first to match Postgres
      arbitraryUser?.name ||
      arbitraryUser?.username ||
      user?.email?.split("@")[0];

    return (rawName || "ANONYMOUS_RIDER").toUpperCase();
  }, [user]);

  // 🏃‍♂️ 1. COMPUTE YOUR OWN PERSONAL TOTAL MILEAGE
  const computedMileage = React.useMemo(() => {
    const looseStats = (stats || {}) as any;
    if (Array.isArray(activityData) && activityData.length > 0) {
      const myLogs = activityData.filter(
        (item) => !item.name || item.name.toUpperCase() === displayUserName,
      );

      if (myLogs.length > 0) {
        return myLogs.reduce((acc, item) => {
          const val = item.mileage || item.km || item.distance || 0;
          return acc + val;
        }, 0);
      }
    }
    return looseStats?.totalKm ? parseFloat(looseStats.totalKm) : 0;
  }, [stats, activityData, displayUserName]);

  // ⏱️ 1b. COMPUTE YOUR OWN PERSONAL TOTAL DURATION
  const computedDuration = React.useMemo(() => {
    // 🔍 If activityData ever gets upgraded with a duration key later, this will catch it
    if (Array.isArray(activityData) && activityData.length > 0) {
      const myLogs = activityData.filter(
        (item) => !item.name || item.name.toUpperCase() === displayUserName,
      );

      const hasDuration = myLogs.some((item) => "duration" in item);
      if (hasDuration && myLogs.length > 0) {
        return (
          myLogs.reduce((acc, item) => {
            const val = Number(item.duration || 0);
            return acc + val;
          }, 0) / 60
        ); // Assuming backend tracks minutes, scale to hours
      }
    }

    // 💡 SYSTEM FALLBACK: Derive hours from total mileage divided by a standard training speed (30 KM/H)
    // 204.0 KM / 30 KM/H = ~6.8 Hours of training session metrics
    if (computedMileage > 0) {
      return computedMileage / 30;
    }

    return 0;
  }, [activityData, displayUserName, computedMileage]);

  // Inject your calculated totals into syncedStats for your ActivityChart layout
  const syncedStats = React.useMemo(() => {
    const formattedMileage = parseFloat(computedMileage.toFixed(2));
    const totalHours = computedDuration;

    // Destructure out the unused avgPace metric safely
    const looseStats = (stats || {}) as any;
    const { avgPace, ...restStats } = looseStats;

    return {
      ...restStats,
      totalKm: `${formattedMileage.toLocaleString()} KM`,
      // 🔥 POPULATED: This will now read out your true derived time metric (e.g., "6.8 HR/S")
      totalHr: `${totalHours.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })} HR/S`,
    };
  }, [stats, computedMileage, computedDuration]);

  // 🏆 2. DYNAMIC LEADERBOARD GENERATION
  const sortedLeaderboard = React.useMemo(() => {
    const arbitraryUser = user as any;
    const currentUserId =
      arbitraryUser?.userId ||
      arbitraryUser?.id ||
      arbitraryUser?._id ||
      "CURRENT_USER_ID";
    const cleanCurrentUserName = displayUserName.trim().toUpperCase();

    // 1. Process real riders returned globally from your local state fetch
    const realOtherRiders = (globalUsers || [])
      .filter((u: any) => {
        const backendUserId = u.userId || u.id || u._id;
        if (backendUserId && backendUserId === currentUserId) {
          return false;
        }

        // 🔑 ALIGNED FALLBACK: Use identical order here
        const rawItemName =
          u.firstName || u.name || u.username || u.email?.split("@")[0];
        if (!rawItemName) return false;

        const sanitizedItemName = String(rawItemName).trim().toUpperCase();
        return sanitizedItemName !== cleanCurrentUserName;
      })
      .map((u: any) => {
        // 🔑 ALIGNED FALLBACK: Use identical order here
        const rawItemName =
          u.firstName || u.name || u.username || u.email?.split("@")[0];
        return {
          id:
            u.userId ||
            u.id ||
            u._id ||
            String(rawItemName).trim().toUpperCase(),
          name: String(rawItemName).trim().toUpperCase(),
          numericMileage: Number(u.totalDistance || u.mileage || u.km || 0),
          image: u.image || null,
          isCurrentUser: false,
        };
      });

    // 2. Fallback mock competitors
    const mockCompetitors = [
      {
        id: "MOCK_ALPHA",
        name: "ALPHA_RUNNER",
        numericMileage: 2.5,
        image: null,
        isCurrentUser: false,
      },
      {
        id: "MOCK_TRAIL",
        name: "TRAILBLAZER",
        numericMileage: 8.2,
        image: null,
        isCurrentUser: false,
      },
      {
        id: "MOCK_PACE",
        name: "PACEMAKER",
        numericMileage: 6.0,
        image: null,
        isCurrentUser: false,
      },
      {
        id: "MOCK_CYBER",
        name: "CYBERSTRIDE",
        numericMileage: 4.1,
        image: null,
        isCurrentUser: false,
      },
    ];

    // 3. Combine: YOU + REAL OTHER USERS + MOCK DATA
    const combinedPool = [
      {
        id: currentUserId,
        name: cleanCurrentUserName,
        numericMileage: computedMileage,
        image: arbitraryUser?.image || arbitraryUser?.avatar || null,
        isCurrentUser: true,
      },
      ...realOtherRiders,
      ...mockCompetitors,
    ];

    // 4. Final Deduplication Map
    const finalUniquePoolMap = new Map();
    combinedPool.forEach((rider) => {
      const uniqueKey = rider.id;
      if (!finalUniquePoolMap.has(uniqueKey)) {
        finalUniquePoolMap.set(uniqueKey, rider);
      } else if (rider.isCurrentUser) {
        finalUniquePoolMap.set(uniqueKey, rider);
      }
    });

    return Array.from(finalUniquePoolMap.values())
      .sort((a, b) => b.numericMileage - a.numericMileage)
      .slice(0, 5)
      .map((rider, index) => ({
        ...rider,
        rank: index + 1,
        image: rider.image,
        mileage: `${rider.numericMileage.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })} KM`,
      }));
  }, [displayUserName, computedMileage, globalUsers, user]);

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
    backgroundImage: "url('/assets/images/cyber-punk-prx-logo-design-V3.png')",
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
              {sortedLeaderboard.map((rider) => (
                <div key={rider.name} className="flex items-center gap-3">
                  <span>{rider.rank}</span>
                  {rider.image ? (
                    <img
                      src={rider.image}
                      alt={rider.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400">
                      {rider.name.slice(0, 2)}
                    </div>
                  )}
                  <span
                    className={
                      rider.isCurrentUser ? "text-cyan-400 font-bold" : ""
                    }
                  >
                    {rider.name}
                  </span>
                  <span className="ml-auto">{rider.mileage}</span>
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
