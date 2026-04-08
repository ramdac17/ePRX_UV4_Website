"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// Components
import Navbar from "@/components/Navbar";
import NavbarDrawer from "@/components/NavbarDrawer";
import ActivityChart from "@/components/ActivityChart";

// Refactored Sections (Ensure these point to the right components)
import MobileEcosystem from "../mobile-ecosystem/page";
import Pillar from "../pillars/page";
import Archive from "../archive/page";

import { homeStyles as styles } from "../../components/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { logout, user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Data States for Dashboard
  const [activityData, setActivityData] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgPace: "0.00", totalKm: "0.0" });

  // 1. Initial Listeners
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 968);
    const handleScroll = () => setScrollY(window.scrollY);

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Fetch Dashboard Metrics (Only for the Hero Chart)
  useEffect(() => {
    if (!user) return;
    const fetchMetrics = async () => {
      try {
        const stored = localStorage.getItem("eprx_session");
        const { token } = stored ? JSON.parse(stored) : {};
        const res = await fetch(`${API_URL}/activities/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.recent) {
          setActivityData(
            data.recent
              .slice(0, 7)
              .reverse()
              .map((act: any) => ({
                day: new Date(act.createdAt)
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase(),
                distance: Number(act.distance) || 0,
              })),
          );
        }
        setStats({
          avgPace: data.summary?.avgPace || "0.00",
          totalKm: data.summary?.totalDistance || "0.0",
        });
      } catch (e) {
        console.error("METRIC_SYNC_FAILURE", e);
      }
    };
    fetchMetrics();
  }, [user]);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 750);
  };

  const lastUpdated = useMemo(
    () =>
      new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
        .toUpperCase(),
    [],
  );

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* HERO SECTION */}
      <motion.section
        onViewportEnter={triggerGlitch}
        style={{
          ...styles.heroSplit,
          flexDirection: isMobile ? "column" : "row",
          height: isMobile ? "auto" : "100vh",
          paddingTop: isMobile ? "120px" : "80px",
          backgroundPositionY: `${scrollY * 0.3}px`, // Adjusted parallax speed
        }}
      >
        <div
          style={{
            ...styles.heroLeft,
            textAlign: isMobile ? "center" : "left",
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              ...styles.brandContent,
              alignItems: isMobile ? "center" : "flex-start",
            }}
          >
            <div style={styles.topHeroLogo} className="logo-glow">
              <img
                src="/assets/images/eprx-logo.png"
                alt="ePRX"
                style={styles.logoImageStyle}
              />
            </div>
            <h1
              style={{
                ...styles.heroTitleLeft,
                fontSize: isMobile ? "12vw" : "6vw",
              }}
              className={isGlitching ? "glitch-active" : ""}
            >
              <span style={{ color: "#d4ff00" }}>P</span>INOY{" "}
              <span style={{ color: "#d4ff00" }}>R</span>UNNER E
              <span style={{ color: "#d4ff00" }}>X</span>TREME
            </h1>
            <h2
              style={{
                ...styles.heroTagline,
                fontSize: isMobile ? "1.2rem" : "2rem",
              }}
            >
              BEYOND THE <span style={{ color: "#d4ff00" }}>MILE</span>
            </h2>
            <Link href={user ? "/dashboard" : "/login"}>
              <button style={styles.ctaBtn}>
                {user ? "ACCESS DASHBOARD" : "GET STARTED"}
              </button>
            </Link>
          </div>
        </div>

        <div style={styles.heroRight}>
          <ActivityChart
            user={user}
            data={activityData}
            stats={stats}
            isMobile={isMobile}
            lastUpdated={lastUpdated}
          />
        </div>
      </motion.section>

      {/* MODULAR SECTIONS */}
      <Pillar />
      <MobileEcosystem />
      <Archive />
    </div>
  );
}
