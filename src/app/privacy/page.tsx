"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import NavbarDrawer from "@/components/NavbarDrawer";
import { useAuth } from "@/context/AuthContext";

export default function PrivacyPolicy() {
  const { logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div style={styles.pageContainer}>
      <NavbarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogout={logout}
      />
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

      <main style={styles.mainContent}>
        {/* HEADER SECTION */}
        <header style={styles.header}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.protocolTag}
          >
            PROTOCOL || DATA PROTECTION ACT 2012
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.title}
          >
            PRIVACY <span style={{ color: "#d4ff00" }}>GOVERNANCE</span>
          </motion.h1>
          <div style={styles.scanLine} />
        </header>

        {/* CONTENT GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={styles.contentGrid}
        >
          <section style={styles.section}>
            <motion.h2 variants={itemVariants} style={styles.sectionTitle}>
              01. DATA INGESTION
            </motion.h2>
            <motion.p variants={itemVariants} style={styles.text}>
              When you uplink your activity logs, we collect telemetry including
              GPS coordinates, heart rate metrics, and pace data. This
              information is used solely to calibrate your performance profile
              within the ePRX Ecosystem.
            </motion.p>
          </section>

          <section style={styles.section}>
            <motion.h2 variants={itemVariants} style={styles.sectionTitle}>
              02. ENCRYPTION STANDARDS
            </motion.h2>
            <motion.p variants={itemVariants} style={styles.text}>
              All user-specific identifiers are hashed and stored in encrypted
              vaults. We utilize industry-standard TLS 1.3 protocols to ensure
              that your data remains strictly between your device and the
              archive system.
            </motion.p>
          </section>

          <section style={styles.section}>
            <motion.h2 variants={itemVariants} style={styles.sectionTitle}>
              03. THIRD-PARTY DISCLOSURE
            </motion.h2>
            <motion.p variants={itemVariants} style={styles.text}>
              ePRX does not trade your biological or activity data to external
              advertisers. Information is only shared with authorized partners
              required for cloud computation and system maintenance.
            </motion.p>
          </section>

          <section style={styles.section}>
            <motion.h2 variants={itemVariants} style={styles.sectionTitle}>
              04. DATA ERASURE
            </motion.h2>
            <motion.p variants={itemVariants} style={styles.text}>
              You maintain total sovereignty over your logs. You may initialize
              a full "Account Purge" at any time through your dashboard
              settings, which permanently overwrites your data in our systems.
            </motion.p>
          </section>
        </motion.div>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            LAST MODIFIED: 23-MAR-2026 || VERSION_2.0.4
          </p>
        </footer>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#0f0f0f",
    color: "#fff",
    minHeight: "100vh",
    width: "100%",
  },
  mainContent: {
    padding: "120px 8% 60px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "60px",
    position: "relative",
  },
  protocolTag: {
    fontFamily: "monospace",
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "2px",
  },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "4rem",
    margin: "10px 0",
    letterSpacing: "4px",
  },
  scanLine: {
    width: "60px",
    height: "2px",
    backgroundColor: "#d4ff00",
    marginTop: "10px",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "40px",
  },
  section: {
    borderLeft: "1px solid #222",
    paddingLeft: "25px",
  },
  sectionTitle: {
    fontFamily: "var(--font-bebas)",
    fontSize: "1.5rem",
    color: "#888",
    marginBottom: "15px",
    letterSpacing: "2px",
  },
  text: {
    color: "#ccc",
    lineHeight: "1.8",
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
  },
  footer: {
    marginTop: "80px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "20px",
  },
  footerText: {
    fontFamily: "monospace",
    fontSize: "0.6rem",
    color: "#444",
    letterSpacing: "1px",
  },
};
