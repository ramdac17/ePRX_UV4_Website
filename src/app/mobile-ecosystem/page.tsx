"use client";

import React, { useRef, useEffect, useState } from "react";
import { mobileStyles as styles } from "../../components/styles";

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* The key is using !important to override the inline styles */
        @media (max-width: 1024px) {
          .responsive-flex-container { 
            justify-content: center !important; 
            margin: 0 !important;
            padding: 0 40px !important; 
          }
        }

        @media (max-width: 768px) {
          .responsive-header { font-size: 1.8rem !important; line-height: 1.2 !important; }
          .responsive-badge-stack { 
            flex-direction: column !important; 
            align-items: center !important;
            gap: 20px !important; 
          }
          .responsive-flex-container { 
            padding: 0 20px !important; 
            gap: 16px !important;
          }
        }
      `,
        }}
      />

      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease-out",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <div style={styles.headerStack}>
          <h2 className="responsive-header" style={styles.mobileTitle}>
            <span style={styles.sectionNum}>|| MOBILE APP ON THE</span>
            MOBILE <span style={{ color: "#d4ff00" }}>ECOSYSTEM</span>
          </h2>
          <p style={styles.mobileDesc}>
            The digital extension of your performance. Track real-time
            activities on the go with the ePRX native interface.
          </p>
        </div>

        {/* SINGLE ROW CARD CONTAINER */}
        <div
          className="hide-scrollbar"
          style={{
            paddingBottom: "60px",
            WebkitOverflowScrolling: "touch",
            display: "block", // Ensure block display for overflow
          }}
        >
          <div
            className="responsive-flex-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
              width: "100%",
              padding: "0 20px",
            }}
          >
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
        </div>

        {/* DOWNLOAD ZONE */}
        <div
          style={{
            ...styles.footerDownload,
            marginTop: "40px",
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="responsive-badge-stack"
            style={{
              ...styles.inlineBadgeContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={styles.badgeLabel}>
              AVAILABLE <span style={{ color: "#d4ff00" }}>SOON</span> ON
            </span>
            <div
              style={{
                ...styles.badgeWrapperRow,
                display: "flex",
                gap: "15px",
              }}
            >
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

const ScreenCard = ({ fileName, index, isHovered, onHover }: any) => (
  <div
    style={{
      ...styles.mobileCard,
      flex: "0 0 auto",
      /* Smaller cards: reduced from 140-180 to 130-165 */
      width: "clamp(130px, 14vw, 165px)",
      transform: isHovered
        ? "translateY(-15px) scale(1.04)"
        : "translateY(0) scale(1)",
      borderColor: isHovered ? "#d4ff00" : "#1a1a1a",
      boxShadow: isHovered ? "0 20px 50px rgba(212, 255, 0, 0.25)" : "none",
      transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      cursor: "pointer",
      zIndex: isHovered ? 10 : 1,
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
          width: "100%",
          height: "auto",
          aspectRatio: "9/19",
          objectFit: "cover",
          filter: isHovered ? "brightness(1.1)" : "brightness(0.65)",
        }}
        onError={(e) => (e.currentTarget.src = "/assets/images/comingSoon.jpg")}
      />
      <div style={styles.imgOverlay}>
        <div
          style={{
            ...styles.placeholderTag,
            fontSize: "0.6rem",
            opacity: isHovered ? 1 : 0.7,
          }}
        >
          APP SCREEN {index + 1}
        </div>
      </div>
      {/*  <div style={{ ...styles.glowEffect, opacity: isHovered ? 0.4 : 0 }} /> */}
    </div>
  </div>
);

export default MobileEcosystem;
