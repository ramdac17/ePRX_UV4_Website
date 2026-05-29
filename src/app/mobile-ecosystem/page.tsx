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
            <span style={styles.sectionNum}>|| MOBILE APP ON THE GO</span>
            MOBILE <span style={{ color: "#d4ff00" }}>ECOSYSTEM</span>
          </h2>

          {/* BRAND LOGO */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px 0 20px 0",
            }}
          >
            <img
              src="/assets/images/cyber-punk-prx-logo-design-V3.png"
              alt="Cyberpunk PRX Logo"
              style={{
                height: "auto",
                width: "clamp(80px, 10vw, 120px)",
                objectFit: "contain",
              }}
            />
          </div>

          <p style={styles.mobileDesc}>
            The digital extension of your performance. Track real-time
            activities on the go with the ePRX native interface.
          </p>
        </div>

        {/* SINGLE ROW CARD CONTAINER */}
        <div
          className="hide-scrollbar"
          style={{
            paddingBottom: "40px",
            WebkitOverflowScrolling: "touch",
            display: "block",
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

        {/* BETA DOWNLOAD & QR ZONE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px auto 40px auto",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "12px",
              backgroundColor: "#111",
              border: "1px solid #222",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "inline-block",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#d4ff00")
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
          >
            {/* If the QR image itself should be clickable to download, wrap this img in an <a> tag */}
            <a
              href="https://expo.dev/accounts/ramdac17/projects/eprx-uv1-monorepo/builds/8f09f1f5-8e29-4af9-b1e3-878f73755c0b"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block" }}
            >
              <img
                src="/assets/images/PRXQRV4.jpg"
                alt="Download ePRX Beta QR Code"
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              />
            </a>
          </div>
          <p
            style={{
              marginTop: "16px",
              color: "#aaa",
              fontSize: "0.9rem",
              letterSpacing: "1px",
              maxWidth: "400px",
              lineHeight: "1.5",
            }}
          >
            Download the Android Beta version. Scan the QR code or click{" "}
            <a
              href="https://expo.dev/accounts/ramdac17/projects/eprx-uv1-monorepo/builds/8f09f1f5-8e29-4af9-b1e3-878f73755c0b"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#d4ff00",
                textDecoration: "underline",
                fontWeight: "bold",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              HERE
            </a>{" "}
            to get the app.
          </p>
        </div>

        {/* DOWNLOAD ZONE */}
        <div
          style={{
            ...styles.footerDownload,
            marginTop: "20px",
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
    </div>
  </div>
);

export default MobileEcosystem;
