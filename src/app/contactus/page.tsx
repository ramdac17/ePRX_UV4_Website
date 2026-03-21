"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [status, setStatus] = useState("IDLE");

  // 1. Add state to capture form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("TRANSMITTING...");

    try {
      // 2. Replace 'YOUR_FORMSPREE_ID' with the ID from formspree.io
      const response = await fetch("https://formspree.io/f/xnjgyprn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("LINK_ESTABLISHED");
        setFormData({ name: "", email: "", message: "" }); // Reset form
        setTimeout(() => setStatus("IDLE"), 5000);
      } else {
        setStatus("UPLINK_ERROR");
        setTimeout(() => setStatus("IDLE"), 3000);
      }
    } catch (error) {
      setStatus("CONNECTION_FAILED");
      setTimeout(() => setStatus("IDLE"), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <div style={styles.logoContainer}>
          <img
            src="/assets/images/eprx-logo.png"
            alt="PRX Logo"
            style={styles.brandLogo}
          />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.title}
        >
          CONTACT <span style={{ color: "#d4ff00" }}>PRX</span>
        </motion.h1>
        <p style={styles.subtitle}>
          ESTABLISH COMMUNICATION LINK ||{" "}
          <span style={{ color: "#d4ff00" }}>PINOY RUNNER EXTREME</span> || EST
          2013
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.wrapper}
      >
        <div style={styles.infoSection}>
          <div style={styles.briefingHeader}>
            <span style={styles.value}>
              For any concern, inquiry or suggestion, please fill out the form
              and we will get back to you as soon as possible. Thank you for
              supporting our website and being part of our community!
            </span>
          </div>
          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.label}>ENCRYPTED EMAIL</span>
              <span style={styles.value}>pinoyrunnerextreme@gmail.com</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>SECURE LINE</span>
              <span style={styles.value}>+63 (999) 4706868</span>
            </div>
          </div>

          <div style={styles.statusBox}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor:
                  status === "IDLE"
                    ? "#d4ff00"
                    : status === "LINK_ESTABLISHED"
                      ? "#fff"
                      : "#ff3e3e",
              }}
            />
            <span style={styles.statusText}>STATUS: {status}</span>
          </div>
        </div>

        <div style={styles.formSection}>
          <div style={styles.formHeader}>
            <span style={styles.label}>DATA INPUT</span>
            <span style={{ ...styles.label, color: "#d4ff00" }}>{status}</span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>FULL NAME</label>
              <input
                type="text"
                name="name" // Required for Formspree
                required
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="NAME / CALLSIGN"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email" // Required for Formspree
                required
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="EMAIL ENCRYPTED"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>TRANSMISSION PACKET</label>
              <textarea
                name="message" // Required for Formspree
                required
                value={formData.message}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="ENTER MESSAGE..."
                rows={4}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...styles.button,
                backgroundColor: status === "EMAIL SENT" ? "#fff" : "#d4ff00",
                color: "#000",
              }}
              disabled={status !== "IDLE"}
            >
              {status === "IDLE" ? "SEND MESSAGE" : status}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ... styles remain the same as your provided code ...
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#050505",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 5%",
    color: "#fff",
    fontFamily: "monospace",
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: "50px",
  },
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
  brandLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    letterSpacing: "2px",
    margin: 0,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "0.65rem",
    letterSpacing: "4px",
    color: "#444",
    marginTop: "8px",
  },
  wrapper: {
    width: "100%",
    maxWidth: "1000px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    overflow: "hidden",
  },
  infoSection: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #1a1a1a",
  },
  briefingHeader: {
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "15px",
    marginBottom: "30px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.6rem",
    color: "#444",
    letterSpacing: "2px",
  },
  value: {
    fontSize: "0.9rem",
    letterSpacing: "1px",
    color: "#fff",
    fontWeight: "bold",
  },
  statusBox: {
    marginTop: "40px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    border: "1px solid #1a1a1a",
    backgroundColor: "#050505",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    boxShadow: "0 0 8px currentColor",
  },
  statusText: {
    fontSize: "0.55rem",
    letterSpacing: "1px",
    color: "#666",
  },
  formSection: {
    padding: "40px",
    backgroundColor: "#0d0d0d",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
    borderBottom: "1px solid #222",
    paddingBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputLabel: {
    fontSize: "0.6rem",
    letterSpacing: "1px",
    color: "#d4ff00",
    opacity: 0.7,
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #222",
    padding: "10px 0",
    color: "#fff",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 0.3s",
  },
  textarea: {
    backgroundColor: "#050505",
    border: "1px solid #222",
    padding: "15px",
    color: "#fff",
    outline: "none",
    fontSize: "0.9rem",
    resize: "none",
    fontFamily: "monospace",
  },
  button: {
    marginTop: "10px",
    padding: "18px",
    border: "none",
    fontWeight: "bold",
    letterSpacing: "4px",
    cursor: "pointer",
    fontSize: "0.7rem",
    transition: "all 0.3s",
  },
};
