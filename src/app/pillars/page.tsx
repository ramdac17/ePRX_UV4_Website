"use client";

import React, { useState } from "react";
import Link from "next/link";
import { homeStyles as styles, mobileStyles } from "../../components/styles";

const PillarsPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pillars = [
    { name: "FUEL", path: "/assets/images/FuelV2.png" },
    { name: "GEAR", path: "/assets/images/GearV2.png" },
    { name: "MIND", path: "/assets/images/MindV2.png" },
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
                    filter: isHovered
                      ? "grayscale(0%) brightness(1)"
                      : "grayscale(100%) brightness(0.6)",
                  }}
                />
                <div style={styles.pillarContent}>
                  <span
                    style={{
                      ...styles.cardNum,
                      color: isHovered ? "#d4ff00" : "#444",
                      transition: "color 0.3s ease",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      ...styles.cardTitle,
                      color: isHovered ? "#d4ff00" : "#fff",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {pillar.name}
                  </h3>
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
