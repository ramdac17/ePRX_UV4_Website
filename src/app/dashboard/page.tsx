"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NavbarDrawer from "@/components/NavbarDrawer";
import MobileEcosystem from "../mobile-ecosystem/page";

// ✅ Recharts components
import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  Area,
  ComposedChart,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

export default function Home() {
  const { logout, user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDataHovered, setIsDataHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ✅ Activity Data States
  const [activityData, setActivityData] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgPace: "0.00", totalKm: "0.0" });
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // Intersection Observer Refs
  const pillarRef = useRef(null);
  const mobileRef = useRef(null);
  const archiveRef = useRef(null);
  const [isPillarVisible, setPillarVisible] = useState(false);
  const [isMobileVisible, setMobileVisible] = useState(false);
  const [isArchiveVisible, setArchiveVisible] = useState(false);

  // ✅ Tactical Timestamp
  const lastUpdated = useMemo(() => {
    return new Date()
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
      .toUpperCase();
  }, []);

  /**
   * 🛰️ DATA_UPLINK_PROTOCOL
   */
  useEffect(() => {
    async function fetchDashboardMetrics() {
      if (!user) return;

      try {
        // ✅ get token from AuthContext, not localStorage directly
        const { token } = JSON.parse(
          localStorage.getItem("eprx_session") || "{}",
        );
        if (!token) return;

        const response = await fetch(`${API_URL}/activities/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("STATUS:", response.status);

        if (!response.ok) throw new Error("FETCH_FAILED");

        const data = await response.json();
        console.log("Raw API Data:", data);

        const { recent, summary } = data;

        if (recent && Array.isArray(recent) && recent.length > 0) {
          const formatted = recent
            .slice(0, 7)
            .reverse()
            .map((act: any) => ({
              day: new Date(act.createdAt)
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase(),
              distance: Number(act.distance) || 0,
            }));

          console.log("Formatted Chart Data:", formatted);
          setActivityData(formatted);
        }

        setStats({
          avgPace: summary?.avgPace || "0.00",
          totalKm: summary?.totalDistance || "0.0",
        });
      } catch (error) {
        console.error("METRIC_SYNC_FAILURE:", error);
        setActivityData([]);
        setStats({ avgPace: "0.00", totalKm: "0.0" });
      }
    }

    fetchDashboardMetrics();
  }, [user]);

  // Fetch Latest Articles
  useEffect(() => {
    async function fetchLatestArticles() {
      try {
        const response = await fetch(`${API_URL}/article`);
        if (response.ok) {
          const data = await response.json();
          console.log("Raw API Data:", data);
          setArticles(data.slice(0, 3));
        }
      } catch (error) {
        console.error("FETCH_ARTICLES_ERROR:", error);
      } finally {
        setLoadingArticles(false);
      }
    }
    fetchLatestArticles();
  }, []);

  // Scroll & Intersection Observers
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === pillarRef.current && entry.isIntersecting)
            setPillarVisible(true);
          if (entry.target === mobileRef.current && entry.isIntersecting)
            setMobileVisible(true);
          if (entry.target === archiveRef.current && entry.isIntersecting)
            setArchiveVisible(true);
        });
      },
      { threshold: 0.2 },
    );

    if (pillarRef.current) observer.observe(pillarRef.current);
    if (mobileRef.current) observer.observe(mobileRef.current);
    if (archiveRef.current) observer.observe(archiveRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `${STATIC_URL}/${imagePath}`;
  };

  const pillarData = [
    { name: "GEAR", path: "/gear", img: "/assets/images/GearV2.png" },
    { name: "FUEL", path: "/fuel", img: "/assets/images/FuelV2.png" },
    { name: "MIND", path: "/mind", img: "/assets/images/MindV2.png" },
  ];

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 750);
  };

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* 1. HERO SECTION */}
      <motion.section
        onViewportEnter={triggerGlitch}
        style={{
          ...styles.heroSplit,
          backgroundPositionY: `${scrollY * 0.5}px`,
        }}
      >
        <div style={styles.heroLeft}>
          <div style={styles.brandContent}>
            <div style={styles.topHeroLogo} className="logo-glow">
              <img
                src="/assets/images/eprx-logo.png"
                alt="ePRX"
                style={styles.logoImageStyle}
              />
            </div>
            <h1
              style={styles.heroTitleLeft}
              className={isGlitching ? "glitch-active" : ""}
            >
              PINOY RUNNER <span style={{ color: "#d4ff00" }}>EXTREME</span>
            </h1>
            <h2 style={styles.heroTagline}>
              BEYOND THE <span style={{ color: "#d4ff00" }}>MILE</span>
            </h2>
            <p style={styles.heroSubtitleLeft}>
              A high-performance lifestyle brand curated for those who find
              freedom in running.
            </p>
            <div style={styles.heroActionContainerLeft}>
              <Link href={user ? "/dashboard" : "/login"}>
                <button style={styles.ctaBtn}>
                  {user ? "ENTER_COMMAND_CENTER" : "INITIALIZE_SESSION"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onMouseEnter={() => setIsDataHovered(true)}
            onMouseLeave={() => setIsDataHovered(false)}
            style={styles.dataContainer}
          >
            <div style={styles.dataHeader}>
              <span style={styles.dataTitle}>SESSION ACTIVITY LOGS (KM)</span>
              <div style={styles.liveIndicator}>
                <div style={styles.pulseDot}></div>
                <span style={styles.dataStatus}>
                  {user ? "LIVE_FEED" : "OFFLINE"}
                </span>
              </div>
            </div>

            <div style={styles.chartBox}>
              {user && activityData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <ComposedChart
                    data={activityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="glowGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#d4ff00"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#d4ff00"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#222"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#666"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tick={{ dy: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid #d4ff00",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        borderRadius: "4px",
                      }}
                      itemStyle={{ color: "#d4ff00" }}
                      cursor={{ stroke: "#333", strokeWidth: 1 }}
                    />
                    {/* 1. The "Glow" Layer (Area) */}
                    <Area
                      type="monotone"
                      dataKey="distance"
                      stroke="none"
                      fill="url(#glowGradient)"
                      isAnimationActive={true}
                    />
                    {/* 2. The "Bezier" Path (Line) */}
                    <Line
                      type="monotone"
                      dataKey="distance"
                      stroke="#d4ff00"
                      strokeWidth={3}
                      dot={{
                        r: 3,
                        fill: "#000",
                        stroke: "#d4ff00",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#d4ff00",
                        stroke: "#000",
                        strokeWidth: 2,
                      }}
                      animationDuration={1500}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div style={styles.lockedChartOverlay}>
                  <span style={styles.lockedText}>
                    {user ? "NO_DATA_SYNC" : "ACCESS_DENIED"}
                  </span>
                  <p style={styles.lockedSubText}>
                    {user
                      ? "COMPLETE_SESSION_TO_LOG"
                      : "INITIALIZE_SESSION_TO_VIEW"}
                  </p>
                  {!user && (
                    <Link href="/login" style={{ textDecoration: "none" }}>
                      <button style={styles.miniCta}>
                        LOGIN TO UPLINK DATA
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div style={styles.metricRow}>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>AVG_PACE</span>
                <span
                  style={{
                    ...styles.metricValue,
                    color: !user ? "#222" : isDataHovered ? "#d4ff00" : "#fff",
                  }}
                >
                  {user ? stats.avgPace : "0.00"}
                </span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>TOTAL_KM</span>
                <span
                  style={{
                    ...styles.metricValue,
                    color: !user ? "#222" : isDataHovered ? "#d4ff00" : "#fff",
                  }}
                >
                  {user ? stats.totalKm : "0.0"}
                </span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>UPDATED</span>
                <span
                  style={{ ...styles.timestampValue, opacity: user ? 1 : 0.2 }}
                >
                  {user ? lastUpdated : "XX-XX-XXXX"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. PILLARS */}
      <section style={styles.pillarSection} ref={pillarRef}>
        <div className={`reveal ${isPillarVisible ? "active" : ""}`}>
          <div style={styles.titleContainer}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionNum}> || THE PILLARS</span> ELITE'S{" "}
              <span style={{ color: "#d4ff00" }}> GUIDE</span>
            </h2>
          </div>
          <div style={styles.pillarGrid}>
            {pillarData.map((item, i) => (
              <div key={i} style={styles.pillarCard} className="pillar-card">
                <Link href={item.path} style={styles.pillarLink}>
                  <div
                    className="pillar-image"
                    style={{
                      ...styles.pillarImageOverlay,
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(${item.img})`,
                    }}
                  />
                  <div style={styles.pillarContent}>
                    <span style={styles.cardNum}>0{i + 1}</span>
                    <h3 style={styles.cardTitle}>{item.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MOBILE ECOSYSTEM */}
      <section
        id="mobile-ecosystem"
        style={{
          marginTop: "60px",
          borderTop: "1px solid #1a1a1a",
          paddingTop: "40px",
        }}
      >
        <MobileEcosystem />
      </section>

      <hr style={styles.hrStyle} />

      {/* 4. ARCHIVE */}
      <section style={styles.archiveSection} ref={archiveRef}>
        <header
          className={`reveal ${isArchiveVisible ? "active" : ""}`}
          style={styles.archiveHeader}
        >
          <h2 style={styles.archiveTitle}>
            <span style={styles.sectionNum}> || KNOWLEDGE BASE</span> THE{" "}
            <span style={{ color: "#d4ff00" }}>ARCHIVE</span>
          </h2>
        </header>
        <div style={styles.articleGrid}>
          {!loadingArticles &&
            articles.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.id}`}
                style={{
                  ...styles.articleCard,
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={() => setHoveredArticle(post.id)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <div style={styles.imageWrapper}>
                  <img
                    src={getImageUrl(post.image) || ""}
                    alt={post.title}
                    style={{
                      ...styles.articleImg,
                      filter:
                        hoveredArticle === post.id
                          ? "grayscale(0%)"
                          : "grayscale(100%) brightness(50%)",
                      transform:
                        hoveredArticle === post.id ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                </div>
                <div style={styles.articleContent}>
                  <span style={styles.volTag}>
                    {post.category} || {new Date(post.createdAt).getFullYear()}
                  </span>
                  <h3 style={styles.articleTitle}>
                    {post.title.toUpperCase()}
                  </h3>
                  <div style={styles.readLink}>READ ENTRY →</div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    overflowX: "hidden",
    width: "100%",
  },
  heroSplit: {
    minHeight: "100vh",
    display: "flex",
    width: "100%",
    paddingTop: "80px",
    backgroundImage:
      'linear-gradient(to right, rgba(15,15,15,1) 35%, rgba(15,15,15,0.2) 100%), url("/assets/images/register-sky.jpg")',
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    boxSizing: "border-box",
  },
  heroLeft: {
    flex: 1.2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "8%",
    zIndex: 2,
  },
  heroRight: {
    flex: 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "8%",
    zIndex: 2,
  },
  dataContainer: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    border: "1px solid #1a1a1a",
    padding: "30px",
    backdropFilter: "blur(10px)",
  },
  dataHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "10px",
  },
  dataTitle: {
    fontSize: "0.6rem",
    letterSpacing: "2px",
    color: "#444",
    fontWeight: "bold",
  },
  liveIndicator: { display: "flex", alignItems: "center", gap: "8px" },
  pulseDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#d4ff00",
    boxShadow: "0 0 8px #d4ff00",
  },
  dataStatus: { fontSize: "0.55rem", color: "#d4ff00", letterSpacing: "1px" },
  chartBox: { height: "180px", width: "100%", marginBottom: "25px" },
  metricRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.2fr",
    gap: "10px",
  },
  metricItem: { display: "flex", flexDirection: "column" },
  metricLabel: {
    fontSize: "0.5rem",
    color: "#666",
    letterSpacing: "1px",
    marginBottom: "5px",
  },
  metricValue: {
    fontFamily: "var(--font-bebas)",
    fontSize: "1.8rem",
    transition: "color 0.3s ease",
  },
  timestampValue: {
    fontFamily: "monospace",
    fontSize: "0.9rem",
    color: "#d4ff00",
    marginTop: "8px",
  },
  brandContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  topHeroLogo: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "40px",
    border: "2px solid #d4ff00",
    borderRadius: "50%",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  logoImageStyle: { width: "70%", height: "70%", objectFit: "contain" },
  heroTitleLeft: {
    fontFamily: "var(--font-bebas)",
    fontSize: "6vw",
    lineHeight: "0.85",
    margin: "0",
    color: "#fff",
    letterSpacing: "2px",
  },
  heroTagline: {
    fontFamily: "var(--font-bebas)",
    fontSize: "2rem",
    letterSpacing: "8px",
    margin: "10px 0 20px 0",
  },
  heroSubtitleLeft: {
    color: "#ccc",
    maxWidth: "450px",
    fontSize: "1rem",
    lineHeight: "1.6",
    letterSpacing: "1px",
    marginBottom: "30px",
  },
  heroActionContainerLeft: { marginTop: "10px" },
  ctaBtn: {
    padding: "18px 50px",
    border: "2px solid #fff",
    background: "none",
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "3px",
    fontWeight: "bold",
    fontSize: "0.8rem",
    transition: "0.3s",
  },
  pillarSection: { padding: "100px 8%" },
  titleContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontFamily: "var(--font-bebas)",
    fontSize: "3rem",
    textTransform: "uppercase",
  },
  pillarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
  },
  pillarCard: {
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
  },
  pillarLink: { textDecoration: "none", color: "inherit" },
  pillarImageOverlay: {
    height: "250px",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "all 0.4s ease-in-out",
    filter: "saturate(1.2) contrast(1.1)",
  },
  pillarContent: { padding: "20px" },
  cardNum: { color: "#d4ff00", fontSize: "0.8rem", marginBottom: "10px" },
  cardTitle: { fontFamily: "var(--font-bebas)", fontSize: "2.5rem", margin: 0 },
  mobileSection: { padding: "100px 8%", backgroundColor: "#0a0a0a" },
  mobileGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "start",
  },
  mobileTitle: { fontFamily: "var(--font-bebas)", fontSize: "3rem" },
  mobileDesc: { color: "#666", marginTop: "20px", fontSize: "0.9rem" },
  downloadZone: {
    display: "flex",
    alignItems: "flex-end",
    gap: "30px",
    marginTop: "50px",
  },
  inlineBadgeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  badgeWrapperRow: { display: "flex", flexDirection: "column", gap: "10px" },
  badgeLabel: {
    fontSize: "0.55rem",
    letterSpacing: "4px",
    color: "#666",
    fontWeight: "700",
  },
  badgeImg: { width: "130px", height: "auto" },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  qrFrame: {
    padding: "8px",
    border: "1px solid #d4ff00",
    borderRadius: "4px",
    backgroundColor: "#000",
  },
  qrImage: { width: "80px", height: "80px" },
  qrLabel: {
    fontSize: "0.5rem",
    letterSpacing: "2px",
    color: "#d4ff00",
    fontWeight: "bold",
  },
  phoneMockup: {
    width: "260px",
    height: "520px",
    border: "8px solid #1a1a1a",
    borderRadius: "40px",
    backgroundColor: "#000",
    padding: "10px",
  },
  phoneScreen: {
    height: "100%",
    backgroundColor: "#0f0f0f",
    borderRadius: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  appMetric: {
    fontFamily: "var(--font-bebas)",
    fontSize: "4rem",
    color: "#d4ff00",
  },
  archiveSection: { padding: "120px 8%" },
  archiveHeader: { textAlign: "center", marginBottom: "40px" },
  sectionNum: {
    color: "#444",
    fontSize: "0.7rem",
    letterSpacing: "3px",
    display: "block",
    textAlign: "center",
  },
  archiveTitle: { fontFamily: "var(--font-bebas)", fontSize: "3rem" },
  articleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  articleCard: {
    backgroundColor: "#0a0a0a",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #1a1a1a",
  },
  imageWrapper: { height: "250px", overflow: "hidden" },
  articleImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.6s ease",
  },
  articleContent: { padding: "20px" },
  volTag: { color: "#d4ff00", fontSize: "0.7rem", letterSpacing: "2px" },
  articleTitle: {
    fontFamily: "var(--font-bebas)",
    fontSize: "2rem",
    margin: "10px 0",
  },
  readLink: { color: "#fff", fontSize: "0.8rem", fontWeight: "bold" },
  lockedChartOverlay: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 10, 0.5)",
    border: "1px dashed #333",
    gap: "5px",
  },
  lockedText: {
    fontFamily: "var(--font-bebas)",
    fontSize: "1.5rem",
    color: "#444",
    letterSpacing: "4px",
  },
  lockedSubText: {
    fontSize: "0.5rem",
    color: "#666",
    letterSpacing: "1px",
    textAlign: "center",
  },
  miniCta: {
    padding: "8px 20px",
    border: "1px solid #d4ff00",
    background: "none",
    color: "#d4ff00",
    fontSize: "0.6rem",
    letterSpacing: "2px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  hrStyle: {
    border: "0",
    height: "1px",
    backgroundColor: "#333",
  },
};
