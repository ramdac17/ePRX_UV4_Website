"use client";

import React, { useState } from "react";
import Link from "next/link";
import { homeStyles as styles, mobileStyles } from "../../components/styles";

const PillarsPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pillars = [
    {
      name: "FUEL",
      path: "/assets/images/FuelV2.png",
      description:
        "Optimize nutritional intake, hydration tracking, and metabolic efficiency.",
    },
    {
      name: "GEAR",
      path: "/assets/images/GearV2.png",
      description:
        "Manage physical equipment states, telemetry maintenance, and comfort.",
    },
    {
      name: "MIND",
      path: "/assets/images/MindV2.png",
      description:
        "Calibrate mental endurance, strategic thinking and physical recovery.",
    },
  ];

  return (
    <main style={styles.pageContainer}>
      <section style={styles.pillarSection}>
        {/* ALIGNED HEADER PATTERN */}
        <div style={mobileStyles.headerStack}>
          <h2 style={mobileStyles.mobileTitle}>
            <span style={mobileStyles.sectionNum}>|| THE CORE FOUNDATION</span>
            THE <span style={{ color: "#d4ff00" }}>PILLARS</span>
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
                width: "clamp(80px, 10vw, 120px)", // Scales beautifully across viewports
                objectFit: "contain",
              }}
            />
          </div>

          <p style={mobileStyles.mobileDesc}>
            The fundamental architecture of your progress. Optimize your output
            through specialized modules designed for peak performance.
          </p>
        </div>

        {/* GRID SECTION */}
        <div style={styles.pillarGrid}>
          {pillars.map((pillar, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <Link
                key={pillar.name}
                href={`/${pillar.name.toLowerCase()}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  ...styles.pillarCard,
                  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                  transform: isHovered ? "translateY(-10px)" : "translateY(0)",
                  border: isHovered ? "1px solid #d4ff00" : "1px solid #1a1a1a",
                  overflow: "hidden",
                  textDecoration: "none",
                  backgroundColor: "#000", // Solid base for image depth
                }}
              >
                <div
                  style={{
                    ...styles.pillarImageOverlay,
                    backgroundImage: `url(${pillar.path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "all 0.6s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    /* REMOVED GRAYSCALE: Initial state is now full color */
                    filter: isHovered
                      ? "brightness(1.1)" // Slight pop on hover
                      : "brightness(0.8)", // Clean, high-contrast look
                  }}
                />
                <div
                  style={{
                    ...styles.pillarContent,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    style={{
                      ...styles.cardTitle,
                      color: isHovered ? "#d4ff00" : "#fff",
                      transition: "color 0.3s ease",
                      textShadow: "0px 2px 10px rgba(0,0,0,0.8)", // Better legibility over colored images
                      marginBottom: "6px",
                    }}
                  >
                    {pillar.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      lineHeight: "1.4",
                      color: isHovered ? "#bbb" : "#888",
                      transition: "color 0.3s ease",
                      margin: 0,
                      textShadow: "0px 1px 8px rgba(0,0,0,0.9)",
                      maxWidth: "90%",
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PillarsPage;
