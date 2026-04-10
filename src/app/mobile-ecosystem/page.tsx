"use client";

import React, { useRef, useEffect, useState } from "react";
import { mobileStyles as styles } from "../../components/styles"; // Moved to separate file

const MOBILE_SCREENS = [
  "LoginScreen.jpg",
  "Dashboard.jpg",
  "Profile.jpg",
  "Timer.jpg",
  "History.jpg",
  "GeoMap.jpg",
];

const MobileEcosystem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={styles.mobileSection} ref={sectionRef}>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease-out",
        }}
      >
        {/* HEADER */}
        <div style={styles.headerStack}>
          <h2 style={styles.mobileTitle}>
            <span style={styles.sectionNum}>|| MOBILE APP ON THE</span>
            MOBILE <span style={{ color: "#d4ff00" }}>ECOSYSTEM</span>
          </h2>
          <p style={styles.mobileDesc}>
            The digital extension of your performance. Track real-time
            activities on the go with the ePRX native interface.
          </p>
        </div>

        {/* CARD GRID */}
        <div style={styles.cardGrid}>
          {MOBILE_SCREENS.map((fileName, i) => (
            <ScreenCard
              key={fileName}
              index={i}
              fileName={fileName}
              isHovered={hoveredCard === fileName}
              onHover={setHoveredCard}
            />
          ))}
        </div>

        {/* DOWNLOAD ZONE */}
        <div style={styles.footerDownload}>
          <div style={styles.inlineBadgeContainer}>
            <span style={styles.badgeLabel}>
              AVAILABLE <span style={{ color: "#d4ff00" }}>SOON</span> ON
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
        </div>
      </div>
    </section>
  );
};

// Sub-component for clarity
const ScreenCard = ({ fileName, index, isHovered, onHover }: any) => (
  <div
    style={{
      ...styles.mobileCard,
      transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      borderColor: isHovered ? "#d4ff00" : "#1a1a1a",
      boxShadow: isHovered ? "0 15px 40px rgba(212, 255, 0, 0.15)" : "none",
    }}
    onMouseEnter={() => onHover(fileName)}
    onMouseLeave={() => onHover(null)}
  >
    <div style={styles.cardInternal}>
      <img
        src={`/assets/images/${fileName}`}
        alt={fileName}
        style={{
          ...styles.mockImg,
          filter: isHovered
            ? "brightness(1) contrast(1.1)"
            : "brightness(0.7) contrast(1)",
        }}
        onError={(e) => (e.currentTarget.src = "/assets/images/comingSoon.jpg")}
      />
      <div style={styles.imgOverlay}>
        <div style={styles.placeholderTag}>
          PRX_MODULE 0{index + 1} || {fileName.split(".")[0].toUpperCase()}
        </div>
      </div>
      <div style={{ ...styles.glowEffect, opacity: isHovered ? 0.2 : 0.03 }} />
    </div>
  </div>
);

export default MobileEcosystem;
