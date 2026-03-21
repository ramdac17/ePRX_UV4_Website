"use client";

import React, { useRef, useEffect, useState } from "react";

const MobileEcosystem = () => {
  const mobileRef = useRef<HTMLElement>(null);
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mobileScreens = [1, 2, 3, 4];

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

        {/* 2. CARD GRID */}
        <div style={styles.cardGrid}>
          {mobileScreens.map((screen) => (
            <div
              key={screen}
              style={{
                ...styles.mobileCard,
                transform: hoveredCard === screen ? "scale(1.03)" : "scale(1)",
                borderColor: hoveredCard === screen ? "#d4ff00" : "#1a1a1a",
              }}
              onMouseEnter={() => setHoveredCard(screen)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardInternal}>
                <img
                  src="./assets/images/comingSoon.jpg"
                  alt={`App Screen ${screen}`}
                  style={styles.mockImg}
                />
                <div style={styles.imgOverlay}>
                  <div style={styles.placeholderTag}>PRX_UNIT_0{screen}</div>
                </div>
                <div
                  style={{
                    ...styles.glowEffect,
                    opacity: hoveredCard === screen ? 0.1 : 0.03,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 3. DOWNLOAD ZONE (Vertical line removed) */}
        <div style={styles.footerDownload}>
          <div style={styles.inlineBadgeContainer}>
            <span style={styles.badgeLabel}>AVAILABLE ON</span>
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
                src={`/assets/images/prxQRCode.png`}
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
    fontFamily: "var(--font-bebas)",
    maxWidth: "1100px",
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
    fontSize: "3.5rem",
    letterSpacing: "2px",
    fontWeight: "900",
    margin: "0 0 15px 0",
  },
  mobileDesc: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.6",
    maxWidth: "500px",
    fontFamily: "var(--font-bebas)",
    letterSpacing: "1px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    marginBottom: "80px",
  },
  mobileCard: {
    aspectRatio: "9/16",
    backgroundColor: "#0a0a0a",
    borderRadius: "16px",
    border: "1px solid #1a1a1a",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
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
    filter: "brightness(0.6) contrast(1.2)",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "20px",
    justifyContent: "center",
  },
  placeholderTag: {
    fontSize: "0.6rem",
    color: "#fff",
    letterSpacing: "3px",
    zIndex: 2,
    opacity: 0.7,
  },
  footerDownload: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px",
    paddingTop: "20px", // Reduced since border is gone
    borderTop: "none", // Line removed here
  },
  inlineBadgeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  badgeLabel: {
    fontSize: "0.65rem",
    letterSpacing: "2px",
    color: "#444",
  },
  badgeWrapperRow: {
    display: "flex",
    gap: "15px",
  },
  badgeImg: {
    height: "38px",
    cursor: "pointer",
    filter: "grayscale(1) brightness(0.7)",
    transition: "0.3s",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  qrFrame: {
    padding: "8px",
    backgroundColor: "#fff",
    borderRadius: "6px",
  },
  qrImage: {
    width: "80px",
    height: "80px",
  },
  qrLabel: {
    fontSize: "0.55rem",
    letterSpacing: "1px",
    color: "#444",
  },
  glowEffect: {
    position: "absolute",
    bottom: "-10%",
    width: "100%",
    height: "30%",
    backgroundColor: "#d4ff00",
    filter: "blur(40px)",
    transition: "opacity 0.3s ease",
    zIndex: 1,
  },
  sectionNum: {
    color: "#444",
    fontSize: "0.7rem",
    letterSpacing: "3px",
    display: "block",
    textAlign: "center",
    marginBottom: "5px",
  },
};

export default MobileEcosystem;
