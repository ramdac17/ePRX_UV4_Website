"use client";

import React from "react";
import Link from "next/link";
import { homeStyles as styles, mobileStyles } from "../../components/styles";

const PillarsPage = () => {
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
          {pillars.map((pillar, i) => (
            <Link
              key={pillar.name}
              href={`/${pillar.name.toLowerCase()}`}
              style={styles.pillarCard} // Hover effects restored from styles.js
            >
              <div
                style={{
                  ...styles.pillarImageOverlay,
                  backgroundImage: `url(${pillar.path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  /* Removed "none" overrides to re-enable 
                     transitions and filters from the stylesheet 
                  */
                }}
              />
              <div style={styles.pillarContent}>
                <span style={styles.cardNum}>0{i + 1}</span>
                <h3 style={styles.cardTitle}>{pillar.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PillarsPage;
