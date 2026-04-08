"use client";

import React from "react";
import Link from "next/link";
import { homeStyles as styles, mobileStyles } from "../../components/styles";

const PillarsPage = () => {
  const pillarNames = ["FUEL", "GEAR", "MIND"];

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
          {pillarNames.map((name, i) => (
            <Link
              key={name}
              href={`/${name.toLowerCase()}`}
              style={styles.pillarCard}
            >
              <div
                style={{
                  ...styles.pillarImageOverlay,
                  backgroundImage: `url(/assets/images/${name}V2.png)`,
                }}
              />
              <div style={styles.pillarContent}>
                <span style={styles.cardNum}>0{i + 1}</span>
                <h3 style={styles.cardTitle}>{name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PillarsPage;
