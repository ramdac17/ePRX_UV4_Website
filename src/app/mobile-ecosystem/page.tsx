"use client";

import React, { useRef, useEffect, useState } from "react";

const MobileEcosystem = () => {
  const mobileRef = useRef<HTMLElement>(null);
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 🛰️ Operational Screen Filenames
  const mobileScreens = [
    "LoginScreen.jpg",
    "Dashboard.jpg",
    "Profile.jpg",
    "Timer.jpg",
    "History.jpg",
    "GeoMap.jpg",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMobileVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (mobileRef.current) observer.observe(mobileRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={styles.mobileSection} ref={mobileRef}>
      <div
        style={{
          opacity: isMobileVisible ? 1 : 0,
          transform: isMobileVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease-out",
        }}
      >
        {/* 1. HEADER */}
        <div style={styles.headerStack}>
          <h2 style={styles.mobileTitle}>
            <span style={styles.sectionNum}> || MOBILE APP</span>
            MOBILE <span style={{ color: "#d4ff00" }}>ECOSYSTEM</span>
          </h2>
          <p style={styles.mobileDesc}>
            The digital extension of your performance. Track real-time
            activities on the go with the ePRX native interface.
          </p>
        </div>

        {/* 2. CARD GRID (6 Cards, 2 Rows) */}
        <div style={styles.cardGrid}>
          {mobileScreens.map((fileName, i) => (
            <div
              key={fileName}
              style={{
                ...styles.mobileCard,
                transform:
                  hoveredCard === fileName
                    ? "translateY(-8px)"
                    : "translateY(0)",
                borderColor: hoveredCard === fileName ? "#d4ff00" : "#1a1a1a",
                boxShadow:
                  hoveredCard === fileName
                    ? "0 15px 40px rgba(212, 255, 0, 0.15)"
                    : "none",
              }}
              onMouseEnter={() => setHoveredCard(fileName)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardInternal}>
                <img
                  // Updated path to point to public/assets/images/
                  src={`/assets/images/${fileName}`}
                  alt={fileName.replace(".jpg", "")}
                  style={styles.mockImg}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/images/comingSoon.jpg";
                  }}
                />
                <div style={styles.imgOverlay}>
                  <div style={styles.placeholderTag}>
                    PRX_MODULE_0{i + 1} ||{" "}
                    {fileName.split(".")[0].toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    ...styles.glowEffect,
                    opacity: hoveredCard === fileName ? 0.2 : 0.03,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 3. DOWNLOAD ZONE */}
        <div style={styles.footerDownload}>
          <div style={styles.inlineBadgeContainer}>
            <span style={styles.badgeLabel}>
              AVAILABLE <span style={{ color: "#d4ff00" }}> SOON </span>
              ON
            </span>
            <div style={styles.badgeWrapperRow}>
              <img
                src="/assets/images/app_store_badge.svg"
                alt="iOS"
                style={styles.badgeImg}
              />
              <img
                src="/assets/images/google_play_store_badge.svg"
                alt="Android"
                style={styles.badgeImg}
              />
            </div>
          </div>

          <div style={styles.qrContainer}>
            <div style={styles.qrFrame}>
              <img
                src="/assets/images/prxQRCode.png"
                alt="Scan"
                style={styles.qrImage}
              />
            </div>
            <span style={styles.qrLabel}>SCAN TO SYNC</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mobileSection: {
    padding: "100px 20px",
    backgroundColor: "transparent",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerStack: {
    textAlign: "center",
    marginBottom: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mobileTitle: {
    letterSpacing: "2px",
    fontWeight: "900",
    margin: "0 0 15px 0",
    textTransform: "uppercase",
    fontFamily: "var(--font-bebas)",
    fontSize: "3rem",
  },
  mobileDesc: {
    fontSize: "0.85rem",
    color: "#666",
    lineHeight: "1.8",
    maxWidth: "550px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  cardGrid: {
    display: "grid",
    // Creates 3 columns for desktop, wraps for mobile
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "30px",
    marginBottom: "100px",
    padding: "0 20px",
  },
  mobileCard: {
    aspectRatio: "9/16",
    backgroundColor: "#080808",
    borderRadius: "14px",
    border: "1px solid #1a1a1a",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    cursor: "pointer",
    maxWidth: "320px",
    margin: "0 auto",
  },
  cardInternal: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  mockImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.8) contrast(1.1)",
    transition: "all 0.5s ease",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 100%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "20px",
    justifyContent: "center",
  },
  placeholderTag: {
    fontSize: "0.55rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    zIndex: 2,
    fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: "4px 8px",
    borderRadius: "2px",
  },
  footerDownload: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "80px",
    opacity: 0.8,
  },
  inlineBadgeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  badgeLabel: {
    fontSize: "0.6rem",
    letterSpacing: "4px",
    color: "#444",
  },
  badgeWrapperRow: {
    display: "flex",
    gap: "20px",
  },
  badgeImg: {
    height: "34px",
    cursor: "pointer",
    filter: "grayscale(1) brightness(0.6)",
    transition: "0.3s",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  qrFrame: {
    padding: "8px",
    backgroundColor: "#fff",
    borderRadius: "6px",
  },
  qrImage: {
    width: "75px",
    height: "75px",
  },
  qrLabel: {
    fontSize: "0.55rem",
    letterSpacing: "3px",
    color: "#444",
  },
  glowEffect: {
    position: "absolute",
    bottom: "-10%",
    width: "100%",
    height: "30%",
    backgroundColor: "#d4ff00",
    filter: "blur(45px)",
    transition: "opacity 0.4s ease",
    zIndex: 1,
  },
  sectionNum: {
    color: "#333",
    fontSize: "0.6rem",
    letterSpacing: "5px",
    display: "block",
    textAlign: "center",
    marginBottom: "8px",
  },
};

export default MobileEcosystem;
