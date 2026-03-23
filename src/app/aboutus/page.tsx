"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const sections = [
    {
      id: "01",
      title: "THE MISSION",
      content:
        "PRX (PINOY RUNNER EXTREME) IS ENGINEERED TO BRIDGE THE GAP BETWEEN ARCHAIZED DATA SYSTEMS AND THE FUTURE OF SECURE DIGITAL INTERACTION. OUR GOAL IS ABSOLUTE CONNECTIVITY WITHOUT COMPROMISE.",
    },
    {
      id: "02",
      title: "THE TECH",
      content:
        "BUILT ON A FOUNDATION OF NEXT-GEN REACT ARCHITECTURE AND POSTGRESQL CORE, OUR SYSTEM ENSURES SUB-MILLISECOND LATENCY AND ENCRYPTED PROFILE INTEGRITY.",
    },
    {
      id: "03",
      title: "THE VISION",
      content:
        "WE ARE NOT JUST BUILDING A PLATFORM; WE ARE ARCHITECTING AN ECOSYSTEM FOR ELITE ATHLETES WHO DEMAND EFFICIENCY, SPEED, AND MINIMALIST PRECISION.",
    },
  ];

  const admins = [
    {
      name: "Merric Kyo Evangelista",
      role: "SYSTEM ARCHITECT | LEAD DEVELOPER",
      img: "/assets/images/MerricV5.jpg",
      bio: "LEAD ARCHITECT RESPONSIBLE FOR THE CORE STRUCTURE AND DATA UPLINK PROTOCOLS. SPECIALIZES IN HIGH-AVAILABILITY CLOUD INFRASTRUCTURE.",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Brand Logo Section */}
        <div style={styles.logoContainer}>
          <img
            src="/assets/images/eprx-logo.png"
            alt="PRX Logo"
            style={styles.brandLogo}
          />
        </div>

        {/* Header Section */}
        <header style={styles.header}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.version}
          >
            CORE SYSTEM ||{" "}
            <span style={{ color: "#d4ff00" }}>PINOY RUNNER EXTREME</span> ||
            EST 2013
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={styles.mainTitle}
          >
            ABOUT <span style={{ color: "#d4ff00" }}>PRX</span>
          </motion.h1>

          {/* ⚡ NEW: Hero Image & Mock Description */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={styles.heroContainer}
          >
            <div style={styles.imageFrame}>
              <img
                src="/assets/images/prx-pastel.png" // Ensure this path is correct
                alt="PRX Operational Interface"
                style={styles.heroImage}
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
              <div style={styles.imageOverlay} />
            </div>
            <p style={styles.heroDescription}>
              <span style={{ color: "#d4ff00" }}>PINOY RUNNER EXTREME</span>{" "}
              REPRESENTS THE APEX OF DURABILITY AND DIGITAL SYNERGY. THE
              INTERFACE ABOVE DEPICTS OUR GLOBAL NODE NETWORK, FACILITATING
              REAL-TIME DATA TRANSMISSION FOR THE MODERN ENDURANCE ATHLETE.
            </p>
          </motion.div>
        </header>

        {/* Mission/Tech/Vision Grid */}
        <div style={styles.grid}>
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={styles.card}
            >
              <span style={styles.cardNumber}>{section.id}</span>
              <h3 style={styles.cardTitle}>{section.title}</h3>
              <p style={styles.cardText}>{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Meet the Admins Section */}
        <div style={styles.adminSection}>
          <h2 style={styles.adminSectionTitle}>
            <span style={{ color: "#d4ff00" }}>|</span> OPERATOR LOGS || MEET
            THE ADMINS
          </h2>

          <div style={styles.adminList}>
            {admins.map((admin, i) => (
              <motion.div
                key={admin.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  ...styles.adminRow,
                  flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <div style={styles.profileContainer}>
                  <div style={styles.profileCircle}>
                    <img
                      src={admin.img}
                      alt={admin.name}
                      style={styles.profileImg}
                    />
                  </div>
                  <div style={styles.scanLine} />
                </div>

                <div
                  style={{
                    ...styles.adminInfo,
                    textAlign: i % 2 === 0 ? "left" : "right",
                    alignItems: i % 2 === 0 ? "flex-start" : "flex-end",
                  }}
                >
                  <span style={styles.adminRoleLabel}>{admin.role}</span>
                  <h3 style={styles.adminName}>{admin.name}</h3>
                  <div
                    style={{
                      ...styles.bioDivider,
                      marginLeft: i % 2 === 0 ? "0" : "auto",
                      marginRight: i % 2 === 0 ? "auto" : "0",
                    }}
                  />
                  <p style={styles.adminBio}>{admin.bio}</p>
                  <div style={styles.adminStats}>
                    <span style={styles.statLabel}>
                      STATUS: <span style={{ color: "#d4ff00" }}>ACTIVE</span>
                    </span>
                    <span style={styles.statLabel}>
                      CLEARANCE: <span style={{ color: "#fff" }}>ADMIN</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tactical Specs Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={styles.specBox}
        >
          {["UPTIME", "PROTOCOL", "LOCATION", "STATUS"].map((label) => (
            <div key={label} style={styles.specItem}>
              <span style={styles.specLabel}>{label}</span>
              <span
                style={{
                  ...styles.specValue,
                  color: label === "STATUS" ? "#d4ff00" : "#fff",
                }}
              >
                {label === "UPTIME"
                  ? "99.99%"
                  : label === "PROTOCOL"
                    ? "HTTPS/SECURE"
                    : label === "LOCATION"
                      ? "DISTRIBUTED NODE"
                      : "OPERATIONAL"}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  // ... (All previous styles remain intact)
  container: {
    backgroundColor: "#050505",
    minHeight: "100vh",
    padding: "60px 8%",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    fontFamily: "monospace",
  },
  wrapper: { maxWidth: "1100px", width: "100%" },
  logoContainer: {
    width: "100px",
    height: "100px",
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px auto",
    marginTop: "40px",
    border: "2px solid #d4ff00",
    overflow: "hidden",
  },
  brandLogo: { width: "100%", height: "100%", objectFit: "contain" },
  header: {
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  version: {
    fontSize: "0.6rem",
    color: "#444",
    letterSpacing: "5px",
    marginBottom: "10px",
  },
  mainTitle: {
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    margin: "0 0 40px 0",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: "900",
  },

  // ⚡ NEW STYLES
  heroContainer: {
    width: "100%",
    maxWidth: "900px",
    marginTop: "20px",
  },
  imageFrame: {
    position: "relative",
    border: "1px solid #1a1a1a",
    padding: "10px",
    backgroundColor: "#080808",
  },
  heroImage: {
    width: "100%",
    height: "auto",
    maxHeight: "450px",
    objectFit: "cover",
    // filter: "grayscale(100%) contrast(1.1)",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, transparent 70%, #050505)",
    pointerEvents: "none",
  },
  heroDescription: {
    fontSize: "0.75rem",
    lineHeight: "1.6",
    color: "#666",
    marginTop: "20px",
    textAlign: "left",
    letterSpacing: "1px",
    borderLeft: "2px solid #d4ff00",
    paddingLeft: "20px",
    fontFamily: "monospace",
  },

  // ... (Rest of styles)
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "120px",
  },
  card: {
    backgroundColor: "#0a0a0a",
    padding: "40px 30px",
    border: "1px solid #1a1a1a",
    position: "relative",
  },
  cardNumber: {
    fontSize: "0.6rem",
    color: "#d4ff00",
    position: "absolute",
    top: "15px",
    right: "15px",
    opacity: 0.5,
  },
  cardTitle: {
    fontSize: "0.8rem",
    letterSpacing: "3px",
    color: "#fff",
    marginBottom: "20px",
    borderLeft: "2px solid #d4ff00",
    paddingLeft: "15px",
  },
  cardText: { fontSize: "0.85rem", lineHeight: "1.8", color: "#777" },
  adminSection: {
    marginTop: "60px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "100px",
    marginBottom: "120px",
  },
  adminSectionTitle: {
    fontSize: "0.75rem",
    letterSpacing: "5px",
    color: "#fff",
    textAlign: "center",
    marginBottom: "80px",
  },
  adminList: { display: "flex", flexDirection: "column", gap: "120px" },
  adminRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "80px",
    width: "100%",
    flexWrap: "wrap",
  },
  profileContainer: { position: "relative" },
  profileCircle: {
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    border: "1px solid #222",
    padding: "10px",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  scanLine: {
    position: "absolute",
    top: "10%",
    left: "-15px",
    width: "2px",
    height: "80%",
    backgroundColor: "#d4ff00",
    opacity: 0.4,
  },
  adminInfo: {
    flex: 1,
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
  },
  adminName: {
    fontSize: "2.5rem",
    letterSpacing: "1px",
    color: "#fff",
    margin: "5px 0 20px 0",
    fontWeight: "800",
  },
  adminRoleLabel: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "4px",
    fontWeight: "bold",
  },
  bioDivider: {
    width: "60px",
    height: "1px",
    backgroundColor: "#d4ff00",
    marginBottom: "25px",
  },
  adminBio: {
    fontSize: "0.9rem",
    lineHeight: "1.8",
    color: "#888",
    letterSpacing: "0.5px",
  },
  adminStats: { marginTop: "30px", display: "flex", gap: "30px" },
  statLabel: { fontSize: "0.6rem", letterSpacing: "2px", color: "#444" },
  specBox: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },
  specItem: { display: "flex", flexDirection: "column", gap: "5px" },
  specLabel: { fontSize: "0.55rem", color: "#444", letterSpacing: "3px" },
  specValue: { fontSize: "0.75rem", letterSpacing: "2px", fontWeight: "bold" },
};
